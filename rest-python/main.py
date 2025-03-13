import base64
import os
from flask import Flask, request, make_response, jsonify
import jwt
import datetime
from flask_cors import CORS
import pymysql

app = Flask(__name__)
app.config['SECRET_KEY'] = 'this is demo'
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

PICTUREPATH = APP_ROOT + "/static/product"

CORS(app, supports_credentials=True)

conn = pymysql.connect(host="localhost",db="shopping",user="root",password="password")
cursor = conn.cursor()



def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Expires in 1 day
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


@app.route("/adminLogin",methods=['post'])
def adminLogin():
    data = request.json
    if data['email'] == 'admin@gmail.com' and data['password'] == 'admin':
        token = generate_token(data['email'])
        response = make_response(jsonify({'message': 'Login successful', 'token': token}))
        return response
    else:
        response = make_response(jsonify({'message': 'Invalid Login Details'}))
        return response

@app.route('/userLogin', methods=['POST'])
def userLogin():
    data = request.json
    email = data['email']
    password = data['password']
    count = cursor.execute("select * from users where email='"+str(email)+"' and password='"+str(password)+"'")
    if count > 0:
        token = generate_token(email)
        response = make_response(jsonify({'message': 'Login successful', 'token': token}))
        return response
    else:
        response = make_response(jsonify({'message': 'Invalid Login Details'}))
        return response


@app.route("/userReg",methods=['post'])
def userReg():
    data = request.json
    name = data['name']
    email = data['email']
    phone = data['phone']
    password = data['password']
    address = data['address']
    count = cursor.execute("select * from users where email='"+str(email)+"' or phone='"+str(phone)+"'")
    if count == 0:
        cursor.execute("insert into users (name,email,phone,password,address) values ('"+str(name)+"','"+str(email)+"','"+str(phone)+"','"+str(password)+"','"+str(address)+"')")
        conn.commit()
        return make_response(jsonify({'message': 'Registered Successfully'}))
    else:
        return make_response(jsonify({'message': 'Duplicate User Details'}))


@app.route("/addCategory",methods=['post'])
def addLocation():
    data = request.json
    categoryName = data['categoryName']
    cursor.execute("insert into categories (categoryName) values('"+str(categoryName)+"')")
    conn.commit()
    return make_response(jsonify({'message': 'Category Added Successfully'}))





@app.route("/addShoe",methods=['post'])
def addProduct():
    if 'image' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    image = request.files['image']
    name = request.form.get("name")
    brand = request.form.get("brand")
    price = request.form.get("price")
    quantity = request.form.get("quantity")
    size = request.form.get("size")
    color = request.form.get("color")
    about = request.form.get("about")
    categoryName = request.form.get("categoryName")
    path = PICTUREPATH + "/" + image.filename
    image.save(path)
    cursor.execute("insert into shoes(name,brand,price,quantity,size,color,about,image,categoryName) values ('"+str(name)+"','"+str(brand)+"','"+str(price)+"','"+str(quantity)+"','"+str(size)+"','"+str(color)+"','"+str(about)+"','"+str(image.filename)+"','"+str(categoryName)+"')")
    conn.commit()
    return make_response(jsonify({'message': "Product Added Successfully"}))


@app.route("/viewProducts")
def viewProducts():
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    products_list = []
    for product in products:
        with open(product[2], "rb") as image_file:
            image_data = image_file.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        product_dict = {
            "id": product[0],
            "name": product[1],
            "image": encoded_image,  # Now the image is the Base64 string.
        }
        products_list.append(product_dict)
    return make_response(jsonify({'products': products_list}))


