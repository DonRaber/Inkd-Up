from flask import make_response, request
from models import db, Client, Artist, Shop, Appointment, Picture, Review, User
from config import db, app

@app.route('/')
def index():
    return '<h1>Inkd Up</h1>'

@app.route('/users', methods = ['POST', 'PATCH', 'DELETE'])
def users():
    users = User.query.all()
    return make_response([user.to_dict(rules = ('-artist.appointments', '-artist.pictures', '-artist.reviews', '-client.appointments', '-client.reviews', '-shop.appointments')) for user in users], 200)

@app.route('/clients', methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def clients():
    clients = Client.query.all()
    return make_response([client.to_dict(rules = ('-reviews.artist',)) for client in clients], 200)

    

@app.route('/artists', methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def artists():
    artists = Artist.query.all()
    return make_response([artist.to_dict(rules = ('-appointments.client', '-reviews.client')) for artist in artists], 200)
    

@app.route('/shops', methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def shops():
    shops = Shop.query.all()
    return make_response([shop.to_dict(rules = ('-appointments.artist', '-appointments.client')) for shop in shops], 200)
    

@app.route('/appointments', methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def appointments():
    appointments = Appointment.query.all()
    return make_response([appointment.to_dict(rules = ('-artist.pictures', '-artist.user', '-artist.reviews', '-client.reviews', '-client.user', '-shop.user')) for appointment in appointments], 200)
    

@app.route('/pictures', methods = ['GET', 'POST', 'DELETE'])
def pictures():
    pictures = Picture.query.all()
    return make_response([picture.to_dict(rules = ('-artist.appointments', '-artist.reviews', '-artist.user')) for picture in pictures], 200)
    

@app.route('/reviews', methods = ['GET', 'POST', 'DELETE'])
def reviews():
    reviews = Review.query.all()
    return make_response([review.to_dict(rules = ('-artist.appointments', '-artist.user', '-artist.pictures', '-client.appointments', '-client.user')) for review in reviews], 200)
    




if __name__ == '__main__':
    app.run(port=5555, debug=True)