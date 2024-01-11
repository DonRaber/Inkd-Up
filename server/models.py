from sqlalchemy.sql import func
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from botocore.exceptions import NoCredentialsError
import boto3
import re

from config import db, bcrypt, AWS_ACCESS_KEY, AWS_SECRET_KEY



# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class MESSAGE -
# --------------------------------------------------------------------------------------------------------------------------------------------

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    message = db.Column(db.String)
    timestamp = db.Column(db.DateTime, server_default=func.now())
    read = db.Column(db.Boolean, default=False)
    
    sender = db.relationship('User', foreign_keys=[sender_id], back_populates = 'sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates = 'received_messages')
    
    serialize_rules = ('-sender.received_messages', 
                       '-sender.sent_messages', 
                       '-sender._password_hash',
                       '-sender.shop', 
                       '-sender.client', 
                       '-sender.artist',
                       '-receiver.received_messages',
                       '-receiver.sent_messages', 
                       '-receiver._password_hash',
                       '-receiver.shop', 
                       '-receiver.client', 
                       '-receiver.artist')


# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class USER -
# --------------------------------------------------------------------------------------------------------------------------------------------

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    profilePic = db.Column(db.String, default='https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg')

    client = db.relationship('Client', back_populates = 'user', cascade = 'all, delete-orphan')
    artist = db.relationship('Artist', back_populates = 'user', cascade = 'all, delete-orphan')
    shop = db.relationship('Shop', back_populates = 'user', cascade = 'all, delete-orphan')
    
    sent_messages = db.relationship('Message', foreign_keys=[Message.sender_id], back_populates = 'sender', cascade= 'all, delete-orphan')
    received_messages = db.relationship('Message', foreign_keys=[Message.receiver_id], back_populates = 'receiver', cascade= 'all, delete-orphan')

    serialize_rules = ('-received_messages.sender.client',
                       '-received_messages.sender.shop',
                       '-received_messages.sender.artist',
                       '-sent_messages.receiver.client',
                       '-sent_messages.receiver.shop',
                       '-sent_messages.receiver.artist',
                       '-sent_messages.receiver.sent_messages',
                       '-sent_messages.receiver.received_messages',
                       '-client.user',
                       '-artist.user',
                       '-shop.user')

    def upload_profile_picture(self, file):
        try:
            # Replace these values with your S3 bucket details
            S3_BUCKET = 'linkupinkup'

            s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
            print(s3)
            # Generate a unique key for the S3 object (you might want to improve this logic)
            filename = f"{self.id}_{file.filename}"
            s3_key = f"linkupinkup/{filename}"
            print(f'S3 Key: {s3_key}')
            # Upload the file to S3
            s3.upload_fileobj(file, S3_BUCKET, s3_key, ExtraArgs={'ACL': 'public-read'})

            print('upload complete')
            # Update the profile picture URL for the user
            self.profilePic = f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_key}"

            print(self.profilePic)
            # Commit the changes to the database
            db.session.commit()

            return self.profilePic

        except NoCredentialsError:
            print('S3 credentials not available')
            return None
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Access Denied")
    
    @password_hash.setter
    def password_hash(self, password):
        new_hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))

        self._password_hash = new_hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
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
        
        
# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class CLIENT -
# --------------------------------------------------------------------------------------------------------------------------------------------


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


# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class ARTIST -
# --------------------------------------------------------------------------------------------------------------------------------------------

class Artist(db.Model, SerializerMixin):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    specializations_id = db.Column(db.Integer, db.ForeignKey('specializations.id'))


    appointments = db.relationship('Appointment', back_populates='artist', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates = 'artist', cascade = 'all, delete-orphan')
    pictures = db.relationship('Picture', back_populates = 'artist', cascade = 'all, delete-orphan')
    user = db.relationship('User', back_populates = 'artist')
    specializations = db.relationship('Specialization', back_populates = 'artists')

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


# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class SHOP -
# --------------------------------------------------------------------------------------------------------------------------------------------

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


# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class APPOINTMENT -
# --------------------------------------------------------------------------------------------------------------------------------------------

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

    @validates('time', 'date', 'artist_id')
    def validate_double_booking(self, key, value):
        if key == 'time' or key == 'date':
            existing_appointment = Appointment.query.filter_by(
                artist_id = self.artist_id,
                time = self.time,
                date = self.date
            ).first()

        if existing_appointment and existing_appointment.id != self.od:
            raise ValueError(f'Artist is already booked for the selected time and date!')
        
        return value

    def __repr__(self):
        return f'<Appointment {self.id}, {self.time}, {self.date}, Artist: {self.artist_id}, Client: {self.client_id}, Shop: {self.shop_id}>'
    pass


# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class PICTURE -
# --------------------------------------------------------------------------------------------------------------------------------------------

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


# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class REVIEW -
# --------------------------------------------------------------------------------------------------------------------------------------------

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

# --------------------------------------------------------------------------------------------------------------------------------------------
#                                                       - class SPECIALIZATIONS -
# --------------------------------------------------------------------------------------------------------------------------------------------

class Specialization(db.Model, SerializerMixin):
        __tablename__ = 'specializations'

        id = db.Column(db.Integer, primary_key=True)
        type = db.Column(db.String)

        artists = db.relationship('Artist', back_populates = 'specializations')