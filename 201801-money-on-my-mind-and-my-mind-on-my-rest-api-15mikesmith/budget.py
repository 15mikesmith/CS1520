from flask import Flask
from flask import render_template
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

# PURCHASES = {
#     'purchase1': {'name': 'water','amount': 16,'category': 'house','date': '4/16/1997'},
#     'purchase2': {'name': 'burger','amount': 51,'category': 'food','date': '1/1/1960'},
#     'purchase3': {'name': 'toilet','amount': 89,'category': 'rent','date': '5/21/1999'},
# }

#These hold the purchases and Categories

PURCHASES = {}
CATEGORIES = {}

# CATEGORIES = {
#     'category1': {'total': 300,'limit': 300,'name': 'rent'},
#     'category2': {'total': 500,'limit': 500,'name': 'car'},
#     'category3': {'total': 700,'limit': 700,'name': 'gas'},
# }

#Error if not exist
def abort_if_purchase_doesnt_exist(purchase_id):
    if purchase_id not in PURCHASES:
        abort(404, message="Purchase {} doesn't exist".format(purchase_id))

parser = reqparse.RequestParser()
parser.add_argument('name')

def subtractFromTotal(newArgs):
    for i in CATEGORIES:
        if CATEGORIES[i]['name'] == newArgs[2]:
            CATEGORIES[i]['total'] = int(CATEGORIES[i]['limit']) - int(newArgs[1])
            #CATEGORIES[i]['total'] = int(CATEGORIES[i]['total']) - int(newArgs[1])


class Purchase(Resource):
    def get(self, purchase_id):
        abort_if_purchase_doesnt_exist(purchase_id)
        return PURCHASES[purchase_id]

    def delete(self, purchase_id):
        abort_if_purchase_doesnt_exist(purchase_id)
        del PURCHASES[purchase_id]
        return '', 204

    def put(self, purchase_id):
        args = parser.parse_args()
        newArgs = args['name'].split(",")
        PURCHASES[purchase_id] = {'name': newArgs[0],'amount': newArgs[1],'category': newArgs[2],'date': newArgs[3]}

        return PURCHASES[purchase_id], 201



class PurchaseList(Resource):
    def get(self):
        return PURCHASES

    def post(self):
        args = parser.parse_args()
        newArgs = args['name'].split(",")
        if(len(PURCHASES.keys()) == 0):
            purchase_id = 'purchase1'
        else:
            purchase_id = int(max(PURCHASES.keys()).lstrip('purchase')) + 1
            purchase_id = 'purchase%i' % purchase_id

        PURCHASES[purchase_id] = {'name': newArgs[0],'amount': newArgs[1],'category': newArgs[2],'date': newArgs[3]}
        subtractFromTotal(newArgs)
        return PURCHASES[purchase_id], 201


api.add_resource(PurchaseList, '/purchases')
api.add_resource(Purchase, '/purchases/<purchase_id>')


#Error if not exist

def abort_if_category_doesnt_exist(category_id):
    if category_id not in CATEGORIES:
        abort(404, message="Category {} doesn't exist".format(category_id))

parser2 = reqparse.RequestParser()
parser2.add_argument('cat')


class Category(Resource):
    def get(self, category_id):
        abort_if_category_doesnt_exist(category_id)
        return CATEGORIES[category_id]

    def delete(self, category_id):
        abort_if_category_doesnt_exist(category_id)
        del CATEGORIES[category_id]
        return '', 204


class CategoryList(Resource):
    def get(self):
        return CATEGORIES

    def post(self):
        args = parser2.parse_args()
        newArgs = args['cat'].split(",")

        if(len(CATEGORIES.keys()) == 0):
            category_id = 'category1'
        else:
            category_id = int(max(CATEGORIES.keys()).lstrip('category')) + 1
            category_id = 'category%i' % category_id
        CATEGORIES[category_id] = {'total': newArgs[1],'limit': newArgs[1],'name': newArgs[0]}

        return CATEGORIES[category_id], 201


api.add_resource(CategoryList, '/cat')
api.add_resource(Category, '/cat/<category_id>')


@app.route('/')
def home():

    return render_template('homepage.html')

if __name__ == '__main__':
    app.run(debug=True)