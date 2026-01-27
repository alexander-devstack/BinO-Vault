import sqlite3
from datetime import datetime, timedelta

def migrate_sessions():
    conn = sqlite3.connect('passwords.db')
    cursor = conn.cursor()
    
    # Add expires_at column
    try:
        cursor.execute("ALTER TABLE sessions ADD COLUMN expires_at TEXT;")
        print("✅ Added expires_at column")
    except sqlite3.OperationalError as e:
        print(f"⚠️ Column might exist: {e}")
    
    # Set expires_at for existing sessions (24 hours from now)
    expiry = (datetime.now() + timedelta(hours=24)).isoformat()
    cursor.execute("UPDATE sessions SET expires_at = ? WHERE expires_at IS NULL", (expiry,))
    
    conn.commit()
    conn.close()
    print("✅ Sessions table migrated for Day 15!")
    print(f"✅ Existing sessions set to expire: {expiry}")

if __name__ == "__main__":
    migrate_sessions()
