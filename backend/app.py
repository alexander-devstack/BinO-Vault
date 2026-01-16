from flask import Flask
from flask_cors import CORS
from config import config
import os

# Create Flask app
app = Flask(__name__)

# Force development configuration
app.config.from_object(config['development'])

# Enable CORS
CORS(app,
     origins=['*'],  # Allow all origins for development
     supports_credentials=True,
     allow_headers=['Content-Type'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Configure session
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Import and register blueprints
from api.auth_routes import auth_bp
from api.password_routes import password_bp
app.register_blueprint(auth_bp)
app.register_blueprint(password_bp)


# Test route
@app.route('/')
def index():
    return {
        'message': 'BinO-Vault API is running! 🔒',
        'version': '1.0.0',
        'status': 'active'
    }


# Run the app
if __name__ == '__main__':
    from database import DatabaseManager

    db = DatabaseManager()
    db.create_tables()
    print("✅ Database initialized\n")

    print("🚀 Starting BinO-Vault API server...")
    print("📍 http://localhost:5000\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
