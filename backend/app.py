"""
Group Members:
1. Noor Haj Yousef (UCID: 30206296)
2. Himaal Ishaq (UCID: 30249404)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import json
import random
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)

with open("flavors.json") as f:
    flavors = json.load(f)

with open("reviews.json") as f:
    reviews = json.load(f)

users = []
next_user_id = 1
next_order_id = 1

def validate_username(username):
    pattern = r'^[A-Za-z][A-Za-z0-9_-]{2,19}$'
    return re.match(pattern, username) is not None

def validate_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.(com|net|io)$'
    return re.match(pattern, email, re.IGNORECASE) is not None

def validate_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    if not re.search(r'[!@#$%^&*()\-_=+\[\]{}|;:\'",.<>?/`~]', password):
        return False
    return True

@app.route("/signup", methods=["POST"])
def signup():
    global next_user_id
    data = request.get_json()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not validate_username(username):
        return jsonify({"success": False, "message": "Invalid username."})
    if not validate_email(email):
        return jsonify({"success": False, "message": "Invalid email."})
    if not validate_password(password):
        return jsonify({"success": False, "message": "Invalid password."})

    for user in users:
        if user["username"].lower() == username.lower():
            return jsonify({"success": False, "message": "Username is already taken."})
        if user["email"].lower() == email.lower():
            return jsonify({"success": False, "message": "Email is already registered."})

    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    new_user = {
        "id": next_user_id,
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "cart": [],
        "orders": []
    }
    users.append(new_user)
    next_user_id += 1

    return jsonify({"success": True, "message": "Registration successful."})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = next((u for u in users if u["username"].lower() == username.lower()), None)
    if not user:
        return jsonify({"success": False, "message": "Invalid username or password."})

    if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return jsonify({"success": False, "message": "Invalid username or password."})

    return jsonify({"success": True, "message": "Login successful.", "userId": user["id"], "username": user["username"]})

@app.route("/flavors", methods=["GET"])
def get_flavors():
    return jsonify({"success": True, "message": "Flavors loaded.", "flavors": flavors})

@app.route("/reviews", methods=["GET"])
def get_reviews():
    selected = random.sample(reviews, min(2, len(reviews)))
    return jsonify({"success": True, "message": "Reviews loaded.", "reviews": selected})

@app.route("/cart", methods=["GET"])
def get_cart():
    try:
        user_id = int(request.args.get("userId"))
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "Invalid or missing userId."})
    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"success": False, "message": "User not found."})
    return jsonify({"success": True, "message": "Cart loaded.", "cart": user["cart"]})

@app.route("/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    user_id = data.get("userId")
    flavor_id = data.get("flavorId")

    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"success": False, "message": "User not found."})

    flavor = next((f for f in flavors if f["id"] == flavor_id), None)
    if not flavor:
        return jsonify({"success": False, "message": "Flavor not found."})

    existing = next((item for item in user["cart"] if item["flavorId"] == flavor_id), None)
    if existing:
        return jsonify({"success": False, "message": "Item already in cart. Use PUT to update quantity."})

    price = float(flavor["price"].replace("$", ""))
    user["cart"].append({"flavorId": flavor_id, "name": flavor["name"], "price": price, "quantity": 1})
    return jsonify({"success": True, "message": "Flavor added to cart.", "cart": user["cart"]})

@app.route("/cart", methods=["PUT"])
def update_cart():
    data = request.get_json()
    user_id = data.get("userId")
    flavor_id = data.get("flavorId")
    quantity = data.get("quantity")

    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"success": False, "message": "User not found."})

    if quantity < 1:
        return jsonify({"success": False, "message": "Quantity must be at least 1."})

    item = next((i for i in user["cart"] if i["flavorId"] == flavor_id), None)
    if not item:
        return jsonify({"success": False, "message": "Item not found in cart."})

    item["quantity"] = quantity
    return jsonify({"success": True, "message": "Cart updated successfully.", "cart": user["cart"]})

@app.route("/cart", methods=["DELETE"])
def delete_from_cart():
    data = request.get_json()
    user_id = data.get("userId")
    flavor_id = data.get("flavorId")

    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"success": False, "message": "User not found."})

    user["cart"] = [i for i in user["cart"] if i["flavorId"] != flavor_id]
    return jsonify({"success": True, "message": "Flavor removed from cart.", "cart": user["cart"]})

@app.route("/orders", methods=["POST"])
def place_order():
    global next_order_id
    data = request.get_json()
    user_id = data.get("userId")

    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"success": False, "message": "User not found."})
    if not user["cart"]:
        return jsonify({"success": False, "message": "Cart is empty."})

    total = sum(item["price"] * item["quantity"] for item in user["cart"])
    order = {
        "orderId": next_order_id,
        "items": list(user["cart"]),
        "total": round(total, 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    user["orders"].append(order)
    user["cart"] = []
    next_order_id += 1

    return jsonify({"success": True, "message": "Order placed successfully.", "orderId": order["orderId"]})

@app.route("/orders", methods=["GET"])
def get_orders():
    try:
        user_id = int(request.args.get("userId"))
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "Invalid or missing userId."})
    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"success": False, "message": "User not found."})
    return jsonify({"success": True, "message": "Order history loaded.", "orders": user["orders"]})

if __name__ == "__main__":
    app.run(debug=True, port=5000)