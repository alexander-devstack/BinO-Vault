import sqlite3
import os
from argon2 import PasswordHasher

# Configuration
PASSWORD = "MySecurePassword123!"
DB_PATH = os.path.join(os.path.dirname(__file__), "bino_vault.db")

# Delete old database and start fresh
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
    print(f"🗑️  Deleted old database")

# Initialize database connection
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create tables with CORRECT schema (no username in users table!)
cursor.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    master_password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_name TEXT NOT NULL,
    username TEXT,
    encrypted_password TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
""")

conn.commit()
print("✅ Database tables created")

# Hash password
ph = PasswordHasher()
hashed = ph.hash(PASSWORD)

# Insert user (ONLY master_password_hash needed!)
cursor.execute(
    "INSERT INTO users (master_password_hash) VALUES (?)",
    (hashed,)
)
conn.commit()

# Verify
cursor.execute("SELECT id, master_password_hash FROM users")
user = cursor.fetchone()

conn.close()

# Success output
print("\n" + "=" * 60)
print("✅ SUCCESS! User registered successfully!")
print("=" * 60)
print(f"👤 User ID: {user[0]}")
print(f"📝 Master Password: {PASSWORD}")
print(f"💾 Database: {DB_PATH}")
print(f"🚀 Login NOW at: http://localhost:5173")
print("=" * 60 + "\n")
