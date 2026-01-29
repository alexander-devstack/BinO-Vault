from flask import Flask, jsonify, session
from flask_cors import CORS
from database import DatabaseManager

app = Flask(__name__)
app.secret_key = 'binovault-local-dev'
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

db_manager = DatabaseManager()
with app.app_context():
    db_manager.create_tables()

# CORE ROUTES ONLY
from api.auth_routes import auth_bp
from api.password_routes import password_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(password_bp)

@app.route('/health')
def health():
    return {'status': 'ready'}, 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
