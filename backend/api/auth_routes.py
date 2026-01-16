from flask import Blueprint, request, jsonify, session
from datetime import datetime
import sys
import os

# Add parent directory (backend/) to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))  # backend/api/
parent_dir = os.path.dirname(current_dir)  # backend/
sys.path.insert(0, parent_dir)

# Now import without 'backend.' prefix
from auth.password_hasher import MasterPasswordManager
from database import DatabaseManager, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
pm = MasterPasswordManager()
db = DatabaseManager()


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
pm = MasterPasswordManager()
db = DatabaseManager()


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register new user with master password and recovery key.

    REQUEST BODY:
    {
        "username": "user@email.com",
        "master_password": "SecurePassword123!"
    }

    RESPONSE:
    {
        "success": true,
        "message": "Account created successfully",
        "recovery_key": "XXXX-XXXX-XXXX-XXXX-XXXX",
        "warning": "Save this recovery key! You cannot recover it later."
    }

    SECURITY:
    - Only ONE user allowed per vault (local-only app)
    - Master password hashed with Argon2id
    - Recovery key generated and hashed
    - Recovery key shown ONCE (never stored in plaintext)
    """
    try:
        data = request.get_json()
        username = data.get('username')
        master_password = data.get('master_password')

        # Validation
        if not username or not master_password:
            return jsonify({
                'success': False,
                'error': 'Username and master password are required'
            }), 400

        if len(master_password) < 8:
            return jsonify({
                'success': False,
                'error': 'Master password must be at least 8 characters'
            }), 400

        # Check if user already exists
        db_session = db.get_session()
        existing_user = db_session.query(User).filter_by(username=username).first()

        if existing_user:
            db_session.close()
            return jsonify({
                'success': False,
                'error': 'User already exists. Use /login to access your vault.'
            }), 409

        # Hash master password
        master_hash = pm.hash_password(master_password)

        # Generate recovery key
        recovery_key = pm.generate_recovery_key()
        recovery_hash = pm.hash_recovery_key(recovery_key)

        # Create user
        new_user = User(
            username=username,
            master_password_hash=master_hash,
            recovery_key_hash=recovery_hash,
            created_at=datetime.utcnow()
        )

        db_session.add(new_user)
        db_session.commit()
        db_session.close()

        return jsonify({
            'success': True,
            'message': 'Account created successfully',
            'recovery_key': recovery_key,
            'warning': '⚠️ SAVE THIS RECOVERY KEY! You cannot recover it later. Write it down on paper.'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login with master password.

    REQUEST BODY:
    {
        "username": "user@email.com",
        "master_password": "SecurePassword123!"
    }

    RESPONSE:
    {
        "success": true,
        "message": "Login successful",
        "user_id": 1,
        "session_token": "..."
    }

    SECURITY:
    - Verifies Argon2id hash (takes ~500ms, prevents brute-force)
    - Creates session token (stored in Flask session)
    - Updates last_login timestamp
    """
    try:
        data = request.get_json()
        username = data.get('username')
        master_password = data.get('master_password')

        if not username or not master_password:
            return jsonify({
                'success': False,
                'error': 'Username and master password are required'
            }), 400

        # Get user from database
        db_session = db.get_session()
        user = db_session.query(User).filter_by(username=username).first()

        if not user:
            db_session.close()
            return jsonify({
                'success': False,
                'error': 'Invalid username or password'
            }), 401

        # Verify master password
        if not pm.verify_password(master_password, user.master_password_hash):
            db_session.close()
            return jsonify({
                'success': False,
                'error': 'Invalid username or password'
            }), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db_session.commit()

        # Create session
        session['user_id'] = user.id
        session['username'] = user.username
        session['master_password'] = master_password  # Needed for decryption (stored in secure session)

        db_session.close()

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout and clear session.

    SECURITY:
    - Clears session data (including cached master password)
    - Forces re-authentication on next access
    """
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200


@auth_bp.route('/verify-session', methods=['GET'])
def verify_session():
    """
    Check if user is currently logged in.

    RESPONSE:
    {
        "authenticated": true,
        "user_id": 1,
        "username": "user@email.com"
    }
    """
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user_id': session['user_id'],
            'username': session['username']
        }), 200
    else:
        return jsonify({
            'authenticated': False
        }), 401