@app.route("/shoes")
def shoes():
    conn.commit()
    searchKeword = request.args.get("searchKeword")
    if searchKeword == "":
        sql = "select * from shoes"
    else:
        sql = "select * from shoes where name like '%"+str(searchKeword)+"%'"
    cursor.execute(sql)
    shoes = cursor.fetchall()
    shoes_list = []
    for shoe in shoes:
        path = PICTUREPATH
        file_path = os.path.join(path, shoe[6])
        with open(file_path, "rb") as image_file:
            image_data = image_file.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        shoe_dict = {
            "shoeId": shoe[0],
            "name": shoe[1],
            "brand": shoe[2],
            "price":shoe[3],
            "quantity":shoe[4],
            "size":shoe[5],
            "image": encoded_image,
            "color":shoe[7],
            "about":shoe[8],
            "categoryId":shoe[9]
        }
        shoes_list.append(shoe_dict)

    return make_response(jsonify({'shoes': shoes_list}))


@app.route("/shoes2")
def shoes2():
    searchKeword = request.args.get("searchKeword")
    if searchKeword == "":
        sql = "select * from shoes"
    else:
        sql = "select * from shoes where name like '%"+str(searchKeword)+"%'"
    cursor.execute(sql)
    shoes = cursor.fetchall()
    shoes_list = []
    for shoe in shoes:
        # Assuming product[2] contains the image file path.
        path = PICTUREPATH
        file_path = os.path.join(path, shoe[6])
        with open(file_path, "rb") as image_file:
            image_data = image_file.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')

        # Create a dictionary for each product.
        # Adjust the keys as per your database schema.
        shoe_dict = {
            "shoeId": shoe[0],
            "name": shoe[1],
            "brand": shoe[2],
            "price":shoe[3],
            "quantity":shoe[4],
            "size":shoe[5],
            "image": encoded_image,
            "color":shoe[7],
            "about":shoe[8],
            "categoryId":shoe[9]
            # Now the image is the Base64 string.
            # Add additional fields if needed.
        }
        shoes_list.append(shoe_dict)

    return make_response(jsonify({'shoes': shoes_list}))






@app.route("/getProductByCategory")
def getProductByCategory():
    productId = request.args.get("productId")
    cursor.execute("select * from shoes where shoeId='"+str(productId)+"'")
    shoes = cursor.fetchall()
    return make_response(jsonify({'shoes': shoes}))

@app.route("/updateProduct")
def updateProduct():
    price = request.args.get("price")
    quantity = request.args.get("quantity")
    productId = request.args.get("productId")
    cursor.execute("update shoes set price='"+str(price)+"',quantity='"+str(quantity)+"' where shoeId='"+str(productId)+"'")
    conn.commit()
    return make_response(jsonify({'message': "Updated"}))

@app.route("/getShoe")
def getShoe():
    productId = request.args.get("productId")
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(" ")[1]
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    cursor.execute("select * from users where email='" + str(decoded['user_id']) + "'")
    user = cursor.fetchone()
    count = cursor.execute("select * from wishlist where shoeId='"+str(productId)+"' and userId='"+str(user[0])+"'")
    cursor.execute("select * from shoes where shoeId='" + str(productId) + "'")
    shoe = cursor.fetchone()
    path = PICTUREPATH
    file_path = os.path.join(path, shoe[6])
    with open(file_path, "rb") as image_file:
        image_data = image_file.read()
    encoded_image = base64.b64encode(image_data).decode('utf-8')
    cursor.execute("select AVG(rarting) as rating from  ratings where shoeId='" + str(productId) + "'")
    rating = cursor.fetchone()[0]

    shoe_dict = {
        "shoeId": shoe[0],
        "name": shoe[1],
        "brand": shoe[2],
        "price": shoe[3],
        "quantity": shoe[4],
        "size": shoe[5],
        "image": encoded_image,
        "color": shoe[7],
        "about": shoe[8],
        "categoryId": shoe[9],
        "rating":rating,
        "isWishListed":count
    }
    return make_response(jsonify({'shoes': shoe_dict}))


