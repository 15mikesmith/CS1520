from flask import json
from flask import session
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)
app.secret_key = "key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
db = SQLAlchemy(app)

#s = {}

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(64), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return '{}'.format(self.username)


class Message(db.Model):
    message_id = db.Column(db.Integer, primary_key=True)
    message_text = db.Column(db.String(128), nullable=False)
    username = db.Column(db.String(64), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.room_id'))

    def __init__(self, message_text, username, room_id):
        self.message_text = message_text
        self.username = username
        self.room_id = room_id

    def __repr__(self):
        return '{}'.format(self.message_text)


class Room(db.Model):
    room_id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(64), nullable=False)
    messages = db.relationship('Message', backref='room', lazy='dynamic')
    username = db.Column(db.String(64), nullable=False)

    def __init__(self, room_name):
        self.room_name = room_name

    def __repr__(self):
        return '{}'.format(self.room_name)




db.create_all()

#user1 = User(username='mike', password='one')

#room1 = Room(username='mick', password='three')


#message1 = Message(date='1/1/2018',worker1='mick',worker2='matt',worker3='mark',customer='mike')


#db.session.add(user1)
# db.session.add(staff1)
# db.session.add(event1)

db.session.commit()

def usernameValid(name, listOfNames):
    for i in listOfNames:
        if(name == i.username):
            return True

    return False

def passwordValid(pw, listOfNames):
    for i in listOfNames:
        if (pw == i.password):
            return True

    return False

def deleteMessages(room_id, messages):
    for i in messages:
       if i.room_id == room_id:
           db.session.delete(i)
            #print(i.message_text)
    db.session.commit()

@app.route('/', methods=['GET', 'POST'])
def login():
    users = User.query.all()

    error = None
    #If creating a new account/user
    if request.method == 'POST':

        if request.form["btn"] == "Submit":
            userToAdd = str(request.form['username'])
            pwToAdd = str(request.form['password'])

            custToAdd = User(username=userToAdd, password=pwToAdd)
            #print("Hello")

            #Check whether user already exists
            if(usernameValid(userToAdd, users) != True ):

                db.session.add(custToAdd)
                db.session.commit()


                session['currUser'] = userToAdd
                session['currPW'] = pwToAdd
                u = User.query.filter_by(username=userToAdd).first()
                session['user_id'] = u.user_id

                return redirect(url_for('room_list'))
            else:
                error = 'User already exists'
                return render_template('login.html', error=error)

        #logging in new user
        user = request.form['username']
        pw = request.form['password']

        session['currUser'] = user
        session['currPW'] = pw



        #If credentials are valid then give room_list
        if usernameValid(user,users) and passwordValid(pw,users):
            # Get the user
            u = User.query.filter_by(username=user).first()
            session['user_id'] = u.user_id
            if 'url' in session and session['url'] != None:
                room = Room.query.filter_by(room_id=session['url']).first()
                session['room_id'] = session['url']
                return render_template('room.html', chatroom=room)
            else:
                return redirect(url_for('room_list'))

        else:
            error = 'Invalid Credentials. Please try again.'


    return render_template('login.html', error=error)



@app.route('/room_list', methods=['GET', 'POST'])
def room_list():
    #If delete button is pressed

    session['url'] = None
    if request.method == 'POST':
        if request.form["btn"] == "Delete":
            dateToDelete = str(request.form['roomToDelete'])
            # print(dateToDelete)

            toDel = Room.query.filter_by(room_id=dateToDelete).first()

            #Delete all messages affilated with that room
            m = Message.query.all()
            deleteMessages(toDel.room_id,m)
            print(toDel)
            db.session.delete(toDel)
            db.session.commit()
            x = Room.query.all()
            return render_template('rooms.html', chatrooms=x, username=session['currUser'])


    session['room_id'] = None
    rooms = Room.query.all()
    return render_template('rooms.html', chatrooms=rooms,username=session['currUser'])

#Function to add new room
@app.route('/create_room', methods=['POST'])
def create_room():
    new_room = Room(request.form['roomname'])
    new_room.username = session['currUser']
    db.session.add(new_room)
    db.session.commit()
    return redirect(url_for('room_list'))

@app.route('/room_<room_id>', methods=['GET', 'POST'])
def room(room_id):
    room = Room.query.filter_by(room_id=room_id).first()
    session['room_id'] = room_id
    session['url'] = room_id
    return render_template('room.html', chatroom=room)

#Function to add new message
@app.route("/new_message", methods=["POST"])
def new_message():
    #print("Hello")
    text = request.form["message"]
    room_id = session['room_id']
    user_id = session['user_id']

    room = Room.query.filter_by(room_id=room_id).first()
    user = User.query.filter_by(user_id=user_id).first()

    message = Message(text, user.username, room_id)
    room.messages.append(message)
    db.session.add(message)
    db.session.commit()

    list = {user.username: text}
    return json.dumps(list)


@app.route("/messages")
def get_messages():
    messages = Message.query.filter_by(room_id=session['room_id']).all()
    message_list = {}
    index = 0
    for m in messages:
        new_message = {m.username: m.message_text}
        message_list[index] = new_message
        index = index + 1
    return json.dumps(message_list)


if __name__ == "__main__":
    app.run(threaded=True)