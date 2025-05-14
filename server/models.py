from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!

# User model with id, username, and password, and excercise associations
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    exercises = db.relationship('Exercise', backref='user', cascade='all, delete-orphan')

    def __init__(self, username, password):
        self.username = username
        self.password = password

#category model with id, name, and exercise associations

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    exercises = db.relationship('Exercise', backref='category', cascade='all, delete-orphan')

    def __init__(self, name):
        self.name = name


# exercise model with id, name, description, and category_id, and user_exercise associations

class Exercise(db.Model, SerializerMixin):
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # e.g., "Bench Press"
    record = db.Column(db.String(500), nullable=False)  # e.g., "200 lbs", "5km in 25min"
    date = db.Column(db.Date, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    def __init__(self, name, record, date, user_id, category_id):
        self.name = name
        self.record = record
        self.date = date
        self.user_id = user_id
        self.category_id = category_id
