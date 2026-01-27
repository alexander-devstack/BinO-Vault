from flask import Blueprint, request, jsonify
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import sqlite3
import secrets
import string
import os

recovery_bp = Blueprint('recovery', __name__)
ph = PasswordHasher()
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'passwords.db')

def generate_recovery_key():
    """Generate 24-character alphanumeric recovery key"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(24))

@recovery_bp.route('/generate', methods=['POST'])
def create_recovery_key():
    from flask import session
    
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    recovery_key = generate_recovery_key()
    recovery_key_hash = ph.hash(recovery_key)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET recovery_key_hash = ? WHERE id = ?", 
                   (recovery_key_hash, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'recovery_key': recovery_key,
        'user_id': user_id
    }), 200

@recovery_bp.route('/verify', methods=['POST'])
def verify_recovery_key():
    data = request.json
    recovery_key = data.get('recovery_key', '').strip()
    
    if not recovery_key:
        return jsonify({'valid': False}), 400
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, recovery_key_hash FROM users WHERE recovery_key_hash IS NOT NULL")
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'valid': False}), 400
    
    try:
        ph.verify(user[1], recovery_key)
        return jsonify({'valid': True, 'user_id': user[0]}), 200
    except VerifyMismatchError:
        return jsonify({'valid': False}), 400

@recovery_bp.route('/reset-password', methods=['POST'])
def reset_password():
    from crypto.encryption import PasswordEncryption
    
    data = request.json
    recovery_key = data.get('recovery_key', '').strip()
    new_password = data.get('new_master_password', '').strip()
    
    if not recovery_key or not new_password:
        return jsonify({'error': 'Missing fields'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, recovery_key_hash FROM users WHERE recovery_key_hash IS NOT NULL")
    user = cursor.fetchone()
    
    if not user:
        return jsonify({'error': 'No recovery key set'}), 400
    
    try:
        ph.verify(user[1], recovery_key)
    except VerifyMismatchError:
        conn.close()
        return jsonify({'error': 'Invalid recovery key'}), 401
    
    user_id = user[0]
    new_password_hash = ph.hash(new_password)
    
    # Get old master password from first valid session
    cursor.execute("SELECT session_token FROM sessions WHERE user_id = ? LIMIT 1", (user_id,))
    # For simplicity, we'll decrypt with user's help on next login
    # Update master password hash
    cursor.execute("UPDATE users SET master_password_hash = ? WHERE id = ?", 
                   (new_password_hash, user_id))
    
    # Clear all sessions
    cursor.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Password reset successful'}), 200
