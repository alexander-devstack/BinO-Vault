from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os
import base64


class PasswordEncryption:
    """
    Handles encryption/decryption of stored passwords using AES-256-GCM.

    WHY AES-256-GCM:
    - AES-256: Military-grade encryption (used by governments)
    - GCM mode: Provides authentication (prevents tampering)
    - Authenticated encryption: Attackers can't modify ciphertext without detection

    SECURITY DESIGN:
    1. Master password → derive encryption key (PBKDF2)
    2. Each password gets unique IV (nonce)
    3. GCM tag ensures data integrity
    4. Salt stored with ciphertext (no key reuse)
    """

    def __init__(self, master_password: str):
        """
        Initialize encryption with master password.

        Args:
            master_password: User's master password (not stored, only used to derive key)
        """
        self.master_password = master_password.encode('utf-8')

    def _derive_key(self, salt: bytes) -> bytes:
        """
        Derive encryption key from master password using PBKDF2.

        WHY PBKDF2:
        - Key derivation function (stretches password into strong key)
        - 100,000 iterations makes brute-force expensive
        - SHA-256 is fast but secure enough for key derivation

        Args:
            salt: Random salt (ensures same password produces different keys)

        Returns:
            32-byte encryption key
        """
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,  # AES-256 requires 32-byte key
            salt=salt,
            iterations=100000,  # NIST recommendation (2023)
            backend=default_backend()
        )
        return kdf.derive(self.master_password)

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypt a password for storage.

        ENCRYPTION PROCESS:
        1. Generate random salt (16 bytes)
        2. Derive encryption key from master password + salt
        3. Generate random IV (12 bytes for GCM)
        4. Encrypt plaintext with AES-256-GCM
        5. Combine: salt + iv + ciphertext + tag
        6. Base64 encode for storage

        Args:
            plaintext: Password to encrypt (e.g., "MyP@ssw0rd!")

        Returns:
            Base64-encoded encrypted data (safe for database storage)
        """
        # Generate random salt and IV
        salt = os.urandom(16)  # 128-bit salt
        iv = os.urandom(12)  # 96-bit IV (GCM standard)

        # Derive encryption key
        key = self._derive_key(salt)

        # Create AES-256-GCM cipher
        cipher = Cipher(
            algorithms.AES(key),
            modes.GCM(iv),
            backend=default_backend()
        )
        encryptor = cipher.encryptor()

        # Encrypt the password
        ciphertext = encryptor.update(plaintext.encode('utf-8')) + encryptor.finalize()

        # Get authentication tag (proves data wasn't tampered with)
        tag = encryptor.tag

        # Combine all components: salt + iv + ciphertext + tag
        encrypted_data = salt + iv + ciphertext + tag

        # Base64 encode for safe storage in database
        return base64.b64encode(encrypted_data).decode('utf-8')

    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt a stored password.

        DECRYPTION PROCESS:
        1. Base64 decode
        2. Extract: salt (16) + iv (12) + ciphertext + tag (16)
        3. Derive encryption key from master password + salt
        4. Decrypt with AES-256-GCM
        5. Verify authentication tag (fails if data was tampered)

        Args:
            encrypted_data: Base64-encoded encrypted password

        Returns:
            Decrypted plaintext password

        Raises:
            Exception: If decryption fails (wrong master password or tampered data)
        """
        # Base64 decode
        encrypted_bytes = base64.b64decode(encrypted_data.encode('utf-8'))

        # Extract components
        salt = encrypted_bytes[:16]  # First 16 bytes
        iv = encrypted_bytes[16:28]  # Next 12 bytes
        tag = encrypted_bytes[-16:]  # Last 16 bytes
        ciphertext = encrypted_bytes[28:-16]  # Everything in between

        # Derive encryption key
        key = self._derive_key(salt)

        # Create AES-256-GCM cipher
        cipher = Cipher(
            algorithms.AES(key),
            modes.GCM(iv, tag),  # Tag verifies authenticity
            backend=default_backend()
        )
        decryptor = cipher.decryptor()

        # Decrypt
        plaintext = decryptor.update(ciphertext) + decryptor.finalize()

        return plaintext.decode('utf-8')
