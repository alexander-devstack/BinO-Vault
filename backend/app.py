from flask import Flask
from flask_cors import CORS
import os

# Create Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure session
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Import and register blueprints
from api.auth_routes import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')

# Test route
@app.route('/')
def home():
    return {'message': 'BinO-Vault API is running!'}, 200

if __name__ == '__main__':
    print("🔐 Starting BinO-Vault API server...")
    print("👊 http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
