import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI=os.getenv("MONGO_URI")
JWT_SECRET=os.getenv("JWT_SECRET", "yoursecretkey")
DB_NAME=os.getenv("DB_NAME", "cropiq")