from flask import Blueprint, request, jsonify
from models.user import User
from utils.auth_utils import generate_token
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
user_model = User(db)

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if user_model.find_by_username(username):
        return jsonify({"error": "User already exists"}), 409

    user_model.create_user(username, password)
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        user = user_model.find_by_username(username)
        if not user or not user_model.verify_password(user['password'], password):
            return jsonify({"error": "Invalid credentials"}), 401

        token = generate_token(username)
        return jsonify({"token": token})
    except Exception as e:
        print("Login error:", e)
        response = jsonify({"error": "Internal server error"})
        response.status_code = 500
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
