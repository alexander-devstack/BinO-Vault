import sqlite3
from argon2 import PasswordHasher
from datetime import datetime

# Initialize hasher
ph = PasswordHasher()

# Hash the password
hashed = ph.hash("MyPassword123")

# Create database and user
conn = sqlite3.connect('passwords.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    master_password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
)''')

cursor.execute("INSERT INTO users (master_password_hash, created_at) VALUES (?, ?)", 
               (hashed, datetime.now().isoformat()))

conn.commit()
conn.close()
print("✅ USER CREATED WITH PASSWORD: MyPassword123")
