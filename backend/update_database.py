"""
Update passwords.db with missing tables and columns
Run this ONCE to update your existing database
"""
import sqlite3
import os

DB_PATH = 'passwords.db'

def update_database():
    print("="*70)
    print("UPDATING passwords.db")
    print("="*70 + "\n")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Add recovery_key_hash to users table
    print("1️⃣ Adding recovery_key_hash to users table...")
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN recovery_key_hash TEXT;")
        print("   ✅ Added recovery_key_hash column")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("   ⚠️  recovery_key_hash already exists (skipping)")
        else:
            print(f"   ❌ Error: {e}")
    
    # 2. Add expires_at to sessions table
    print("\n2️⃣ Adding expires_at to sessions table...")
    try:
        cursor.execute("ALTER TABLE sessions ADD COLUMN expires_at TEXT;")
        print("   ✅ Added expires_at column")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("   ⚠️  expires_at already exists (skipping)")
        else:
            print(f"   ❌ Error: {e}")
    
    # 3. Create password_entries table
    print("\n3️⃣ Creating password_entries table...")
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS password_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                website TEXT NOT NULL,
                username TEXT NOT NULL,
                encrypted_password TEXT NOT NULL,
                security_level TEXT DEFAULT 'Calm',
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """)
        print("   ✅ Created password_entries table")
    except sqlite3.OperationalError as e:
        print(f"   ⚠️  Table might already exist: {e}")
    
    conn.commit()
    
    # 4. Verify changes
    print("\n" + "="*70)
    print("VERIFICATION - Updated Schema:")
    print("="*70 + "\n")
    
    cursor.execute("PRAGMA table_info(users);")
    print("📋 users table:")
    for col in cursor.fetchall():
        print(f"   - {col[1]}: {col[2]}")
    
    cursor.execute("PRAGMA table_info(sessions);")
    print("\n📋 sessions table:")
    for col in cursor.fetchall():
        print(f"   - {col[1]}: {col[2]}")
    
    cursor.execute("PRAGMA table_info(password_entries);")
    print("\n📋 password_entries table:")
    for col in cursor.fetchall():
        print(f"   - {col[1]}: {col[2]}")
    
    conn.close()
    
    print("\n" + "="*70)
    print("✅ Database update complete!")
    print("="*70)

if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        print(f"❌ Error: {DB_PATH} not found!")
        print("   Make sure you're in the backend folder")
        exit(1)
    
    update_database()
