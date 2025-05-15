from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

# Models go here!

# User model with id, username, and password, and excercise associations
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(200), nullable=False)

    # Relationships
    exercises = db.relationship('Exercise', backref='user', cascade='all, delete-orphan')
    categories = association_proxy('exercises', 'category')

    # Serializer settings
    serialize_rules = ('-password_hash', '-_password_hash', '-exercises.user')

    def __repr__(self):
        return f'<User {self.username}>'

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        hashed = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

#category model with id, name, and exercise associations

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    exercises = db.relationship('Exercise', backref='category', cascade='all, delete-orphan')

    serialize_rules = ('-exercises',)


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

    serialize_rules = ('-category.exercises', '-user.exercises')
    def __init__(self, name, record, date, user_id, category_id):
        self.name = name
        self.record = record
        self.date = date
        self.user_id = user_id
        self.category_id = category_id
