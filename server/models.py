from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
import re

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    profilePic = db.Column(db.String)

    client = db.relationship('Client', back_populates = 'user', cascade = 'all, delete-orphan')
    artist = db.relationship('Artist', back_populates = 'user', cascade = 'all, delete-orphan')
    shop = db.relationship('Shop', back_populates = 'user', cascade = 'all, delete-orphan')

    serialize_rules = ('-client.user', '-artist.user', '-shop.user')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    @validates('username')
    def validates_username(self, key, username):
        if 5 <= len(username):
            return username
        else:
            raise ValueError('username must be 5 characters or more')
        
    @validates('password')
    def validates_password(self, key, password):
        if len(password) < 6:
            raise ValueError("Make sure your password is at least 7 characters")
        elif re.search('[0-9]',password) is None:
            raise ValueError("Make sure your password has a number in it")
        elif re.search('[A-Z]',password) is None: 
            raise ValueError("Make sure your password has a capital letter in it")
        else:
            return password
        
    @validates('email')
    def validates_email(self, key, email):
        if 3 <= len(email):
            return email
        else:
            raise ValueError('email must be between 3 and 15 characters, incusive!')

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    appointments = db.relationship('Appointment', back_populates='client', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates = 'client', cascade = 'all, delete-orphan')
    user = db.relationship('User', back_populates = 'client')

    serialize_rules = ('-user.shop', '-user.artist', '-user.client', '-appointments.client', '-reviews.client', '-appointments.artist', '-appointments.shop' )

    @validates('name')
    def validates_name(self, key, name):
        if len(name) > 1:
            return name
        else:
            raise ValueError('name needs to have value')

    def __repr__(self):
        return f'<Client {self.id}, {self.name}>'
    pass

class Artist(db.Model, SerializerMixin):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


    appointments = db.relationship('Appointment', back_populates='artist', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates = 'artist', cascade = 'all, delete-orphan')
    pictures = db.relationship('Picture', back_populates = 'artist', cascade = 'all, delete-orphan')
    user = db.relationship('User', back_populates = 'artist')

    clients = association_proxy('appointments', 'client')

    serialize_rules = ('-appointments.artist', '-reviews.artist', '-pictures.artist', '-user.shop', '-user.artist', '-user.client', '-appointments.client', '-appointments.shop')

    @validates('name')
    def validates_name(self, key, name):
        if len(name) > 1:
            return name
        else:
            raise ValueError('name needs to have value')

    def __repr__(self):
        return f'<Artist {self.id}, {self.name}>'
    pass

class Shop(db.Model, SerializerMixin):
    __tablename__ = 'shops'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


    artists = association_proxy('appointments', 'artist')
    clients = association_proxy('appointments', 'client')

    appointments = db.relationship('Appointment', back_populates = 'shop', cascade = 'all, delete-orphan')
    user = db.relationship('User', back_populates = 'shop')

    serialize_rules = ('-appointments.shop', '-user.shop', '-user.artist', '-user.client')

    @validates('name')
    def validates_name(self, key, name):
        if len(name) > 1:
            return name
        else:
            raise ValueError('name needs to have value')
        
    def __repr__(self):
        return f'<Shop {self.id}, {self.name}, {self.location}>'
    pass

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Time)
    date = db.Column(db.Date)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    shop_id = db.Column(db.Integer, db.ForeignKey('shops.id'))

    artist = db.relationship('Artist', back_populates = 'appointments')
    client = db.relationship('Client', back_populates = 'appointments')
    shop = db.relationship('Shop', back_populates = 'appointments')

    serialize_rules = ('-artist.appointments', '-client.appointments', '-shop.appointments')

    def __repr__(self):
        return f'<Appointment {self.id}, {self.time}, {self.date}, Artist: {self.artist_id}, Client: {self.client_id}, Shop: {self.shop_id}>'
    pass

class Picture(db.Model, SerializerMixin):
    __tablename__ = 'pictures'

    id = db.Column(db.Integer, primary_key=True)
    file = db.Column(db.String)
    artist_id= db.Column(db.Integer, db.ForeignKey('artists.id'))

    artist = db.relationship('Artist', back_populates = 'pictures')

    serialize_rules = ('-artist.pictures', )

    def __repr__(self):
        return f'<Picture {self.id}, {self.file}, Artist {self.artist_id}>'
    pass

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String)
    review_photo = db.Column(db.String)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))

    client = db.relationship('Client', back_populates = 'reviews')
    artist = db.relationship('Artist', back_populates = 'reviews')

    serialize_rules = ('-client.reviews', '-artist.reviews')

    def __repr__(self):
        return f'<Review {self.id}, Client: {self.client_id}, Artist: {self.artist_id}, {self.comment}>'
    pass