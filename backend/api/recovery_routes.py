from flask import Blueprint, request, jsonify, session
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import secrets
import string
from database_postgres import SessionLocal, User, Session as DBSession

recovery_bp = Blueprint('recovery', __name__)
ph = PasswordHasher()

def get_db():
    """Get database session"""
    return SessionLocal()

def generate_recovery_key():
    """Generate 24-character alphanumeric recovery key"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(24))

@recovery_bp.route('/generate', methods=['POST'])
def create_recovery_key():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    recovery_key = generate_recovery_key()
    recovery_key_hash = ph.hash(recovery_key)
    
    db = get_db()
    
    try:
        user = db.query(User).filter_by(id=user_id).first()
        
        if not user:
            db.close()
            return jsonify({'error': 'User not found'}), 404
        
        user.recovery_key_hash = recovery_key_hash
        db.commit()
        db.close()
        
        return jsonify({
            'success': True,
            'recovery_key': recovery_key,
            'user_id': user_id
        }), 200
        
    except Exception as e:
        db.close()
        return jsonify({'error': str(e)}), 500

@recovery_bp.route('/verify', methods=['POST'])
def verify_recovery_key():
    data = request.json
    recovery_key = data.get('recovery_key', '').strip()
    
    if not recovery_key:
        return jsonify({'valid': False}), 400
    
    db = get_db()
    
    try:
        user = db.query(User).filter(User.recovery_key_hash.isnot(None)).first()
        
        if not user:
            db.close()
            return jsonify({'valid': False}), 400
        
        try:
            ph.verify(user.recovery_key_hash, recovery_key)
            db.close()
            return jsonify({'valid': True, 'user_id': user.id}), 200
        except VerifyMismatchError:
            db.close()
            return jsonify({'valid': False}), 400
            
    except Exception as e:
        db.close()
        return jsonify({'valid': False, 'error': str(e)}), 500

@recovery_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    recovery_key = data.get('recovery_key', '').strip()
    new_password = data.get('new_master_password', '').strip()
    
    if not recovery_key or not new_password:
        return jsonify({'error': 'Missing fields'}), 400
    
    db = get_db()
    
    try:
        user = db.query(User).filter(User.recovery_key_hash.isnot(None)).first()
        
        if not user:
            db.close()
            return jsonify({'error': 'No recovery key set'}), 400
        
        try:
            ph.verify(user.recovery_key_hash, recovery_key)
        except VerifyMismatchError:
            db.close()
            return jsonify({'error': 'Invalid recovery key'}), 401
        
        # Update master password hash
        new_password_hash = ph.hash(new_password)
        user.master_password_hash = new_password_hash
        
        # Clear all sessions for this user
        db.query(DBSession).filter_by(user_id=user.id).delete()
        
        db.commit()
        db.close()
        
        return jsonify({'success': True, 'message': 'Password reset successful'}), 200
        
    except Exception as e:
        db.close()
        return jsonify({'error': str(e)}), 500
