import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'passwords.db')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("🔧 Adding recovery_key_hash to users table...")

try:
    cursor.execute("ALTER TABLE users ADD COLUMN recovery_key_hash TEXT")
    conn.commit()
    print("✅ recovery_key_hash column added!")
except sqlite3.OperationalError as e:
    if "duplicate column" in str(e):
        print("⚠️ Column already exists - skipping")
    else:
        raise

conn.close()
print("✅ Migration complete!")
