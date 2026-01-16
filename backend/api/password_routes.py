from flask import Blueprint, request, jsonify, session
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from database import DatabaseManager, PasswordEntry
from crypto.encryption import PasswordEncryption
from utils.password_generator import PasswordGenerator

password_bp = Blueprint('passwords', __name__, url_prefix='/api/passwords')
db = DatabaseManager()
pwd_gen = PasswordGenerator()


def require_auth(f):
    """
    Decorator to require authentication for routes.

    WHY WE NEED THIS:
    - Prevents unauthorized access to password vault
    - Checks if user is logged in (session exists)
    - Returns 401 if not authenticated
    """

    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'error': 'Authentication required. Please login first.'
            }), 401
        return f(*args, **kwargs)

    decorated_function.__name__ = f.__name__
    return decorated_function


@password_bp.route('/', methods=['GET'])
@require_auth
def get_all_passwords():
    """
    Get all passwords for logged-in user.

    RESPONSE:
    {
        "success": true,
        "passwords": [
            {
                "id": 1,
                "website": "Gmail",
                "username": "yourname@gmail.com",
                "password": "decrypted-password",
                "security_level": "Calm",
                "created_at": "2026-01-16 10:00:00"
            }
        ]
    }
    """
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        # Get all password entries for this user
        db_session = db.get_session()
        entries = db_session.query(PasswordEntry).filter_by(user_id=user_id).all()

        # Decrypt passwords
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
                # If decryption fails, still include entry but mark password as inaccessible
                passwords.append({
                    'id': entry.id,
                    'website': entry.website,
                    'username': entry.username,
                    'password': '[Decryption failed]',
                    'security_level': 'Critical',
                    'error': str(e)
                })

        db_session.close()

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
    """
    Add new password to vault.

    REQUEST BODY:
    {
        "website": "Gmail",
        "username": "yourname@gmail.com",
        "password": "MyPassword123!",
        "notes": "Work email account"  // optional
    }

    RESPONSE:
    {
        "success": true,
        "message": "Password saved successfully",
        "password_id": 1,
        "security_level": "Strong"
    }
    """
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        data = request.get_json()
        website = data.get('website')
        username = data.get('username')
        password = data.get('password')
        notes = data.get('notes', '')

        # Validation
        if not website or not username or not password:
            return jsonify({
                'success': False,
                'error': 'Website, username, and password are required'
            }), 400

        # Calculate password strength
        strength = pwd_gen.calculate_strength(password)

        # Map strength to security level (for your UI colors)
        if strength['level'] == 'Strong':
            security_level = 'Calm'  # Green
        elif strength['level'] == 'Medium':
            security_level = 'Alert'  # Orange
        else:
            security_level = 'Critical'  # Red

        # Encrypt password
        encryptor = PasswordEncryption(master_password)
        encrypted_password = encryptor.encrypt(password)

        # Save to database
        db_session = db.get_session()

        new_entry = PasswordEntry(
            user_id=user_id,
            website=website,
            username=username,
            encrypted_password=encrypted_password,
            security_level=security_level,
            notes=notes
        )

        db_session.add(new_entry)
        db_session.commit()

        password_id = new_entry.id
        db_session.close()

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
    """
    Get specific password by ID.

    RESPONSE:
    {
        "success": true,
        "password": {
            "id": 1,
            "website": "Gmail",
            "username": "yourname@gmail.com",
            "password": "decrypted-password",
            "security_level": "Calm"
        }
    }
    """
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        db_session = db.get_session()
        entry = db_session.query(PasswordEntry).filter_by(
            id=password_id,
            user_id=user_id
        ).first()

        if not entry:
            db_session.close()
            return jsonify({
                'success': False,
                'error': 'Password not found'
            }), 404

        # Decrypt password
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

        db_session.close()

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
    """
    Update existing password.

    REQUEST BODY:
    {
        "website": "Gmail",  // optional
        "username": "newemail@gmail.com",  // optional
        "password": "NewPassword123!",  // optional
        "notes": "Updated notes"  // optional
    }
    """
    try:
        user_id = session['user_id']
        master_password = session['master_password']

        data = request.get_json()

        db_session = db.get_session()
        entry = db_session.query(PasswordEntry).filter_by(
            id=password_id,
            user_id=user_id
        ).first()

        if not entry:
            db_session.close()
            return jsonify({
                'success': False,
                'error': 'Password not found'
            }), 404

        # Update fields if provided
        if 'website' in data:
            entry.website = data['website']

        if 'username' in data:
            entry.username = data['username']

        if 'password' in data:
            # Calculate new strength
            new_password = data['password']
            strength = pwd_gen.calculate_strength(new_password)

            # Update security level
            if strength['level'] == 'Strong':
                entry.security_level = 'Calm'
            elif strength['level'] == 'Medium':
                entry.security_level = 'Alert'
            else:
                entry.security_level = 'Critical'

            # Encrypt new password
            encryptor = PasswordEncryption(master_password)
            entry.encrypted_password = encryptor.encrypt(new_password)

        if 'notes' in data:
            entry.notes = data['notes']

        db_session.commit()
        db_session.close()

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
    """
    Delete password from vault.

    RESPONSE:
    {
        "success": true,
        "message": "Password deleted successfully"
    }
    """
    try:
        user_id = session['user_id']

        db_session = db.get_session()
        entry = db_session.query(PasswordEntry).filter_by(
            id=password_id,
            user_id=user_id
        ).first()

        if not entry:
            db_session.close()
            return jsonify({
                'success': False,
                'error': 'Password not found'
            }), 404

        db_session.delete(entry)
        db_session.commit()
        db_session.close()

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
    """
    Generate strong random password.

    REQUEST BODY (all optional):
    {
        "length": 16,
        "use_uppercase": true,
        "use_digits": true,
        "use_special": true
    }

    RESPONSE:
    {
        "success": true,
        "password": "xK9#mL2$vB5@nP8!",
        "strength": {
            "level": "Strong",
            "score": 100,
            "feedback": ["Great password!"]
        }
    }
    """
    try:
        data = request.get_json() or {}

        length = data.get('length', 16)
        use_uppercase = data.get('use_uppercase', True)
        use_digits = data.get('use_digits', True)
        use_special = data.get('use_special', True)

        # Generate password
        password = pwd_gen.generate(
            length=length,
            use_uppercase=use_uppercase,
            use_digits=use_digits,
            use_special=use_special
        )

        # Calculate strength
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
