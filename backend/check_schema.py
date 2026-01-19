import sqlite3

DB_PATH = 'passwords.db'

print("="*70)
print("CHECKING passwords.db SCHEMA")
print("="*70 + "\n")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("📊 TABLES IN DATABASE:")
for table in tables:
    print(f"  - {table[0]}")

print("\n" + "="*70)

# Get schema for each table
for table in tables:
    table_name = table[0]
    print(f"\n📋 SCHEMA FOR '{table_name}':\n")
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    
    for col in columns:
        col_id, name, col_type, not_null, default_val, pk = col
        pk_marker = " [PRIMARY KEY]" if pk else ""
        null_marker = " NOT NULL" if not_null else ""
        default_marker = f" DEFAULT {default_val}" if default_val else ""
        print(f"  {name}: {col_type}{pk_marker}{null_marker}{default_marker}")

conn.close()

print("\n" + "="*70)
print("✅ Schema check complete!")
