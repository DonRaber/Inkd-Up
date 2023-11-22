from flask import make_response, request, session
from sqlalchemy.exc import IntegrityError
from models import db, Client, Artist, Shop, Appointment, Picture, Review, User
from config import db, app

@app.route('/')
def index():
    return '<h1>Inkd Up</h1>'

# @app.before_request
# def check_if_logged_in():
#     open_access_list = [
#         'signup',
#         'login',
#         'check_session'
#     ]

#     if request.endpoint not in open_access_list and 'user_id' not in session:
#         return make_response({'error': '401 Unauthorized'}, 401)

@app.route('/signup', methods=['POST'])
def signup():
    request_json = request.get_json()

    username = request_json.get('username')
    password = request_json.get('password')
    email = request_json.get('email')

    user = User(
        username=username,
        email=email,
    )

    # the setter will encrypt this
    user.password_hash = password

    try:
        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id

        return make_response(user.to_dict(), 201)

    except IntegrityError:
        return make_response({'error': '422 Unprocessable Entity'}, 422)

@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.filter(User.id == user_id).first()
        return make_response(user.to_dict(), 200)

    return make_response({}, 401)

@app.route('/login', methods=['POST'])
def login():
    form_data = request.get_json()

    username = form_data['username']
    password = form_data['password']

    user = User.query.filter_by(username = username).first()

    print(user)
    if user:
        if user.authenticate(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)

    return make_response({'error': '401 Unauthorized'}, 401)

@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    return make_response({}, 204)

# -----------------------------------
# USERS
# -----------------------------------

@app.route('/users', methods = ['GET','POST'])
def users():
    users = User.query.all()

    if request.method == 'GET':
        return make_response([user.to_dict(rules = ('-artist.appointments', '-artist.pictures', '-artist.reviews', '-client.appointments', '-client.reviews', '-shop.appointments')) for user in users], 200)
    
    elif request.method == 'POST':
        form_data = request.get_json()
        try:
            new_user = User(
                username = form_data['username'],
                email = form_data['email'],
                password = form_data['password']
            )
            db.session.add(new_user)
            db.session.commit()
            resp = make_response(new_user.to_dict(), 201)
        except ValueError:
            resp = make_response({'error': ['Validation Errors']}, 400)
    return resp

# USER BY ID

