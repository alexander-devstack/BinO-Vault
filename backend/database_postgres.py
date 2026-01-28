import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Get DATABASE_URL from environment (Render provides this automatically)
DATABASE_URL = os.environ.get('DATABASE_URL')

# Fix for Render's postgres:// URL (needs to be postgresql://)
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

# Fallback to SQLite for local development
if not DATABASE_URL:
    DATABASE_URL = 'sqlite:///passwords.db'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    master_password_hash = Column(String(255), nullable=False)
    recovery_key_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sessions = relationship('Session', back_populates='user', cascade='all, delete-orphan')
    password_entries = relationship('PasswordEntry', back_populates='user', cascade='all, delete-orphan')

class Session(Base):
    __tablename__ = 'sessions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    
    user = relationship('User', back_populates='sessions')

class PasswordEntry(Base):
    __tablename__ = 'password_entries'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    website = Column(String(255), nullable=False)
    username = Column(String(255), nullable=False)
    encrypted_password = Column(String(500), nullable=False)
    security_level = Column(String(50), default='calm')
    notes = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship('User', back_populates='password_entries')

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
