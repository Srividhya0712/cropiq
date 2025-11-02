from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, db):
        self.collection = db["users"]

    def create_user(self, username, password):
        hashed = generate_password_hash(password)
        return self.collection.insert_one({
            "username": username,
            "password": hashed
        })

    def find_by_username(self, username):
        return self.collection.find_one({"username": username})

    def verify_password(self, stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