@app.route('/users/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def user_by_id(id):
    user = User.query.filter_by(id = id).first()

    if user:

        if request.method == 'GET':
            resp = make_response(user.to_dict(rules = ('-artist.appointments', '-artist.pictures', '-artist.reviews', '-client.appointments', '-client.reviews', '-shop.appointments')), 200)

        elif request.method == 'PATCH':
            form_data = request.get_json()
            print(form_data)
            try:
                for attr in form_data:
                    setattr(user, attr, form_data.get(attr))
                db.session.commit()
                resp = make_response(user.to_dict(), 202)
            except ValueError:
                resp = make_response({'error': ['Validation Errors']}, 400)
                return resp
        
        elif request.method == 'DELETE':
            db.session.delete(user)
            db.session.commit()
            resp = make_response({}, 204)

    else:
        resp = make_response({'error': 'No User Found'}, 404)

    return resp


# -----------------------------------
# CLIENTS
# -----------------------------------

@app.route('/clients', methods = ['GET', 'POST'])
def clients():
    clients = Client.query.all()

    if request.method == 'GET':
        return make_response([client.to_dict(rules = ('-reviews.artist',)) for client in clients], 200)
    
    elif request.method == 'POST':
        form_data = request.get_json()
        try:
            new_client = Client(
                name = form_data['name'],
            )
            db.session.add(new_client)
            db.session.commit()
            resp = make_response(new_client.to_dict(), 201)
        except ValueError:
            resp = make_response({'error': ['Validation Errors']}, 400)
    return resp

# CLIENT BY USER_ID

@app.route('/clients/user_<int:user_id>', methods=['PATCH', 'DELETE'])
def client_by_user_id(user_id):
    client_by_user_id = Client.query.filter_by(user_id = user_id).first()
    if client_by_user_id:

# ---------------- PATCH -----------------------
        if request.method == 'PATCH':
            form_data = request.get_json()
            try:
                for attr in form_data:
                    setattr(client_by_user_id, attr, form_data.get(attr))
                db.session.commit()
                resp = make_response(client_by_user_id.to_dict(), 202)
            except ValueError:
                resp = make_response({ "errors": ["Validation Errors"]}, 400)

# ---------------- DELETE -----------------------

        elif request.method == 'DELETE':
            db.session.delete(client_by_user_id)
            db.session.commit()
            resp = make_response({}, 204)
                
    else:
        resp = make_response({ "error": "No Client Found!"}, 404)
    return resp

# -----------------------------------
# ARTISTS
# -----------------------------------

@app.route('/artists', methods = ['GET', 'POST'])
def artists():
    artists = Artist.query.all()

    if request.method == 'GET':
        return make_response([artist.to_dict(rules = ('-appointments.client', '-reviews.client')) for artist in artists], 200)
    
    elif request.method == 'POST':
        form_data = request.get_json()
        try:
            new_artist = Artist(
                name = form_data['name'],
            )
            db.session.add(new_artist)
            db.session.commit()
            resp = make_response(new_artist.to_dict(), 201)
        except ValueError:
            resp = make_response({'error': ['Validation Errors']}, 400)
    return resp

# ARTIST BY USER_ID

@app.route('/artists/user_<int:user_id>', methods=['PATCH', 'DELETE'])
def artist_by_user_id(user_id):
    artist_by_user_id = Artist.query.filter_by(user_id = user_id).first()
    if artist_by_user_id:

# ---------------- PATCH -----------------------
        if request.method == 'PATCH':
            form_data = request.get_json()
            try:
                for attr in form_data:
                    setattr(artist_by_id, attr, form_data.get(attr))
                db.session.commit()
                resp = make_response(artist_by_id.to_dict(), 202)
            except ValueError:
                resp = make_response({ "errors": ["Validation Errors"]}, 400)

# ---------------- DELETE -----------------------

        elif request.method == 'DELETE':
            db.session.delete(artist_by_user_id)
            db.session.commit()
            resp = make_response({}, 204)
                
    else:
        resp = make_response({ "error": "No Artist Found!"}, 404)
    return resp
    
# -----------------------------------
# SHOPS
# -----------------------------------

@app.route('/shops', methods = ['GET', 'POST'])
def shops():
    shops = Shop.query.all()

    if request.method == 'GET':
        return make_response([shop.to_dict(rules = ('-appointments.artist', '-appointments.client')) for shop in shops], 200)
    
    elif request.method == 'POST':
        form_data = request.get_json()
        try:
            new_shop = Shop(
                name = form_data['name'],
                location = form_data['location']
            )
            db.session.add(new_shop)
            db.session.commit()
            resp = make_response(new_shop.to_dict(), 201)
        except ValueError:
            resp = make_response({'error': ['Validation Errors']}, 400)
    return resp

# SHOP BY USER_ID

@app.route('/shops/user_<int:user_id>', methods=['PATCH', 'DELETE'])
def shop_by_user_id(user_id):
    shop_by_user_id = Shop.query.filter_by(user_id = user_id).first()
    if shop_by_user_id:

# ---------------- PATCH -----------------------
        if request.method == 'PATCH':
            form_data = request.get_json()
            try:
                for attr in form_data:
                    setattr(shop_by_id, attr, form_data.get(attr))
                db.session.commit()
                resp = make_response(shop_by_id.to_dict(), 202)
            except ValueError:
                resp = make_response({ "errors": ["Validation Errors"]}, 400)

# ---------------- DELETE -----------------------

        elif request.method == 'DELETE':
            db.session.delete(shop_by_user_id)
            db.session.commit()
            resp = make_response({}, 204)
                
    else:
        resp = make_response({ "error": "No Shop Found!"}, 404)
    return resp

# -----------------------------------
# APPOINTMENTS
# -----------------------------------

@app.route('/appointments', methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def appointments():
    appointments = Appointment.query.all()
    return make_response([appointment.to_dict(rules = ('-artist.pictures', '-artist.user', '-artist.reviews', '-client.reviews', '-client.user', '-shop.user')) for appointment in appointments], 200)

# -----------------------------------
# PICTURES
# -----------------------------------

@app.route('/pictures', methods = ['GET', 'POST', 'DELETE'])
def pictures():
    pictures = Picture.query.all()
    return make_response([picture.to_dict(rules = ('-artist.appointments', '-artist.reviews', '-artist.user')) for picture in pictures], 200)

# -----------------------------------
# REVIEWS
# -----------------------------------

@app.route('/reviews', methods = ['GET', 'POST', 'DELETE'])
def reviews():
    reviews = Review.query.all()
    return make_response([review.to_dict(rules = ('-artist.appointments', '-artist.user', '-artist.pictures', '-client.appointments', '-client.user')) for review in reviews], 200)
    




if __name__ == '__main__':
    app.run(port=5555, debug=True)