@app.route("/getRelatedShoes")
def getRelatedShoes():
    conn.commit()
    categoryId = request.args.get("categoryId")
    sql = "select * from shoes where categoryId= '" + str(categoryId) + "'"
    cursor.execute(sql)
    shoes = cursor.fetchall()
    conn.commit()
    shoes_list = []
    for shoe in shoes:
        path = PICTUREPATH
        file_path = os.path.join(path, shoe[6])
        with open(file_path, "rb") as image_file:
            image_data = image_file.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        shoe_dict = {
            "shoeId": shoe[0],
            "name": shoe[1],
            "brand": shoe[2],
            "price": shoe[3],
            "quantity": shoe[4],
            "size": shoe[5],
            "image": encoded_image,
            "color": shoe[7],
            "about": shoe[8],
            "categoryId": shoe[9]
        }
        shoes_list.append(shoe_dict)
    return make_response(jsonify({'shoes': shoes_list}))


@app.route("/addToCart")
def addToCart():
    productId = request.args.get("productId")
    quantity = request.args.get("quantity")
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(" ")[1]
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    cursor.execute("select * from users where email='"+str(decoded['user_id'])+"'")
    user = cursor.fetchone()
    count = cursor.execute("select * from cart where status='Cart' and userId='"+str(user[0])+"'")
    if count==0:
        cursor.execute("insert into cart(userId,status) values ('"+str(user[0])+"','Cart')")
        conn.commit()
        cartId = cursor.lastrowid
    else:
        cursor.execute("select * from cart where status='Cart' and userId='"+str(user[0])+"'")
        cart = cursor.fetchone()
        cartId = cart[0]
    count2 = cursor.execute("select * from cart_items where cartId='"+str(cartId)+"' and shoeId='"+str(productId)+"'")
    if count2==0:
        cursor.execute("insert into cart_items (status,quantity,shoeId,cartId) values ('Cart','"+str(quantity)+"','"+str(productId)+"','"+str(cartId)+"')")
        conn.commit()
        cursor.execute("select * from shoes where shoeId='"+str(productId)+"'")
        shoe = cursor.fetchone()
        quantity_remove = int(shoe[4])-int(quantity)
        cursor.execute("update shoes set quantity='"+str(quantity_remove)+"' where shoeId='"+str(productId)+"'")
        conn.commit()
        return make_response(jsonify({'message': "Added To Cart"}))
    else:
        cart_item = cursor.fetchone()
        quantity2 = int(quantity)+int(cart_item[2])
        cursor.execute("update cart_items set quantity='"+str(quantity2)+"' where cartId='"+str(cartId)+"' and shoeId='"+str(productId)+"'")
        conn.commit()
        cursor.execute("select * from shoes where shoeId='" + str(productId) + "'")
        shoe = cursor.fetchone()
        quantity_remove = int(shoe[4]) - int(quantity)
        cursor.execute("update shoes set quantity='" + str(quantity_remove) + "' where shoeId='" + str(productId) + "'")
        conn.commit()
        return make_response(jsonify({'message': "Cart Updated"}))


@app.route("/userCart")
def userCart():
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(" ")[1]
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    cursor.execute("select * from users where email='" + str(decoded['user_id']) + "'")
    user = cursor.fetchone()
    cursor.execute("select * from cart where userId='"+str(user[0])+"' and status='Cart'")
    orders = cursor.fetchall()
    orders_list2 = []
    totalPrice = 0
    for order in orders:
        cursor.execute("select * from cart_items where cartId='"+str(order[0])+"'")
        cart_items = cursor.fetchall()
        for cart_item in cart_items:
            print(cart_item)
            cursor.execute("select * from shoes where shoeId='"+str(cart_item[4])+"'")
            shoe = cursor.fetchone()
            path = PICTUREPATH
            file_path = os.path.join(path, shoe[6])
            with open(file_path, "rb") as image_file:
                image_data = image_file.read()
            encoded_image = base64.b64encode(image_data).decode('utf-8')
            orders_list = []
            totalPrice = float(totalPrice) + float(cart_item[2])*float(shoe[3])
            shoe_dict = {
                "cartId": order[0],
                "cart_item_Id": cart_item[0],
                "status": order[1],
                "order_quantity":cart_item[2],
                "brand": shoe[2],
                "price": shoe[3],
                "quantity": shoe[4],
                "size": shoe[5],
                "image": encoded_image,
                "color": shoe[7],
                "about": shoe[8],
                "categoryId": shoe[9]
            }

            orders_list.append(shoe_dict)
            cart = {
                "orders_list":orders_list,
                "cart":order,
                "user":user[1],
                "totalPrice":totalPrice
            }
            orders_list2.append(cart)

    return make_response(jsonify({'orders': orders_list2}))

