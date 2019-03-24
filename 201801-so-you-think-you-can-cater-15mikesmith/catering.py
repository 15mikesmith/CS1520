from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)
app.secret_key = "key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///catering.db'
db = SQLAlchemy(app)

s = {}

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))

    def __repr__(self):
        return "<Customer {}>".format(repr(self.username))


class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
    posts = db.relationship('Event', backref='worker',lazy ='dynamic')

    def __repr__(self):
        return "<Staff {}>".format(repr(self.username))


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(120), unique=True)
    staff_username = db.Column(db.Integer, db.ForeignKey('staff.username'))
    worker1 = db.Column(db.String(120))
    worker2 = db.Column(db.String(120))
    worker3 = db.Column(db.String(120))
    customer = db.Column(db.String(120))

    def __repr__(self):
        return "<Event {}>".format(repr(self.date))



db.create_all()

customer1 = Customer(username='mike', password='one')
customer2 = Customer(username='mack', password='two')

staff1 = Staff(username='mick', password='three')
staff2 = Staff(username='matt', password='four')
staff3 = Staff(username='mark', password='five')

event1 = Event(date='1/1/2018',worker1='mick',worker2='matt',worker3='mark',customer='mike')
event2 = Event(date='1/2/2018',worker1='mick',worker2='matt',worker3='mark',customer='mack')
event3 = Event(date='1/3/2018',worker2='matt',worker3='mark',customer='mack')
event4 = Event(date='1/4/2018',worker1='mick',worker3='mark',customer='mack')
event5 = Event(date='1/5/2018',worker1='mick',worker2='matt',customer='mack')


# db.session.add(customer1)
# db.session.add(customer2)
#
# db.session.add(staff1)
# db.session.add(staff2)
# db.session.add(staff3)
#
# db.session.add(event1)
# db.session.add(event2)
# db.session.add(event3)
# db.session.add(event4)
# db.session.add(event5)

db.session.commit()

cust = Customer.query.all()
staff = Staff.query.all()
events = Event.query.all()

def addWorker(name, event):
    if event.worker1 == None:
        event.worker1 = name
    elif event.worker2 == None:
        event.worker2 = name
    else:
        event.worker3 = name


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

def eventExists(date, events):
    for i in events:
        if date == i.date:
            return True
    return False

def staffExists(s, staff):
    for i in staff:
        if s == i.username:
            return True
    return False

def custExists(c, cust):
    for i in cust:
        if c == i.username:
            return True
    return False

@app.route("/owner", methods=['GET', 'POST'])
def ownerPage():
    x = Event.query.all()
    if request.method == 'POST':
        n = request.form['staffName']
        p = request.form['staffPw']

        allStaff = Staff.query.all()
        allCust = Customer.query.all()
        if staffExists(n, allStaff) != True and custExists(n,allCust) != True:
            newStaff = Staff(username=n, password=p)
            db.session.add(newStaff)
            db.session.commit()
            x = Event.query.all()
            message = 'Staff account created!'
            return render_template('ownerPage.html', username='owner', status='owner', events=x,msg=message)
        else:
            #print("Hi2")
            #x = Event.query.all()
            message = 'There is already an account with this name'
            return render_template('ownerPage.html', username='owner', status='owner', events=x, msg=message)

    return render_template('ownerPage.html',username='owner',status='owner',events=x)

@app.route("/staff", methods=['GET', 'POST'])
def staffPage():
    x = Event.query.all()
    if request.method == 'POST':
        #print(request.form['btn'])
        #print(request.form['eventToSignUp'])
        if request.form["btn"] == "Sign Up":
            dateToSignUp = str(request.form['eventToSignUp'])
            print(dateToSignUp)
            toSignup = Event.query.filter_by(date=dateToSignUp).first()

            #Add worker to event
            addWorker(s.get('currUser'),toSignup)

            db.session.commit()
            x = Event.query.all()
            return render_template('staffPage.html', username=s.get('currUser'), status='staff', events=x)

    return render_template('staffPage.html',username=s.get('currUser'),status='staff',events=x)

@app.route("/customer", methods=['GET', 'POST'])
def customerPage():
    x = Event.query.all()

    if request.method == 'POST':
        # print("Hi2")
        # print(request.form['eventDate'])
        # print(request.form['name'])
        # print("Hi3")
        if request.form["btn"] == "Cancel":
            dateToDelete = str(request.form['eventToDelete'])
            #print(dateToDelete)
            toDel = Event.query.filter_by(date=dateToDelete).first()
            print(toDel)
            db.session.delete(toDel)
            db.session.commit()
            x = Event.query.all()
            return render_template('customerPage.html', username=s.get('currUser'), status='customer', events=x)

        e = request.form['eventDate']
        #n = request.form['name']

        #print("Hi")
        #If date already in database then dont add
        if eventExists(e,x) != True:
            newEvent = Event(date=e,customer=s.get('currUser'))
            db.session.add(newEvent)
            db.session.commit()
            x = Event.query.all()
            return render_template('customerPage.html', username=s.get('currUser'), status='customer', events=x)
        else:
            #print("Hi2")
            x = Event.query.all()
            message = 'There is already an event scheduled for this day'
            return render_template('customerPage.html', username=s.get('currUser'), status='customer', events=x,msg=message)

    return render_template('customerPage.html',username=s.get('currUser'),status='customer',events=x)


# Route for handling the login page logic
@app.route('/', methods=['GET', 'POST'])
def login():
    cust = Customer.query.all()
    staff = Staff.query.all()
    events = Event.query.all()
    error = None
    if request.method == 'POST':

        if request.form["btn"] == "Submit":
            userToAdd = str(request.form['username'])
            pwToAdd = str(request.form['password'])

            custToAdd = Customer(username=userToAdd, password=pwToAdd)

            #Check whether user already exists
            if(usernameValid(userToAdd, cust) != True and staffExists(userToAdd, staff) != True):

                db.session.add(custToAdd)
                db.session.commit()

                s['currUser'] = userToAdd
                s['currPW'] = pwToAdd

                return redirect(url_for('customerPage'))
            else:
                error = 'User already exists'
                return render_template('login.html', error=error)


        user = request.form['username']
        pw = request.form['password']

        s['currUser'] = user
        s['currPW'] = pw

        if request.form['username'] == 'owner' and request.form['password'] == 'pass':
            return redirect(url_for('ownerPage'))


        elif usernameValid(user,cust) and passwordValid(pw,cust):
            return redirect(url_for('customerPage'))

        elif usernameValid(user,staff) and passwordValid(pw,staff):
            return redirect(url_for('staffPage'))

        else:
            error = 'Invalid Credentials. Please try again.'

    return render_template('login.html', error=error)


if __name__ == "__main__":
    app.run()