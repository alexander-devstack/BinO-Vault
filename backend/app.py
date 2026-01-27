from flask import Flask, jsonify
from flask_cors import CORS
import os
import secrets
from flask_wtf.csrf import CSRFProtect, generate_csrf



# Create Flask app
app = Flask(__name__)
# csrf = CSRFProtect(app)
# app.config['WTF_CSRF_TIME_LIMIT'] = None
# app.config['WTF_CSRF_CHECK_DEFAULT'] = False  # Manual checking



# ✅ CRITICAL: Set secret key for Flask sessions
# This encrypts session data (user_id, master_password)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))



# ✅ Enable CORS with credentials support (needed for sessions)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],  # Your frontend URL
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True  # CRITICAL for sessions
    }
})



# Configure session
app.config['SESSION_COOKIE_SECURE'] = False  # Set True in production (HTTPS only)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours



# ✅ Import and register blueprints
from api.auth_routes import auth_bp
from api.recovery_routes import recovery_bp
from api.password_routes import password_bp


app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(recovery_bp, url_prefix='/api/recovery')
app.register_blueprint(password_bp)  # Already has /api/passwords prefix



# Test route
@app.route('/')
def home():
    return {'message': 'BinO-Vault API is running! 🔐'}, 200

# @app.route('/api/csrf-token', methods=['GET'])
# @csrf.exempt
# def get_csrf_token():
#     token = generate_csrf()
#     return jsonify({'csrf_token': token})


if __name__ == '__main__':
    print("🔐 Starting BinO-Vault API server...")
    print("👉 http://localhost:5000")
    print("✅ Session encryption enabled")
    print("✅ Password routes registered")
    
    # Clean up expired sessions on startup
    print("🧹 Cleaning up expired sessions...")
    try:
        from cleanup_sessions import cleanup_expired_sessions
        cleanup_expired_sessions()
    except Exception as e:
        print(f"⚠️ Session cleanup failed: {e}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
