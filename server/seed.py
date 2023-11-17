from app import app
from models import db, Client, Artist, Shop, Appointment, Picture, Review, User
import datetime

with app.app_context():

    Client.query.delete()
    Appointment.query.delete()
    Artist.query.delete()
    Shop.query.delete()
    Picture.query.delete()
    Review.query.delete()
    User.query.delete()

    user1 = User(username = 'Roqit', email = 'example@example')
    user2 = User(username = 'Roqit1', email = 'example@example1')
    user3 = User(username = 'Roqit2', email = 'example@example2')
    user4 = User(username = 'Roqit3', email = 'example@example3')
    user5 = User(username = 'Roqit4', email = 'example@example4')
    user1.password_hash = 'Abc1231'
    user2.password_hash = 'Abc1231'
    user3.password_hash = 'Abc1231'
    user4.password_hash = 'Abc1231'
    user5.password_hash = 'Abc1231'
    db.session.add_all([user1, user2, user3, user4, user5])
    db.session.commit()

    user6 = User(username = 'Roqit5', email = 'example@example5')
    user7 = User(username = 'Roqit6', email = 'example@example6')
    user8 = User(username = 'Roqit7', email = 'example@example7')
    user9 = User(username = 'Roqit8', email = 'example@example8')
    user6.password_hash = 'Abc1231'
    user7.password_hash = 'Abc1231'
    user8.password_hash = 'Abc1231'
    user9.password_hash = 'Abc1231'
    db.session.add_all([user6, user7, user8, user9])
    db.session.commit()

    client1 = Client(name='Jeffery', user_id = user2.id)
    client2 = Client(name='Rosa', user_id = user3.id)
    client3 = Client(name='Lucas', user_id = user4.id)
    db.session.add_all([client1, client2, client3])
    db.session.commit()

    artist1 = Artist(name='Donovan', user_id = user1.id)
    artist2 = Artist(name='Monk', user_id = user5.id)
    artist3 = Artist(name='Aubs', user_id = user6.id)
    db.session.add_all([artist1, artist2, artist3])
    db.session.commit()

    shop1 = Shop(name='Bad Apple', location='Las Vegas', user_id = user7.id)
    shop2 = Shop(name='Iron Monk Society', location='Las Vegas', user_id = user8.id)
    shop3 = Shop(name='Revolution', location='Las Vegas', user_id = user9.id)
    db.session.add_all([shop1, shop2, shop3])
    db.session.commit()

    appt1 = Appointment(time =datetime.time(17, 45), date =datetime.date(2023, 10, 29), artist_id = artist3.id, client_id = client2.id, shop_id = shop1.id)
    appt2 = Appointment(time =datetime.time(16, 30), date =datetime.date(2023, 11, 23), artist_id = artist1.id, client_id = client1.id, shop_id = shop3.id)
    db.session.add_all([appt1, appt2])
    db.session.commit()

    pic1 = Picture(file = 'something.jpeg', artist_id = artist1.id)
    pic2 = Picture(file = 'something.jpeg', artist_id = artist1.id)
    pic3 = Picture(file = 'something.jpeg', artist_id = artist2.id)
    pic4 = Picture(file = 'something.jpeg', artist_id = artist3.id)
    db.session.add_all([pic1, pic2, pic3, pic4])
    db.session.commit()

    rev1 = Review(comment = 'clean lines, great shading', client_id = client1.id, artist_id = artist1.id)
    rev2 = Review(comment = 'Amazing realism in my portrait that I got from Aubs', client_id = client3.id, artist_id = artist3.id)
    rev3 = Review(comment = 'Love the whimsicality of my Disney piece!', client_id = client2.id, artist_id = artist3.id)
    db.session.add_all([rev1, rev2, rev3])
    db.session.commit()