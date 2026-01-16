import os
from datetime import timedelta


class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-CHANGE-IN-PRODUCTION-2026')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'

    # Session settings
    SESSION_LIFETIME = timedelta(minutes=30)

    # Database settings
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'bino_vault.db')

    # Encryption settings
    ENCRYPTION_KEY_SIZE = 32
    SALT_SIZE = 16

    # Password generation settings
    PASSWORD_MIN_LENGTH = 12
    PASSWORD_MAX_LENGTH = 64
    PASSWORD_DEFAULT_LENGTH = 16

    # Argon2id parameters
    ARGON2_TIME_COST = 2
    ARGON2_MEMORY_COST = 65536
    ARGON2_PARALLELISM = 4

    # CORS settings
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5000',
    ]


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'temp-production-key')


# Config dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
