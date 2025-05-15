#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from datetime import datetime

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Exercise, Category



# Views go here!

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.authenticate(data.get('password')):
            # return full info to limit get requests
            session['user_id'] = user.id
            categories = Category.query.all()
            raw_cats = user.categories
            unique_cats = {c.id: c for c in raw_cats}.values()
            user_cats = [c.to_dict() for c in unique_cats]
            user_data = user.to_dict()
            user_data['categories'] = user_cats
            return {
                'user': user_data,
                'categories': [c.to_dict() for c in categories]
            }, 200
        return {'error': 'Invalid username or password'}, 401

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {}, 204

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            # get full info to limit get requests
            user = User.query.get(user_id)
            categories = Category.query.all()
            raw_cats = user.categories
            unique_cats = {c.id: c for c in raw_cats}.values()
            user_cats = [c.to_dict() for c in unique_cats]
            user_data = user.to_dict()
            user_data['categories'] = user_cats
            return {
                'user': user_data,
                'categories': [c.to_dict() for c in categories]
            }, 200
        return {'error': 'Unauthorized'}, 401
    
class Register(Resource):
    def post(self):
        data = request.get_json()
        user = User(username=data['username'])
        user.password_hash = data['password']
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return user.to_dict(), 201
    

class CategoriesResource(Resource):
    def get(self):
        categories = Category.query.all()
        return [c.to_dict() for c in categories], 200

    def post(self):
        data = request.get_json()
        category = Category(name=data['name'])
        db.session.add(category)
        db.session.commit()
        return category.to_dict(), 201
    
class ExercisesResource(Resource):
    def get(self):
        # only return the logged-in user's exercises, grouped by category
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401

        grouped = []
        categories = Category.query.all()
        for cat in categories:
            ex_list = Exercise.query.filter_by(
                user_id=user_id,
                category_id=cat.id
            ).all()
            if ex_list:
                grouped.append({
                    'category': cat.to_dict(),
                    'exercises': [e.to_dict() for e in ex_list]
                })

        return grouped, 200
    

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401

        data = request.get_json()
        exercise = Exercise(
            name=data['name'],
            record=data['record'],
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            user_id=user_id,
            category_id=data['category_id']
        )
        db.session.add(exercise)
        db.session.commit()
        return exercise.to_dict(), 201
    

class ExerciseResource(Resource):
    def patch(self, id):
        user_id = session.get('user_id')
        exercise = Exercise.query.get_or_404(id)
        if not user_id or exercise.user_id != user_id:
            return {'error': 'Unauthorized'}, 401

        data = request.get_json()
        if 'name' in data:
            exercise.name = data['name']
        if 'record' in data:
            exercise.record = data['record']
        if 'date' in data:
            exercise.date = datetime.strptime(data['date'], '%Y-%m-%d')
        if 'category_id' in data:
            exercise.category_id = data['category_id']

        db.session.commit()
        return exercise.to_dict(), 200
    def delete(self, id):
        user_id = session.get('user_id')
        exercise = Exercise.query.get_or_404(id)
        if not user_id or exercise.user_id != user_id:
            return {'error': 'Unauthorized'}, 401

        db.session.delete(exercise)
        db.session.commit()
        return '', 204


api.add_resource(ExercisesResource, '/exercises')
api.add_resource(ExerciseResource, '/exercises/<int:id>')
api.add_resource(CategoriesResource, '/categories')
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')



@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

