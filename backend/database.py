from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()


class User(Base):
    """
    User table - stores master password and recovery key hashes.

    SECURITY DESIGN:
    - Only ONE user per vault (local-only app)
    - Master password: Argon2id hash (never stored in plaintext)
    - Recovery key: Argon2id hash (for password reset)
    - Created_at: Timestamp for security auditing
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)  # Can be email or custom name
    master_password_hash = Column(String(255), nullable=False)  # Argon2id hash
    recovery_key_hash = Column(String(255), nullable=False)  # Argon2id hash
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)


class PasswordEntry(Base):
    """
    Password entries table - stores encrypted passwords.

    ENCRYPTION:
    - All passwords encrypted with AES-256-GCM before storage
    - Website/username stored in plaintext (for search/display)
    - Password field: Base64-encoded ciphertext

    NEUROSCIENCE UX FEATURE:
    - Security_level: Calm/Alert/Critical (color-coded in your UI)
    """
    __tablename__ = 'password_entries'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to users table
    website = Column(String(200), nullable=False)  # e.g., "Gmail"
    username = Column(String(200), nullable=False)  # e.g., "yourname@gmail.com"
    encrypted_password = Column(String(500), nullable=False)  # AES-256-GCM ciphertext
    security_level = Column(String(20), default='Calm')  # Calm, Alert, Critical
    notes = Column(String(500), nullable=True)  # Optional user notes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DatabaseManager:
    """
    Handles database connection and session management.

    WHY SQLALCHEMY:
    - ORM: Write Python instead of raw SQL (safer, easier)
    - Automatic migrations: Easy to add new fields later
    - SQL injection protection: Built-in parameterization
    """

    def __init__(self, db_path: str = None):
        """
        Initialize database connection.

        Args:
            db_path: Path to SQLite database file (default: backend/bino_vault.db)
        """
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), 'bino_vault.db')

        self.db_path = db_path
        self.engine = create_engine(f'sqlite:///{db_path}', echo=False)
        self.Session = sessionmaker(bind=self.engine)

    def create_tables(self):
        """Create all database tables if they don't exist."""
        Base.metadata.create_all(self.engine)
        print(f"✅ Database tables created at: {self.db_path}")

    def get_session(self):
        """
        Get a new database session.

        Returns:
            SQLAlchemy session object
        """
        return self.Session()

    def drop_tables(self):
        """Drop all tables (USE CAREFULLY - deletes all data!)"""
        Base.metadata.drop_all(self.engine)
        print("⚠️  All database tables dropped!")


# Test database creation
if __name__ == "__main__":
    print("=== Database Initialization Test ===\n")

    # Create database manager
    db = DatabaseManager()

    # Create tables
    db.create_tables()

    # Test session creation
    session = db.get_session()
    print(f"✅ Database session created successfully")

    # Check if tables exist
    from sqlalchemy import inspect

    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"✅ Tables in database: {tables}")

    session.close()
    print("\n✅ Database initialization complete!")
