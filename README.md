# BinO-Vault

A neuroscience-inspired local-first password manager with military-grade encryption.

## Overview

BinO-Vault is a secure password management application that combines AES-256-GCM encryption with cognitive psychology principles. Built from the ground up with security, privacy, and user experience in mind.

## Core Philosophy: The Neuroscience Twist

Unlike traditional password managers that induce anxiety with "WEAK" or "STRONG" labels, BinO-Vault uses psychology-informed color coding:

- **Calm (Green)**: Strong passwords trigger reward pathways
- **Alert (Orange)**: Suggests improvement without panic
- **Critical (Red)**: Clear but measured danger signal

This approach reduces decision fatigue and encourages better security habits through positive reinforcement rather than fear.

## Technical Architecture

### Security Implementation

**Encryption Stack:**

- Algorithm: AES-256-GCM (Authenticated Encryption)
- Key Derivation: PBKDF2-HMAC-SHA256 (100,000 iterations)
- Master Password Hashing: Argon2id (OWASP recommended)
- Salt: 16 bytes random per encryption
- IV: 12 bytes random per encryption

**Data Flow:**

1. Master password hashed with Argon2id (never stored in plaintext)
2. Master password derives encryption key via PBKDF2
3. Each password encrypted individually with unique salt+IV
4. Ciphertext stored as Base64(salt + iv + ciphertext + tag)

### Backend (Python/Flask)

**Stack:**

- Flask 3.1.2 with Blueprint architecture
- SQLAlchemy ORM for database operations
- Session-based authentication
- SQLite for local-first data storage

**API Endpoints:**
POST /api/auth/login # Authenticate user
POST /api/passwords # Create password
GET /api/passwords # List all passwords
GET /api/passwords/<id> # Get specific password
PUT /api/passwords/<id> # Update password
DELETE /api/passwords/<id> # Delete password
POST /api/passwords/generate # Generate secure password

text

**Database Schema:**

```sql
-- Table: users
id INTEGER PRIMARY KEY
master_password_hash TEXT NOT NULL
created_at TEXT NOT NULL

-- Table: sessions
id INTEGER PRIMARY KEY
user_id INTEGER NOT NULL
session_token TEXT NOT NULL
created_at TEXT DEFAULT CURRENT_TIMESTAMP

-- Table: password_entries
id INTEGER PRIMARY KEY
user_id INTEGER NOT NULL
website TEXT NOT NULL
username TEXT NOT NULL
encrypted_password TEXT NOT NULL
security_level TEXT DEFAULT 'Calm'
notes TEXT
created_at TEXT DEFAULT CURRENT_TIMESTAMP
updated_at TEXT DEFAULT CURRENT_TIMESTAMP
Frontend (React/Vite)
Stack:

React 18.2 with Hooks

Vite for development and bundling

React Router for navigation

Axios for HTTP requests

Inline styles (component-scoped, zero CSS conflicts)

Component Structure:

text
src/
├── components/
│   ├── Login.jsx                 # Authentication
│   ├── Dashboard.jsx             # Main interface
│   ├── AddPasswordModal.jsx      # Create passwords
│   ├── EditPasswordModal.jsx     # Update passwords
│   ├── PasswordGenerator.jsx     # Standalone generator
│   ├── ProtectedRoute.jsx        # Route guards
│   └── Toast.jsx                 # Notifications
├── context/
│   └── AuthContext.jsx           # Global auth state
└── services/
    └── api.js                    # API client
Features Implemented
Days 1-7: Foundation
Complete UI/UX design in Figma

Backend API with 10 endpoints

AES-256-GCM encryption (tested and verified)

Session-based authentication

SQLite database with normalized schema

Password CRUD operations

Security level classification

Day 8: Dashboard & Core Functionality
Full password list display

Add password modal with inline generator

Show/Hide password toggle

Copy to clipboard

Delete password with confirmation

Toast notifications

Empty state handling

Day 9: Edit Capability
Edit password modal with pre-populated data

Password re-encryption on update

Dynamic security level recalculation

Notes field display in password cards

Day 10: Advanced Password Generator
Standalone generator modal

Collapsible generator in Add Password form

Customizable length slider (8-32 characters)

Character type selection (uppercase, lowercase, numbers, symbols)

Real-time password strength meter

Copy generated password

Security level color coding

Design System
Color Palette:

text
Primary:         #00FFA3  (Mint Green - Calm state)
Background:      #1A1A1A  (Deep Dark - Eye strain reduction)
Card:            #2A2A2A  (Slightly Lighter)
Text Primary:    #FFFFFF
Text Secondary:  #D1D5DB
Text Tertiary:   #9CA3AF
Alert:           #F59E0B  (Orange - Warning)
Critical:        #EF4444  (Red - Danger)
Edit Action:     #3B82F6  (Blue)
Generator:       #8B5CF6  (Purple)
Typography:

Font: System UI stack (Arial, Helvetica fallback)

Headings: 36px bold / 24px semibold

Body: 16px regular

Metadata: 13px italic

UX Principles:

WCAG AAA contrast compliance

Minimum 48px touch targets

Always-visible actions (no hover-only)

Explicit feedback for every interaction

Generous spacing for cognitive comfort

Installation & Setup
Prerequisites
Python 3.14+

Node.js 16+

Git

Backend Setup
bash
cd backend
pip install -r requirements.txt
python app.py
# Server runs on http://localhost:5000
Frontend Setup
bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
Test Credentials
Master Password: MyPassword123

Pre-loaded test passwords available

Testing
Encryption Tests:

bash
cd backend
python test_encryption.py
# Expected: ✅ ENCRYPTION MODULE WORKING PERFECTLY!
Integration Tests:

bash
python test_full_flow.py
# Expected: ✅ FULL INTEGRATION TEST PASSED!
Schema Verification:

bash
python check_schema.py
# Shows all 3 tables with correct structure
Development Roadmap
Week 2 (In Progress):

 Day 8: Dashboard UI + Polish

 Day 9: Edit Password Functionality

 Day 10: Password Generator Enhancements

 Day 11: Search & Filter

 Day 12: Password Details View

 Day 13: Polish & UX Refinements

 Day 14: Testing & Bug Fixes

Week 3 (Planned):

 Day 15: Security Hardening (session expiry, CSRF, rate limiting)

 Day 16: Final Testing & Deployment

Why BinO-Vault?
Local-First: Your data never leaves your machine. Zero cloud dependency.

Transparent Security: Open-source encryption implementation. No black boxes.

Cognitive Design: Built with neuroscience principles to reduce stress and improve security habits.

Educational: Real-time feedback teaches users about password security.

Developer-Friendly: Clean architecture, comprehensive documentation, auditable code.

License
MIT License - See LICENSE file for details.

Development Notes
This project is being developed as a 16-day sprint to demonstrate full-stack capabilities, security implementation, and UX design principles. Each day's progress is documented and committed to GitHub.

Developer: Alexander
Start Date: January 2026
Status: Day 10 Complete (62.5% complete)

Built with security, designed with psychology, crafted with care.
```
