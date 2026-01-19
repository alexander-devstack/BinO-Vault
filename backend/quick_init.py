import sqlite3
from auth.password_hasher import MasterPasswordManager
from datetime import datetime

# Connect to database
conn = sqlite3.connect('passwords.db')
cursor = conn.cursor()

# Create tables
cursor.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    master_password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    recovery_key_hash TEXT
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS password_entries (
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
)''')

# Create test user
hasher = MasterPasswordManager()
password_hash = hasher.hash_password('MyPassword123')

cursor.execute(
    'INSERT INTO users (master_password_hash, created_at) VALUES (?, ?)',
    (password_hash, datetime.now().isoformat())
)

conn.commit()

# Verify
cursor.execute('SELECT COUNT(*) FROM users')
user_count = cursor.fetchone()[0]

print(f'✅ Database initialized! Users: {user_count}')
conn.close()
