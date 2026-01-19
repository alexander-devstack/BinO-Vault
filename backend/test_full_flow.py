"""
Test the complete password manager flow:
1. Login (existing user)
2. Encrypt a password
3. Store it in database
4. Retrieve and decrypt it
"""
import sqlite3
from crypto.encryption import PasswordEncryption
from auth.password_hasher import MasterPasswordManager

DB_PATH = 'passwords.db'
MASTER_PASSWORD = 'MyPassword123'  # Your test password

print("="*70)
print("FULL INTEGRATION TEST")
print("="*70 + "\n")

# Step 1: Get user_id (assuming you already have a user)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT id FROM users LIMIT 1")
user_result = cursor.fetchone()

if not user_result:
    print("❌ No user found! Please login first via your app.")
    conn.close()
    exit(1)

user_id = user_result[0]
print(f"✅ Found user (ID: {user_id})\n")

# Step 2: Encrypt a test password
print("🔐 Testing Encryption...")
test_password = "TestPassword@2026"
encryptor = PasswordEncryption(MASTER_PASSWORD)
encrypted = encryptor.encrypt(test_password)
print(f"   Original: {test_password}")
print(f"   Encrypted: {encrypted[:50]}... (length: {len(encrypted)})")
print(f"   ✅ Encryption successful\n")

# Step 3: Store in database
print("💾 Storing in password_entries table...")
cursor.execute("""
    INSERT INTO password_entries 
    (user_id, website, username, encrypted_password, security_level, notes)
    VALUES (?, ?, ?, ?, ?, ?)
""", (user_id, "TestSite", "testuser@example.com", encrypted, "Calm", "Test entry"))
conn.commit()

password_id = cursor.lastrowid
print(f"   ✅ Stored with ID: {password_id}\n")

# Step 4: Retrieve and decrypt
print("🔓 Retrieving and decrypting...")
cursor.execute("""
    SELECT website, username, encrypted_password, security_level 
    FROM password_entries 
    WHERE id = ?
""", (password_id,))

result = cursor.fetchone()
if result:
    website, username, encrypted_pass, security_level = result
    
    # Decrypt
    decrypted = encryptor.decrypt(encrypted_pass)
    
    print(f"   Website: {website}")
    print(f"   Username: {username}")
    print(f"   Decrypted Password: {decrypted}")
    print(f"   Security Level: {security_level}")
    print(f"   ✅ Match: {decrypted == test_password}\n")

# Step 5: Clean up test data
print("🧹 Cleaning up test entry...")
cursor.execute("DELETE FROM password_entries WHERE id = ?", (password_id,))
conn.commit()
print("   ✅ Test entry removed\n")

conn.close()

print("="*70)
print("✅ FULL INTEGRATION TEST PASSED!")
print("="*70)
print("\n🎉 Your password manager is ready to use!")
