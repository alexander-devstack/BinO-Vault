import sqlite3
from auth.password_hasher import MasterPasswordManager
from datetime import datetime

print("Creating fresh database...")

conn = sqlite3.connect('passwords.db')
cursor = conn.cursor()

# Create users table (NO username column!)
cursor.execute('''
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    master_password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
)
''')

# Create sessions table
cursor.execute('''
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
''')

# Create password_entries table
cursor.execute('''
CREATE TABLE password_entries (
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
)
''')

# Add test user
hasher = MasterPasswordManager()
hash_value = hasher.hash_password('MyPassword123')

cursor.execute(
    'INSERT INTO users (master_password_hash, created_at) VALUES (?, ?)',
    (hash_value, datetime.now().isoformat())
)

conn.commit()
conn.close()

print("✅ Fresh database created!")
print("✅ Test user added (password: MyPassword123)")
