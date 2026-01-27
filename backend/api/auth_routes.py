from flask import Blueprint, request, jsonify
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import sqlite3
import secrets
import os
from datetime import datetime, timedelta
from utils.rate_limiter import rate_limiter



auth_bp = Blueprint('auth', __name__)
ph = PasswordHasher()


# Direct database path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'passwords.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@auth_bp.route('/login', methods=['POST'])
def login():
    from flask import session
    
    ip = request.remote_addr
    
    # Check rate limit
    is_limited, wait_seconds = rate_limiter.is_rate_limited(ip)
    if is_limited:
        minutes = wait_seconds // 60
        return jsonify({
            'error': f'Too many failed attempts. Try again in {minutes} minutes.'
        }), 429
    
    data = request.json
    master_password = data.get('master_password', '').strip()
    
    if not master_password:
        return jsonify({'error': 'Master password required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, master_password_hash FROM users LIMIT 1")
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        rate_limiter.add_attempt(ip)
        return jsonify({'error': 'Invalid credentials'}), 401
    
    user_id, password_hash = user
    
    try:
        ph.verify(password_hash, master_password)
        
        # Successful login - reset rate limit
        rate_limiter.reset_attempts(ip)
        
        session_token = secrets.token_urlsafe(32)
        expires_at = (datetime.now() + timedelta(hours=24)).isoformat()
        
        cursor.execute(
            "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)",
            (user_id, session_token, expires_at)
        )
        conn.commit()
        conn.close()
        
        session['user_id'] = user_id
        session['master_password'] = master_password
        session['expires_at'] = expires_at
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user_id': user_id
        }), 200
        
    except VerifyMismatchError:
        conn.close()
        rate_limiter.add_attempt(ip)
        
        # Check how many attempts left
        attempts_count = len(rate_limiter.attempts.get(ip, []))
        remaining = rate_limiter.max_attempts - attempts_count
        
        if remaining > 0:
            return jsonify({
                'error': f'Invalid credentials. {remaining} attempts remaining.'
            }), 401
        else:
            return jsonify({
                'error': 'Too many failed attempts. Try again in 15 minutes.'
            }), 429



@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    """Check if current session is valid and not expired"""
    try:
        from flask import session
        
        if 'user_id' not in session:
            return jsonify({'valid': False, 'error': 'No session found'}), 401
        
        # Check if session has expired
        if 'expires_at' in session:
            expires_at = datetime.fromisoformat(session['expires_at'])
            if datetime.now() > expires_at:
                session.clear()
                return jsonify({'valid': False, 'error': 'Session expired'}), 401
        
        return jsonify({
            'valid': True,
            'user_id': session['user_id'],
            'expires_at': session.get('expires_at')
        }), 200
        
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Clear session and delete from database"""
    try:
        from flask import session
        
        user_id = session.get('user_id')
        
        if user_id:
            # Delete session from database
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            conn.commit()
            conn.close()
        
        # Clear Flask session
        session.clear()
        
        return jsonify({'message': 'Logged out successfully'}), 200
        
    except Exception as e:
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
