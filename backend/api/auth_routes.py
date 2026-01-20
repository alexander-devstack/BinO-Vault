from flask import Blueprint, request, jsonify
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import sqlite3
import secrets
import os

auth_bp = Blueprint('auth', __name__)
ph = PasswordHasher()

# Direct database path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'passwords.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    try:
        # Import session at top of function
        from flask import session
        
        data = request.get_json()
        master_password = data.get('master_password')
        
        if not master_password:
            return jsonify({'error': 'Master password required'}), 400
        
        # Get user from database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, master_password_hash FROM users LIMIT 1")
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return jsonify({'error': 'No user found'}), 404
        
        user_id = user[0]
        password_hash = user[1]
        
        # Verify password
        try:
            ph.verify(password_hash, master_password)
        except VerifyMismatchError:
            conn.close()
            return jsonify({'error': 'Invalid master password'}), 401
        
        # Create session
        session_token = secrets.token_urlsafe(32)
        cursor.execute(
            "INSERT INTO sessions (user_id, session_token) VALUES (?, ?)",
            (user_id, session_token)
        )
        conn.commit()
        conn.close()
        
        # ✅ CRITICAL: Store user_id and master_password in Flask session
        session['user_id'] = user_id
        session['master_password'] = master_password
        session.permanent = True  # Keep session alive
        
        return jsonify({
            'message': 'Login successful',
            'session_token': session_token,
            'user_id': user_id
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        master_password = data.get('master_password')
        
        if not master_password:
            return jsonify({'error': 'Master password required'}), 400
        
        password_hash = ph.hash(master_password)
        
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM users")
        if cursor.fetchone()[0] > 0:
            conn.close()
            return jsonify({'error': 'User already exists'}), 400
        
        cursor.execute(
            "INSERT INTO users (master_password_hash) VALUES (?)",
            (password_hash,)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
