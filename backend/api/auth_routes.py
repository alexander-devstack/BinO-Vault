from flask import Blueprint, request, jsonify, session
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import secrets
from datetime import datetime, timedelta
from utils.rate_limiter import rate_limiter
from database_postgres import SessionLocal, User, Session as DBSession

auth_bp = Blueprint('auth', __name__)
ph = PasswordHasher()

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    except Exception as e:
        db.close()
        raise e

@auth_bp.route('/login', methods=['POST'])
def login():
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
    
    db = get_db()
    
    try:
        # Get first user
        user = db.query(User).first()
        
        if not user:
            db.close()
            rate_limiter.add_attempt(ip)
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        try:
            ph.verify(user.master_password_hash, master_password)
        except VerifyMismatchError:
            db.close()
            rate_limiter.add_attempt(ip)
            
            # Check remaining attempts
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
        
        # Successful login - reset rate limit
        rate_limiter.reset_attempts(ip)
        
        # Create session
        session_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        db_session = DBSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        db.add(db_session)
        db.commit()
        
        # Store in Flask session
        session['user_id'] = user.id
        session['master_password'] = master_password
        session['expires_at'] = expires_at.isoformat()
        session.permanent = True
        
        db.close()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user_id': user.id
        }), 200
        
    except Exception as e:
        db.close()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    """Check if current session is valid and not expired"""
    try:
        if 'user_id' not in session:
            return jsonify({'valid': False, 'error': 'No session found'}), 401
        
        # Check if session has expired
        if 'expires_at' in session:
            expires_at = datetime.fromisoformat(session['expires_at'])
            if datetime.utcnow() > expires_at:
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
        user_id = session.get('user_id')
        
        if user_id:
            # Delete session from database
            db = get_db()
            db.query(DBSession).filter(DBSession.user_id == user_id).delete()
            db.commit()
            db.close()
        
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
        
        db = get_db()
        
        # Check if user already exists
        existing_user = db.query(User).first()
        if existing_user:
            db.close()
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        new_user = User(master_password_hash=password_hash)
        db.add(new_user)
        db.commit()
        db.close()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
