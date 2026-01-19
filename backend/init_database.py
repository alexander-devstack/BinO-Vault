"""
Initialize passwords.db with all tables and a test user
"""
from database import DatabaseManager
from auth.password_hasher import MasterPasswordManager
from datetime import datetime

print("="*70)
print("INITIALIZING DATABASE")
print("="*70 + "\n")

# Create database manager
db = DatabaseManager()

# Create all tables
print("Creating tables...")
db.create_tables()
print("✅ Tables created\n")

# Create test user
print("Creating test user...")
hasher = MasterPasswordManager()
master_password = "MyPassword123"
password_hash = hasher.hash_password(master_password)

conn = db.get_connection()
cursor = conn.cursor()

# Check if user already exists
cursor.execute("SELECT COUNT(*) FROM users")
count = cursor.fetchone()[0]

if count == 0:
    cursor.execute(
        "INSERT INTO users (master_password_hash, created_at) VALUES (?, ?)",
        (password_hash, datetime.now().isoformat())
    )
    conn.commit()
    print(f"✅ Test user created (password: {master_password})\n")
else:
    print(f"⚠️  User already exists (count: {count})\n")

conn.close()

# Verify
print("="*70)
print("VERIFICATION")
print("="*70 + "\n")

conn = db.get_connection()
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cursor.fetchall()]
print(f"📊 Tables: {', '.join(tables)}\n")

cursor.execute("SELECT COUNT(*) FROM users")
user_count = cursor.fetchone()[0]
print(f"👤 Users: {user_count}")

conn.close()

print("\n" + "="*70)
print("✅ Database initialization complete!")
print("="*70)

