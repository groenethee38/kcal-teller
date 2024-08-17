from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from itertools import groupby
from operator import attrgetter


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    doel = db.Column(db.Integer, nullable=True)
    food_logs = db.relationship('FoodLog', backref='user', lazy=True)

class FoodLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    kcal = db.Column(db.Float, nullable=False)  
    date_added = db.Column(db.DateTime, default=datetime.utcnow)


@app.route('/')
def home():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user is None:
            session.pop('user_id', None)
            return redirect(url_for('login'))

        current_date_str = request.args.get('current_date')
        if current_date_str:
            current_date = datetime.strptime(current_date_str, '%Y-%m-%d').date()
        else:
            current_date = datetime.now().date()

        food_logs = FoodLog.query.filter_by(user_id=user.id).order_by(FoodLog.date_added.desc()).all()
        
        grouped_logs = {}
        daily_kcal_totals = {}
        grouped_by_date = groupby(food_logs, key=lambda x: x.date_added.date())
        for date, items in grouped_by_date:
            items_list = list(items)
            grouped_logs[date] = items_list
            daily_kcal_totals[date] = sum(food.kcal for food in items_list)

        total_kcal = daily_kcal_totals.get(current_date, 0)

        sorted_dates = sorted(grouped_logs.keys())
        
        current_index = sorted_dates.index(current_date) if current_date in sorted_dates else - 1
        previous_date = sorted_dates[current_index - 1] if current_index > 0 else None
        next_date = sorted_dates[current_index + 1] if current_index < len(sorted_dates) - 1 else None
                                         
        return render_template('home.html', user=user, 
                               food_logs=food_logs, 
                               grouped_logs=grouped_logs, 
                               daily_kcal_totals=daily_kcal_totals, 
                               current_date=current_date, 
                               total_kcal=total_kcal,
                               previous_date=previous_date,
                               next_date=next_date)
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        new_user = User(username=username, password=hashed_password, email=email)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return redirect(url_for('home'))
        flash('Invalid credentials')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/edit-doel', methods=['POST'])
def edit_doel():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user = User.query.get(session['user_id'])
    new_doel = request.form['new-doel']

    if not new_doel.isdigit() or not (0 <= int(new_doel) <= 99999):
        flash("Doel moet een heel getal zijn tussen de 0 en 99999")
    else:
        user.doel = int(new_doel)
        db.session.commit()
        return redirect(url_for('home'))

    return redirect(url_for('home'))

@app.route('/add-food', methods=['GET', 'POST'])
def add_food():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        name = request.form['product-name']
        weight = request.form['product-weight']
        kcal = request.form['product-kcal']
        user_id = session['user_id']

        new_food = FoodLog(name=name, weight=weight, kcal=kcal, user_id=user_id)
        db.session.add(new_food)
        db.session.commit()

        return redirect(url_for('home'))
    
    return render_template('home.html')

@app.route('/delete-food/<int:food_id>', methods=['POST'])
def delete_food(food_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    food = FoodLog.query.get_or_404(food_id)
    if food.user_id != session['user_id']:
        return redirect(url_for('home'))

    db.session.delete(food)
    db.session.commit()
    flash('Verwijderd')
    return redirect(url_for('home'))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)