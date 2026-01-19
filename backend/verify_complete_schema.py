import sqlite3

DB_PATH = 'passwords.db'

print("="*70)
print("COMPLETE SCHEMA CHECK")
print("="*70 + "\n")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [t[0] for t in cursor.fetchall()]

print(f"📊 All Tables: {', '.join(tables)}\n")

# Check each table we need
required_tables = ['users', 'sessions', 'password_entries']

for table in required_tables:
    if table in tables:
        print(f"✅ {table} exists")
        cursor.execute(f"PRAGMA table_info({table});")
        cols = cursor.fetchall()
        for col in cols:
            print(f"   - {col[1]}: {col[2]}")
        print()
    else:
        print(f"❌ {table} MISSING\n")

conn.close()

print("="*70)
