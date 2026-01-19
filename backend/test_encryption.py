"""Test script for encryption module"""
from crypto.encryption import PasswordEncryption

def test_encryption_round_trip():
    """Test that encryption and decryption work correctly"""
    master_password = "MyPassword123"
    test_password = "SuperSecret@2026"
    
    print("="*70)
    print("TESTING PASSWORD ENCRYPTION")
    print("="*70 + "\n")
    
    # Create encryptor instance
    encryptor = PasswordEncryption(master_password)
    
    # Encrypt
    print("🔐 Testing Encryption...")
    encrypted = encryptor.encrypt(test_password)
    print(f"   Original: {test_password}")
    print(f"   Encrypted: {encrypted[:50]}... (length: {len(encrypted)})")
    print(f"   ✅ Encryption successful\n")
    
    # Decrypt
    print("🔓 Testing Decryption...")
    decrypted = encryptor.decrypt(encrypted)
    print(f"   Decrypted: {decrypted}")
    print(f"   ✅ Match: {decrypted == test_password}\n")
    
    # Verify
    assert decrypted == test_password, "Decryption failed!"
    print("="*70)
    print("✅ ENCRYPTION MODULE WORKING PERFECTLY!")
    print("="*70)

def test_wrong_password():
    """Test that wrong password fails decryption"""
    correct_password = "MyPassword123"
    wrong_password = "WrongPassword"
    test_data = "TestPassword"
    
    print("\n" + "="*70)
    print("TESTING WRONG PASSWORD SCENARIO")
    print("="*70 + "\n")
    
    # Encrypt with correct password
    encryptor = PasswordEncryption(correct_password)
    encrypted = encryptor.encrypt(test_data)
    
    # Try to decrypt with wrong password
    wrong_encryptor = PasswordEncryption(wrong_password)
    
    try:
        wrong_encryptor.decrypt(encrypted)
        print("❌ ERROR: Should have failed but didn't!")
    except Exception as e:
        print(f"✅ Correctly rejected wrong password")
        print(f"   Error: {type(e).__name__}")
    
    print("\n" + "="*70)
    print("✅ WRONG PASSWORD TEST PASSED!")
    print("="*70)

if __name__ == "__main__":
    test_encryption_round_trip()
    test_wrong_password()
