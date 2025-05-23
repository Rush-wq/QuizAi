import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')
    DEBUG = os.environ.get('FLASK_ENV') == 'development'