@app.route("/orderNow")
def orderNow():
    orderId = request.args.get("orderId")
    totalPrice = request.args.get("totalPrice")
    cursor.execute("update cart set status='Ordered' where cartId='"+str(orderId)+"'")
    conn.commit()
    cursor.execute("update cart_items set status='Ordered' where cartId='"+str(orderId)+"'")
    conn.commit()
    return make_response(jsonify({'message': "Order Placed Successfully"}))

@app.route("/userOrders")
def userOrders():
    auth_header = request.headers.get('Authorization')
    role = request.args.get("role")
    if role == 'admin':
        status = request.args.get("status")
        order_status = request.args.get("order_status")
        sql = ""
        if status == 'ordered':
            if order_status == 'ordered':
                sql = "select * from cart where status='Ordered' "
            elif order_status == 'dispatched':
                sql = "select * from cart where status='Dispatched' "
            else:
                sql = "select * from cart where (status='Dispatched' or status='Ordered')"
        elif status == 'history':
            sql = "select * from cart where status='Received'"
        cursor.execute(sql)
        orders = cursor.fetchall()
        totalPrice = 0
        orders_list2 = []
        for order in orders:
            cursor.execute("select * from cart_items where cartId='" + str(order[0]) + "'")
            cart_items = cursor.fetchall()
            cursor.execute("select * from users where userId='"+str(order[3])+"'")
            user = cursor.fetchone()
            for cart_item in cart_items:
                cursor.execute("select * from shoes where shoeId='" + str(cart_item[4]) + "'")
                shoe = cursor.fetchone()
                path = PICTUREPATH
                file_path = os.path.join(path, shoe[6])
                with open(file_path, "rb") as image_file:
                    image_data = image_file.read()
                encoded_image = base64.b64encode(image_data).decode('utf-8')
                orders_list = []

                totalPrice = float(totalPrice) + float(cart_item[2]) * float(shoe[3])
                shoe_dict = {
                    "cartId": order[0],
                    "status": order[1],
                    "order_quantity": cart_item[2],
                    "brand": shoe[2],
                    "price": shoe[3],
                    "quantity": shoe[4],
                    "size": shoe[5],
                    "image": encoded_image,
                    "color": shoe[7],
                    "about": shoe[8],
                    "categoryId": shoe[9]
                }
                orders_list.append(shoe_dict)
                cart = {
                    "orders_list": orders_list,
                    "cart": orders,
                    "user": user[1],
                    "totalPrice": totalPrice
                }
                orders_list2.append(cart)

        return make_response(jsonify({'orders': orders_list2}))
    elif role == 'user':

        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        cursor.execute("select * from users where email='" + str(decoded['user_id']) + "'")
        user = cursor.fetchone()
        status = request.args.get("status")
        order_status = request.args.get("order_status")
        sql = ""
        if status == 'ordered':
            if order_status == 'ordered':
                sql = "select * from cart where status='Ordered' and userId='"+str(user[0])+"'"
            elif order_status == 'dispatched':
                sql = "select * from cart where status='Dispatched' and userId='" + str(user[0]) + "'"
            else:
                sql = "select * from cart where (status='Dispatched' or status='Ordered') and userId='" + str(user[0]) + "'"
        elif status == 'history':
            sql = "select * from cart where status='Received' and userId='"+str(user[0])+"'"
        cursor.execute(sql)
        orders = cursor.fetchall()
        totalPrice = 0
        orders_list2 = []
        for order in orders:
            cursor.execute("select * from cart_items where cartId='" + str(order[0]) + "'")
            cart_items = cursor.fetchall()

            for cart_item in cart_items:
                cursor.execute("select * from shoes where shoeId='" + str(cart_item[4]) + "'")
                shoe = cursor.fetchone()
                path = PICTUREPATH
                file_path = os.path.join(path, shoe[6])
                with open(file_path, "rb") as image_file:
                    image_data = image_file.read()
                encoded_image = base64.b64encode(image_data).decode('utf-8')
                orders_list = []
                totalPrice = float(totalPrice) + float(cart_item[2]) * float(shoe[3])
                shoe_dict = {
                    "cartId": order[0],
                    "status": order[1],
                    "order_quantity": cart_item[2],
                    "brand": shoe[2],
                    "price": shoe[3],
                    "quantity": shoe[4],
                    "size": shoe[5],
                    "image": encoded_image,
                    "color": shoe[7],
                    "about": shoe[8],
                    "categoryId": shoe[9],
                    "shoeId": shoe[0],
                    "cartItemId":cart_item[0]
                }

                orders_list.append(shoe_dict)
                cart = {
                    "orders_list": orders_list,
                    "cart": orders,
                    "user": user[1],
                    "totalPrice": totalPrice
                }
                orders_list2.append(cart)
        return make_response(jsonify({'orders':orders_list2}))

