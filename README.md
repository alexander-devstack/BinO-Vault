# BinO-Vault

> A neuroscience-inspired local-first password manager with enterprise-grade encryption

![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Day](https://img.shields.io/badge/Day-7%2F16-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

---

## Overview

BinO-Vault is a secure, local-first password manager designed with neuroscience-informed UX principles. Built as a portfolio project demonstrating full-stack development, cryptography implementation, and security-first architecture.

**Core Philosophy:** Your passwords don't need cloud sync or AI—they need proper encryption and a calm, trustworthy interface.

### Key Features

- **Local-Only Storage:** Zero cloud dependencies, zero subscription fees
- **Military-Grade Encryption:** AES-256-GCM with PBKDF2 key derivation
- **Neuroscience-Inspired UX:** High-contrast design reducing cognitive load
- **Accessible Design:** WCAG-compliant interface suitable for all age groups
- **Privacy-First:** No telemetry, no tracking, no external API calls

---

## Current Progress (Day 7 of 16)

### Completed Milestones

**Week 1: Foundation & Security (Days 1-7)**

- **UI/UX Design (Days 1-2):** Complete Figma design system with 4 screens at 2x resolution
- **Backend Authentication (Day 3):** Flask API with Argon2id password hashing
- **Database Architecture (Day 4):** SQLite schema design with proper normalization
- **Frontend Setup (Day 5):** Vite + React with routing and development environment
- **Auth Flow (Day 6):** Complete login system with session management
- **Encryption System (Day 7):** AES-256-GCM implementation with integration testing

### Current Status

All backend security infrastructure is production-ready. Frontend dashboard implementation begins Day 8.

---

## Security Architecture

### Authentication

- **Algorithm:** Argon2id (OWASP recommended)
- **Parameters:** time_cost=2, memory_cost=65536 (64MB), parallelism=4
- **Output:** 256-bit hash with 128-bit unique salt
- **Session Tokens:** Cryptographically secure (32-byte token_urlsafe)
- **Session Expiry:** 24-hour automatic timeout (infrastructure complete)

### Password Encryption (Implemented Day 7)

- **Algorithm:** AES-256-GCM (Authenticated Encryption with Associated Data)
- **Key Derivation:** PBKDF2-HMAC-SHA256 (100,000 iterations, NIST-compliant)
- **Unique Per-Entry:** Random 128-bit salt + 96-bit IV for each password
- **Data Integrity:** GCM authentication tag prevents tampering
- **Storage Format:** Base64-encoded (salt + IV + ciphertext + tag)

### Database Security

- **File-based:** SQLite with proper foreign key constraints
- **No Plaintext:** All sensitive data encrypted before storage
- **Schema Validation:** PRAGMA checks enforce data integrity
- **Atomic Operations:** Transaction-safe writes prevent corruption

### Planned Enhancements (Days 15-16)

- Recovery key system with Argon2-hashed backup authentication
- Rate limiting with exponential backoff on failed attempts
- CSRF protection for API endpoints
- Secure clipboard operations with auto-clear

---

## Technical Stack

### Backend

- **Framework:** Flask 3.1.2 with Blueprint architecture
- **Cryptography:**
  - `argon2-cffi 25.1.0` (password hashing)
  - `cryptography 46.0.3` (AES-256-GCM encryption)
- **Database:** SQLite 3 with SQLAlchemy ORM
- **Security:** CORS-enabled, session-based authentication

### Frontend

- **Framework:** React 18 with Vite build tool
- **Routing:** React Router v6 with protected routes
- **State Management:** Context API for global auth state
- **Styling:** Inline CSS-in-JS for pixel-perfect design control

### Development Tools

- **Version Control:** Git with feature-branch workflow
- **Testing:** Integration test suite (encryption, database, auth flow)
- **IDE:** VS Code with Python, ESLint, Prettier extensions

---

## Project Structure

```
BinO-Vault/
├── backend/
│   ├── api/
│   │   ├── auth_routes.py          # Authentication endpoints
│   │   └── password_routes.py      # Password CRUD operations
│   ├── auth/
│   │   └── password_hasher.py      # Argon2 hashing utilities
│   ├── crypto/
│   │   └── encryption.py           # AES-256-GCM implementation
│   ├── utils/
│   │   └── password_generator.py   # Secure password generation
│   ├── app.py                      # Flask application entry point
│   ├── database.py                 # SQLAlchemy models
│   ├── config.py                   # Centralized configuration
│   └── passwords.db                # SQLite database (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx           # Authentication UI
│   │   │   ├── Dashboard.jsx       # Main application view
│   │   │   └── ProtectedRoute.jsx  # Route authorization guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state
│   │   ├── services/
│   │   │   └── api.js              # API client abstraction
│   │   ├── App.jsx                 # Root component
│   │   └── main.jsx                # Application entry point
│   └── package.json
│
├── designs/                        # Figma exports (2x resolution)
├── tests/                          # Integration & unit tests
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- Git

### Backend Setup

1. Clone repository and navigate to backend:

```bash
git clone https://github.com/alexander-devstack/BinO-Vault.git
cd BinO-Vault/backend
```

2. Create virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Initialize database:

```bash
python -c "from database import DatabaseManager; db = DatabaseManager(); db.create_tables()"
```

4. Run development server:

```bash
python app.py
# Backend available at http://localhost:5000
```

### Frontend Setup

1. Navigate to frontend and install dependencies:

```bash
cd frontend
npm install
```

2. Run development server:

```bash
npm run dev
# Frontend available at http://localhost:5173
```

### Initial Login

- Master Password: `MyPassword123` (test user)
- Access dashboard at `http://localhost:5173/dashboard` after authentication

---

## Development Roadmap

### Week 1: Foundation (Days 1-7) - COMPLETE

- [x] UI/UX design system in Figma
- [x] Backend authentication with Argon2id
- [x] Database schema and models
- [x] Frontend routing and auth flow
- [x] AES-256-GCM encryption implementation
- [x] Integration testing suite

### Week 2: Feature Development (Days 8-14)

- [ ] Dashboard UI with empty states
- [ ] Add/Edit password modal with validation
- [ ] Password generator with strength indicator
- [ ] Password list view with security level badges
- [ ] Search and filter functionality
- [ ] Copy-to-clipboard with visual feedback

### Week 3: Security & Launch (Days 15-16)

- [ ] Recovery key generation and validation
- [ ] Rate limiting and session management
- [ ] Security audit and penetration testing
- [ ] Production build optimization
- [ ] Deployment documentation

---

## Architecture Decisions

### Why Local-First?

**Problem:** Cloud password managers create centralized attack targets (LastPass 2022 breach, OneLogin 2017 breach).

**Solution:** Local-only storage eliminates:

- Server-side vulnerabilities
- Network interception risks
- Subscription costs
- Vendor lock-in

### Why AES-256-GCM?

**Authenticated Encryption:** GCM mode provides both confidentiality (encryption) and integrity (authentication tag), preventing tampering attacks that CBC mode is vulnerable to.

### Why PBKDF2 (100k iterations)?

**Key Stretching:** Computationally expensive derivation makes brute-force attacks impractical. 100,000 iterations follows OWASP 2023 guidelines for password-based keys.

### Why SQLite?

**Single-User Design:** No server overhead for local application. File-based storage enables easy backup and portability.

---

## Testing

### Current Test Coverage (Day 7)

- **Encryption Round-Trip:** Validates encrypt → decrypt produces original plaintext
- **Database Integration:** Tests password storage and retrieval pipeline
- **Authentication Flow:** Verifies session creation and validation
- **Schema Integrity:** PRAGMA checks confirm table structure

### Running Tests

```bash
cd backend
python test_encryption.py       # Encryption module tests
python test_full_flow.py        # End-to-end integration tests
```

---

## Design System

### Color Palette

```css
--color-primary: #00ffa3; /* Mint green - calm, secure */
--color-bg: #1a1a1a; /* Dark gray - reduced eye strain */
--color-text: #ffffff; /* White - maximum contrast */
--color-text-secondary: #d1d5db; /* Light gray - hierarchy */
--color-error: #ef4444; /* Red - clear error signaling */
```

### UX Principles (Neuroscience-Informed)

1. **High Contrast:** WCAG AAA compliance for accessibility
2. **Large Click Targets:** Minimum 48px height (motor control accommodation)
3. **Explicit Feedback:** Every action provides visual confirmation
4. **Cognitive Load Reduction:** Minimal UI, progressive disclosure

---

## Security Considerations

### Threat Model

**In Scope:**

- Local filesystem access attacks
- Memory inspection attacks
- Brute-force master password attacks
- Database tampering

**Out of Scope:**

- Physical hardware compromise (keyloggers, screen capture)
- Operating system zero-days
- Social engineering attacks

### Known Limitations

- Master password stored in memory during session (Python garbage collection non-deterministic)
- SQLite database file accessible to OS user (filesystem encryption recommended)
- No hardware security module integration (future enhancement)

---

## Contributing

This is a portfolio/learning project. While not actively seeking contributors, feedback and suggestions are welcome via GitHub Issues.

### Development Guidelines

- Follow existing code style (Black formatter for Python, Prettier for JavaScript)
- Add tests for new features
- Update documentation for API changes
- Security-related PRs receive priority review

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

**Important:** This software is provided for educational purposes. For production use, conduct independent security audit.

---

## Author

**Alexander**

- GitHub: [@alexander-devstack](https://github.com/alexander-devstack)
- Focus: Full-stack development, applied cryptography, accessible design
- Status: BE EEE student building portfolio-quality projects

---

## Acknowledgments

- **Cryptography:** Python `cryptography` library (PyCA)
- **Password Hashing:** `argon2-cffi` (Argon2 winner of Password Hashing Competition)
- **Design Inspiration:** Neuroscience research on cognitive load and trust signals
- **Security Standards:** OWASP ASVS 4.0, NIST SP 800-63B

---

**Last Updated:** January 19, 2026 - Day 7 Complete

**Status:** Backend security infrastructure production-ready. Frontend UI implementation in progress.
