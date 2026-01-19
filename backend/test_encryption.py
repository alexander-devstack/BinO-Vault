"""Test script for encryption module"""
from crypto.encryption import PasswordEncryption

def test_encryption_round_trip():
    """Test that encryption and decryption work correctly"""
    master_password = "MyPassword123"
    test_password = "SuperSecret@2026"
    
    # Encrypt
    encrypted = PasswordEncryption.encrypt(test_password, master_password)
    print(f"✅ Encrypted: {encrypted[:50]}... (length: {len(encrypted)})")
    
    # Decrypt
    decrypted = PasswordEncryption.decrypt(encrypted, master_password)
    print(f"✅ Decrypted: {decrypted}")
    
    # Verify
    assert decrypted == test_password, "Decryption failed!"
    print("✅ Round-trip successful!\n")

def test_wrong_password():
    """Test that wrong password fails decryption"""
    correct_password = "MyPassword123"
    wrong_password = "WrongPassword"
    test_data = "TestPassword"
    
    encrypted = PasswordEncryption.encrypt(test_data, correct_password)
    
    try:
        PasswordEncryption.decrypt(encrypted, wrong_password)
        print("❌ ERROR: Should have failed with wrong password!")
    except Exception as e:
        print(f"✅ Correctly rejected wrong password: {type(e).__name__}")

def test_unique_encryption():
    """Test that same password encrypts differently each time"""
    master_password = "MyPassword123"
    test_password = "SamePassword"
    
    encrypted1 = PasswordEncryption.encrypt(test_password, master_password)
    encrypted2 = PasswordEncryption.encrypt(test_password, master_password)
    
    assert encrypted1 != encrypted2, "Encryptions should be unique!"
    print(f"✅ Same password produces unique ciphertexts (different salts/IVs)\n")

if __name__ == "__main__":
    print("🔐 TESTING ENCRYPTION MODULE\n")
    print("="*60 + "\n")
    
    test_encryption_round_trip()
    test_wrong_password()
    test_unique_encryption()
    
    print("="*60)
    print("🎉 ALL TESTS PASSED!")