@app.route("/userOrderStatus")
def userOrderStatus():
    orderId = request.args.get("orderId")
    type = request.args.get("type")
    if type == 'dispatch':
        cursor.execute("update cart set status='Dispatched' where cartId='"+str(orderId)+"'")
        conn.commit()
        cursor.execute("update cart_items set status='Dispatched' where cartId='" + str(orderId) + "'")
        conn.commit()
        return make_response(jsonify({'message':"Order Dispatched"}))
    else:
        cursor.execute("update cart set status='Received' where cartId='" + str(orderId) + "'")
        conn.commit()
        cursor.execute("update cart_items set status='Received' where cartId='" + str(orderId) + "'")
        conn.commit()
        return make_response(jsonify({'message': "Order Received"}))


@app.route("/giveRating",methods=['post'])
def giveRating():
    productId = request.args.get("productId")
    data = request.json
    rating = data['rating']
    review = data['review']
    cursor.execute("insert into ratings(rarting,review,shoeId,status) values ('"+str(rating)+"','"+str(review)+"','"+str(productId)+"','Review Given')")
    conn.commit()
    return make_response(jsonify({'message': "Your Response Submitted"}))



@app.route("/productReviews")
def productReviews():
    productId = request.args.get("productId")
    cursor.execute("select * from ratings  where shoeId='" + str(productId) + "'")
    ratings = cursor.fetchall()
    return make_response(jsonify({'reviews': ratings}))


@app.route("/addToWishList")
def addToWishList():
    productId = request.args.get("productId")
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(" ")[1]
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    cursor.execute("select * from users where email='" + str(decoded['user_id']) + "'")
    user = cursor.fetchone()
    cursor.execute("insert into wishlist (shoeId,userId) values ('"+str(productId)+"','"+str(user[0])+"')")
    conn.commit()
    return make_response(jsonify({'message': "Added To WishList"}))


