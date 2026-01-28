from flask import Blueprint, request, jsonify, session
from datetime import datetime
from database_postgres import SessionLocal, PasswordEntry
from crypto.encryption import PasswordEncryption
from utils.password_generator import PasswordGenerator

password_bp = Blueprint('passwords', __name__, url_prefix='/api/passwords')
pwd_gen = PasswordGenerator()

def check_session_expiry():
    """Check if session is expired, return (is_valid, error_response)"""
    if 'user_id' not in session:
        return False, ({'error': 'Not authenticated'}, 401)
    
    if 'expires_at' in session:
        expires_at = datetime.fromisoformat(session['expires_at'])
        if datetime.utcnow() > expires_at:
            session.clear()
            return False, ({'error': 'Session expired. Please log in again.'}, 401)
    
    return True, None

def get_db():
    """Get database session"""
    return SessionLocal()

def require_auth(f):
    """Decorator to require authentication for routes."""
    def decorated_function(*args, **kwargs):
        is_valid, error_response = check_session_expiry()
        if not is_valid:
            return jsonify(error_response[0]), error_response[1]
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

@password_bp.route('/', methods=['GET'])
@require_auth
def get_all_passwords():
    """Get all passwords for logged-in user."""
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        db = get_db()
        entries = db.query(PasswordEntry).filter_by(user_id=user_id).all()

        encryptor = PasswordEncryption(master_password)
        passwords = []

        for entry in entries:
            try:
                decrypted_password = encryptor.decrypt(entry.encrypted_password)

                passwords.append({
                    'id': entry.id,
                    'website': entry.website,
                    'username': entry.username,
                    'password': decrypted_password,
                    'security_level': entry.security_level,
                    'notes': entry.notes,
                    'created_at': entry.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'updated_at': entry.updated_at.strftime('%Y-%m-%d %H:%M:%S')
                })
            except Exception as e:
                passwords.append({
                    'id': entry.id,
                    'website': entry.website,
                    'username': entry.username,
                    'password': '[Decryption failed]',
                    'security_level': 'Critical',
                    'error': str(e)
                })

        db.close()

        return jsonify({
            'success': True,
            'count': len(passwords),
            'passwords': passwords
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to retrieve passwords: {str(e)}'
        }), 500

@password_bp.route('/', methods=['POST'])
@require_auth
def add_password():
    """Add new password to vault."""
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        data = request.get_json()
        website = data.get('website')
        username = data.get('username')
        password = data.get('password')
        notes = data.get('notes', '')

        if not website or not username or not password:
            return jsonify({
                'success': False,
                'error': 'Website, username, and password are required'
            }), 400

        strength = pwd_gen.calculate_strength(password)

        if strength['level'] == 'Strong':
            security_level = 'Calm'
        elif strength['level'] == 'Medium':
            security_level = 'Alert'
        else:
            security_level = 'Critical'

        encryptor = PasswordEncryption(master_password)
        encrypted_password = encryptor.encrypt(password)

        db = get_db()

        new_entry = PasswordEntry(
            user_id=user_id,
            website=website,
            username=username,
            encrypted_password=encrypted_password,
            security_level=security_level,
            notes=notes
        )

        db.add(new_entry)
        db.commit()
        password_id = new_entry.id
        db.close()

        return jsonify({
            'success': True,
            'message': 'Password saved successfully',
            'password_id': password_id,
            'security_level': security_level,
            'strength': strength
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to save password: {str(e)}'
        }), 500

@password_bp.route('/<int:password_id>', methods=['GET'])
@require_auth
def get_password(password_id):
    """Get specific password by ID."""
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        db = get_db()
        entry = db.query(PasswordEntry).filter_by(
            id=password_id,
            user_id=user_id
        ).first()

        if not entry:
            db.close()
            return jsonify({
                'success': False,
                'error': 'Password not found'
            }), 404

        encryptor = PasswordEncryption(master_password)
        decrypted_password = encryptor.decrypt(entry.encrypted_password)

        password_data = {
            'id': entry.id,
            'website': entry.website,
            'username': entry.username,
            'password': decrypted_password,
            'security_level': entry.security_level,
            'notes': entry.notes,
            'created_at': entry.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': entry.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

        db.close()

        return jsonify({
            'success': True,
            'password': password_data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to retrieve password: {str(e)}'
        }), 500

@password_bp.route('/<int:password_id>', methods=['PUT'])
@require_auth
def update_password(password_id):
    """Update existing password."""
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        data = request.get_json()

        db = get_db()
        entry = db.query(PasswordEntry).filter_by(
            id=password_id,
            user_id=user_id
        ).first()

        if not entry:
            db.close()
            return jsonify({
                'success': False,
                'error': 'Password not found'
            }), 404

        if 'website' in data:
            entry.website = data['website']

        if 'username' in data:
            entry.username = data['username']

        if 'password' in data:
            new_password = data['password']
            strength = pwd_gen.calculate_strength(new_password)

            if strength['level'] == 'Strong':
                entry.security_level = 'Calm'
            elif strength['level'] == 'Medium':
                entry.security_level = 'Alert'
            else:
                entry.security_level = 'Critical'

            encryptor = PasswordEncryption(master_password)
            entry.encrypted_password = encryptor.encrypt(new_password)

        if 'notes' in data:
            entry.notes = data['notes']

        db.commit()
        db.close()

        return jsonify({
            'success': True,
            'message': 'Password updated successfully'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to update password: {str(e)}'
        }), 500

@password_bp.route('/<int:password_id>', methods=['DELETE'])
@require_auth
def delete_password(password_id):
    """Delete password from vault."""
    try:
        user_id = session['user_id']

        db = get_db()
        entry = db.query(PasswordEntry).filter_by(
            id=password_id,
            user_id=user_id
        ).first()

        if not entry:
            db.close()
            return jsonify({
                'success': False,
                'error': 'Password not found'
            }), 404

        db.delete(entry)
        db.commit()
        db.close()

        return jsonify({
            'success': True,
            'message': 'Password deleted successfully'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to delete password: {str(e)}'
        }), 500

@password_bp.route('/generate', methods=['POST'])
@require_auth
def generate_password():
    """Generate strong random password."""
    try:
        data = request.get_json() or {}

        length = data.get('length', 16)
        use_uppercase = data.get('use_uppercase', True)
        use_digits = data.get('use_digits', True)
        use_special = data.get('use_special', True)

        password = pwd_gen.generate(
            length=length,
            use_uppercase=use_uppercase,
            use_digits=use_digits,
            use_special=use_special
        )

        strength = pwd_gen.calculate_strength(password)

        return jsonify({
            'success': True,
            'password': password,
            'strength': strength
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to generate password: {str(e)}'
        }), 500
