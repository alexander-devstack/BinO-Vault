from flask import Flask, jsonify
from flask_cors import CORS
import os
import secrets

# Create Flask app
app = Flask(__name__)

# ✅ CRITICAL: Set secret key for Flask sessions
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# ✅ Production CORS with Vercel support
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",           # Vite dev server
            "http://localhost:3000",            # Production build (serve)
            "http://192.168.137.1:3000",       # Network address
            "http://127.0.0.1:3000",           # Localhost alias
            "https://binovault.vercel.app",    # Vercel production (UPDATE after deployment)
            "https://binovault-*.vercel.app"   # Vercel preview deployments
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# ✅ Production session configuration
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('FLASK_ENV') == 'production'  # HTTPS in production
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None' if os.environ.get('FLASK_ENV') == 'production' else 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours

# ✅ Initialize PostgreSQL database
from database_postgres import init_db

try:
    with app.app_context():
        init_db()
        print("✅ Database initialized successfully")
except Exception as e:
    print(f"⚠️ Database initialization error: {e}")

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
    return {'message': 'BinO-Vault API is running! 🔐', 'version': '1.0.0'}, 200

# Health check for Render
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

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
    
    # Development server (Gunicorn used in production)
    app.run(host='0.0.0.0', port=5000, debug=True)