@app.route("/userWishLists")
def userWishLists():
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(" ")[1]
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    cursor.execute("select * from users where email='" + str(decoded['user_id']) + "'")
    user = cursor.fetchone()
    cursor.execute("select * from wishlist where userId='"+str(user[0])+"'")
    wishlists = cursor.fetchall()
    wishlists2 = []
    for wishlist in wishlists:
        shoeId  = wishlist[2]
        cursor.execute("select * from shoes where shoeId='"+str(shoeId)+"'")
        shoes = cursor.fetchone()
        path = PICTUREPATH
        file_path = os.path.join(path, shoes[6])
        with open(file_path, "rb") as image_file:
            image_data = image_file.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        shoe_dict = {
            "name":shoes[1],
            "brand": shoes[2],
            "price": shoes[3],
            "quantity": shoes[4],
            "size": shoes[5],
            "image": encoded_image,
            "color": shoes[7],
            "about": shoes[8],
            "categoryId": shoes[9],
            "shoeId": shoes[0],
            "wishListId":wishlist[0]
        }
        wishlists2.append(shoe_dict)

    return make_response(jsonify({'wishLists': wishlists2}))


@app.route("/removeWishListItem")
def removeWishListItem():
    wishListId = request.args.get("wishListId")
    cursor.execute("delete from wishlist where wishlist_id='"+str(wishListId)+"'")
    conn.commit()
    return make_response(jsonify({'message': "Removed From WishList"}))


@app.route("/addQuantity")
def addQuantity():
    orderItemId = request.args.get("orderItemId")
    cursor.execute("select * from cart_items where cart_itemId='"+str(orderItemId)+"'")
    cart_item = cursor.fetchone()
    cursor.execute("select * from shoes where shoeId='"+str(cart_item[4])+"'")
    shoes = cursor.fetchone()
    shoe_quantity = int(shoes[4])-1
    item_quantity = int(cart_item[2])+1
    cursor.execute("update cart_items set quantity='"+str(item_quantity)+"' where  cart_itemId='"+str(orderItemId)+"'")
    conn.commit()
    cursor.execute("update shoes set quantity='"+str(shoe_quantity)+"' where shoeId='"+str(shoes[0])+"'")
    conn.commit()
    return make_response(jsonify({'message': "Quantity Added"}))


@app.route("/removeQuantity")
def removeQuantity():
    orderItemId = request.args.get("orderItemId")
    cursor.execute("select * from cart_items where cart_itemId='"+str(orderItemId)+"'")
    cart_item = cursor.fetchone()
    cursor.execute("select * from shoes where shoeId='"+str(cart_item[4])+"'")
    shoes = cursor.fetchone()
    shoe_quantity = int(shoes[4])+1
    item_quantity = int(cart_item[2])-1
    cursor.execute("update cart_items set quantity='"+str(item_quantity)+"' where  cart_itemId='"+str(orderItemId)+"'")
    conn.commit()
    cursor.execute("update shoes set quantity='"+str(shoe_quantity)+"' where shoeId='"+str(shoes[0])+"'")
    conn.commit()
    return make_response(jsonify({'message': "Quantity Removed"}))


@app.route("/removeCart")
def removeCart():
    orderItemId = request.args.get("orderItemId")
    orderId = request.args.get("orderId")
    cursor.execute("select * from cart_items where cart_itemId='"+str(orderItemId)+"'")
    cart_items = cursor.fetchone()
    item_quantity = int(cart_items[2])
    cursor.execute("select * from shoes where shoeId='" + str(cart_items[4]) + "'")
    shoes = cursor.fetchone()
    shoe_quantity = int(shoes[4])+item_quantity
    cursor.execute("update shoes set quantity='"+str(shoe_quantity)+"' where shoeId='" + str(cart_items[4]) + "'")
    conn.commit()
    cursor.execute("delete from cart_items where cart_itemId='"+str(orderItemId)+"'")
    conn.commit()
    count = cursor.execute("select * from cart where cartId='"+str(orderId)+"'")
    if count == 0:
        cursor.execute("delete from cart where cartId='"+str(orderId)+"'")
        conn.commit()
        return make_response(jsonify({'message': "Cart Removed"}))
    else:
        return make_response(jsonify({'message': "Item Removed"}))




app.run(debug=True)