import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'passwords.db')

def cleanup_expired_sessions():
    """Delete all expired sessions from database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get current time
    now = datetime.now().isoformat()
    
    # Count expired sessions before deletion
    cursor.execute("SELECT COUNT(*) FROM sessions WHERE expires_at < ?", (now,))
    expired_count = cursor.fetchone()[0]
    
    # Delete expired sessions
    cursor.execute("DELETE FROM sessions WHERE expires_at < ?", (now,))
    
    conn.commit()
    conn.close()
    
    print(f"✅ Cleaned up {expired_count} expired sessions")
    return expired_count

if __name__ == "__main__":
    cleanup_expired_sessions()
