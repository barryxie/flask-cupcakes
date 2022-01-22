"""Flask app for Cupcakes"""
from crypt import methods
from flask import Flask, render_template, request, jsonify
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "oh-so-secret"

connect_db(app)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/api/cupcakes')
def get_all_cakes():
    cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()] 
    return jsonify(cupcakes=cupcakes)  

@app.route('/api/cupcakes/<int:id>')
def get_cake(id):
    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.serialize()) 

@app.route('/api/cupcakes', methods=['POST'])
def create_cakes():
    flavor = request.json['flavor']
    size = request.json['size']
    rating = request.json['rating']
    image = request.json.get('image', None)
    cupcake = Cupcake(flavor=flavor,size=size,rating=rating,image=image)

    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()), 201) 


@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def edit_cake(id):
    cupcake = Cupcake.query.get_or_404(id)
    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size',cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)

    db.session.add(cupcake)
    db.session.commit()
    return jsonify(cupcake=cupcake.serialize()) 

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delet_cake(id):
    cupcake = Cupcake.query.get_or_404(id)
    
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(massage="delete")               
