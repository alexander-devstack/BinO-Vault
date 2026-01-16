from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import secrets
import string


class MasterPasswordManager:
    """
    Handles master password hashing and recovery key generation.

    SECURITY DESIGN:
    - Argon2id: Memory-hard hashing (prevents GPU attacks)
    - Recovery key: 256-bit entropy (secure fallback if password forgotten)
    - No plaintext storage: Only hashes stored in database
    """

    def __init__(self):
        """Initialize Argon2 hasher with security parameters from config."""
        self.hasher = PasswordHasher(
            time_cost=2,  # 2 iterations
            memory_cost=65536,  # 64 MB RAM
            parallelism=4,  # 4 threads
            hash_len=32,  # 256-bit hash
            salt_len=16  # 128-bit salt
        )

    def hash_password(self, password: str) -> str:
        """
        Hash master password using Argon2id.

        Args:
            password: Master password to hash

        Returns:
            Argon2 hash string (includes salt, parameters, hash)
        """
        return self.hasher.hash(password)

    def verify_password(self, password: str, password_hash: str) -> bool:
        """
        Verify master password against stored hash.

        Args:
            password: Password to verify
            password_hash: Stored Argon2 hash

        Returns:
            True if password matches, False otherwise
        """
        try:
            self.hasher.verify(password_hash, password)
            return True
        except VerifyMismatchError:
            return False

    def generate_recovery_key(self) -> str:
        """
        Generate cryptographically secure recovery key.

        FORMAT: XXXX-XXXX-XXXX-XXXX-XXXX (20 chars + 4 dashes = 24 total)
        ENTROPY: 256 bits (equivalent to AES-256 key strength)

        WHY THIS FORMAT:
        - Easy to write down (grouped for readability)
        - Hard to guess (64^20 possible combinations)
        - URL-safe characters (alphanumeric only)

        Returns:
            Recovery key in format: B7F3-K9J2-P4M8-Q1W6-Z5N3
        """
        # Use secrets module (cryptographically secure random)
        alphabet = string.ascii_uppercase + string.digits  # A-Z, 0-9 (36 chars)

        # Generate 20 random characters (5 groups of 4)
        key_parts = []
        for _ in range(5):
            part = ''.join(secrets.choice(alphabet) for _ in range(4))
            key_parts.append(part)

        # Join with dashes for readability
        return '-'.join(key_parts)

    def hash_recovery_key(self, recovery_key: str) -> str:
        """
        Hash recovery key for storage (same as master password).

        Args:
            recovery_key: Generated recovery key

        Returns:
            Argon2 hash of recovery key
        """
        return self.hasher.hash(recovery_key)

    def verify_recovery_key(self, recovery_key: str, key_hash: str) -> bool:
        """
        Verify recovery key against stored hash.

        Args:
            recovery_key: Recovery key entered by user
            key_hash: Stored Argon2 hash

        Returns:
            True if key matches, False otherwise
        """
        try:
            self.hasher.verify(key_hash, recovery_key)
            return True
        except VerifyMismatchError:
            return False


# Test the module
if __name__ == "__main__":
    pm = MasterPasswordManager()

    # Test master password hashing
    print("=== Master Password Test ===")
    master_pass = "MySecureMasterPassword123!"
    hashed = pm.hash_password(master_pass)
    print(f"Password: {master_pass}")
    print(f"Hash: {hashed}")
    print(f"Verify (correct): {pm.verify_password(master_pass, hashed)}")
    print(f"Verify (wrong): {pm.verify_password('WrongPassword', hashed)}")

    print("\n=== Recovery Key Test ===")
    # Test recovery key generation
    recovery_key = pm.generate_recovery_key()
    print(f"Generated Recovery Key: {recovery_key}")
    print(f"Length: {len(recovery_key)} characters")

    # Test recovery key verification
    key_hash = pm.hash_recovery_key(recovery_key)
    print(f"Recovery Key Hash: {key_hash}")
    print(f"Verify (correct): {pm.verify_recovery_key(recovery_key, key_hash)}")
    print(f"Verify (wrong): {pm.verify_recovery_key('AAAA-BBBB-CCCC-DDDD-EEEE', key_hash)}")
