# BinO-Vault

A neuroscience-inspired, local-first password manager built with security and cognitive psychology principles at its core.

## Overview

BinO-Vault is a secure password management application that combines military-grade AES-256-GCM encryption with cognitive psychology principles to create an intuitive, anxiety-reducing user experience. Unlike traditional password managers that rely on cloud storage, BinO-Vault stores all data locally, giving you complete control and ownership of your sensitive information.

## Core Philosophy

Traditional password managers often induce anxiety with labels like "WEAK" or "STRONG". BinO-Vault takes a different approach by using psychology-informed security level indicators:

- **Calm (Green)**: Strong passwords that trigger positive reinforcement
- **Alert (Orange)**: Moderate passwords that suggest improvement without inducing panic
- **Critical (Red)**: Weak passwords with clear, actionable danger signals

This neuroscience-based approach leverages motivational psychology rather than shame-based security prompts.

## Key Features

### Security & Encryption

- **AES-256-GCM encryption**: Military-grade authenticated encryption for all stored passwords
- **PBKDF2 key derivation**: 100,000 iterations for enhanced security
- **Local-first architecture**: All data stored locally with zero cloud dependency
- **Session-based authentication**: Secure authentication without JWT complexity
- **Argon2id password hashing**: OWASP-compliant master password protection

### Password Management

- **Complete CRUD operations**: Create, read, update, and delete password entries
- **Advanced password generator**: Customizable length (8-32 characters) with character type selection
- **Real-time strength analysis**: Instant feedback on password security
- **Encrypted storage**: All passwords encrypted with your master password before storage
- **Notes support**: Add contextual information to password entries

### User Experience

- **Search functionality**: Real-time search by website name or username
- **Multi-level filtering**: Filter passwords by security level (Calm, Alert, Critical)
- **Flexible sorting**: Sort by date added or alphabetically
- **Password details view**: Click any password card for expanded details and metadata
- **Copy to clipboard**: One-click copy for usernames and passwords
- **Show/Hide passwords**: Toggle password visibility with eye icons
- **Toast notifications**: Professional feedback for all actions

### Accessibility & Polish

- **Keyboard shortcuts**: Ctrl+K (Cmd+K on Mac) to focus search
- **Clickable password cards**: Entire card surface is interactive for better discoverability
- **Hover effects**: Visual feedback on interactive elements
- **Empty state handling**: Helpful guidance when no passwords match search criteria
- **Results counter**: Clear visibility of filtered results

## Technology Stack

### Backend

- **Python 3.14**: Core backend language
- **Flask 3.1.2**: Lightweight web framework
- **SQLite**: Embedded database for local data storage
- **Cryptography 46.0.3**: Encryption operations
- **Argon2-cffi 25.1.0**: Password hashing
- **Flask-CORS 6.0.2**: Cross-origin resource sharing

### Frontend

- **React 18.2**: UI component library
- **Vite 5.0**: Lightning-fast build tool and dev server
- **React Router 6.20**: Client-side routing
- **Axios 1.6.2**: HTTP client for API communication
- **Inline styles**: Component-scoped styling for zero CSS conflicts

### Security Implementation

- **Session-based authentication**: Master password never stored, only Argon2id hash
- **Password encryption**: AES-256-GCM with user's master password as key material
- **PBKDF2 key derivation**: 100,000 rounds for secure key generation
- **CORS protection**: Configured cross-origin security

## Project Structure

BinO-Vault/
├── backend/
│ ├── api/
│ │ ├── auth_routes.py # Authentication endpoints
│ │ └── password_routes.py # Password CRUD endpoints
│ ├── auth/
│ │ └── password_hasher.py # Argon2id implementation
│ ├── crypto/
│ │ └── encryption.py # AES-256-GCM encryption
│ ├── utils/
│ │ └── password_generator.py # Secure password generation
│ ├── app.py # Flask application entry point
│ ├── config.py # Configuration management
│ ├── database.py # SQLAlchemy models
│ └── passwords.db # SQLite database
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── AddPasswordModal.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── EditPasswordModal.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── PasswordDetailsModal.jsx
│ │ │ ├── PasswordGenerator.jsx
│ │ │ ├── ProtectedRoute.jsx
│ │ │ └── Toast.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx # Global authentication state
│ │ ├── services/
│ │ │ └── api.js # Axios API client
│ │ ├── App.jsx # Application routing
│ │ ├── main.jsx # React entry point
│ │ └── index.css # Global styles
│ ├── package.json
│ └── vite.config.js
│
├── designs/ # Figma design exports
├── LICENSE
└── README.md

text

## Installation

### Prerequisites

- Python 3.14 or higher
- Node.js 16 or higher
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
Create and activate a virtual environment:

bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

bash
pip install -r requirements.txt
Initialize the database:

bash
python init_database.py
Start the Flask server:

bash
python app.py
The backend will run on http://localhost:5000

Frontend Setup
Navigate to the frontend directory:

bash
cd frontend
Install dependencies:

bash
npm install
Start the development server:

bash
npm run dev
The frontend will run on http://localhost:5173

Usage
Open your browser and navigate to http://localhost:5173

Enter your master password (first-time users will create a new account)

Add your first password using the "Add Password" button

Use the search bar, filters, and sort options to organize your passwords

Click any password card to view full details

Use the password generator to create strong, random passwords

Keyboard Shortcuts
Ctrl+K (Cmd+K on Mac): Focus the search bar

ESC: Close any open modal

Enter: Submit forms in modals

Security Considerations
Master Password
Your master password is the key to all your encrypted data. BinO-Vault:

Never stores your master password in plain text

Only stores an Argon2id hash for authentication

Uses your master password for encryption/decryption operations

Keeps your master password in memory only during your session

Data Storage
All passwords are encrypted before being written to the database

The encryption key is derived from your master password using PBKDF2

Each password entry is encrypted individually with a unique salt and IV

The database file (passwords.db) is stored locally on your machine

Best Practices
Choose a strong, unique master password

Never share your master password

Keep your passwords.db file secure and backed up

Run BinO-Vault on a trusted, malware-free system

Close the application when not in use

Development
Testing
Run encryption tests:

bash
cd backend
python test_encryption.py
Run integration tests:

bash
python test_full_flow.py
Verify database schema:

bash
python check_schema.py
Building for Production
Build the frontend:

bash
cd frontend
npm run build
The production build will be created in the frontend/dist directory.

Design System
Color Palette
Primary: #00FFA3 (Mint Green) - Calm, safety, positive reinforcement

Background: #1A1A1A (Dark Gray) - Eye strain reduction

Card Background: #2A2A2A - Visual hierarchy

Text: #FFFFFF - Maximum contrast

Security Levels:

Calm: #00FFA3 (Green)

Alert: #F59E0B (Orange)

Critical: #EF4444 (Red)

Typography
Font Family: System UI (Arial, Helvetica fallback)

Headings: 36px bold

Subheadings: 24px semibold

Body Text: 16px regular

Monospace: For password display

Accessibility
WCAG AAA compliant contrast ratios

Minimum 48px height for interactive elements

Always-visible action buttons (no hover-only UI)

Keyboard navigation support

Screen reader friendly

Neuroscience-Inspired Features
Stress Reduction
Dark mode by default reduces eye strain and cortisol levels

Calm color palette triggers parasympathetic nervous system

Generous spacing prevents visual overwhelm

Cognitive Load Minimization
Single master password (no complex setup)

One-screen dashboard (everything visible at once)

Progressive disclosure (details on demand)

Clear visual hierarchy

Pattern Recognition
Color-coded security levels for instant comprehension

Consistent iconography throughout the interface

Left-border indicators for peripheral vision activation

Dopamine-Driven Feedback
Immediate toast notifications for all actions

Visual rewards for strong passwords

Copy confirmations provide instant gratification

Future Development Roadmap
Week 3 Features (In Development)
Session expiry after 24 hours of inactivity

CSRF protection for all state-changing operations

Rate limiting on authentication attempts

Recovery key generation and verification

Automatic clipboard clearing after 30 seconds

Error boundary implementation

Cross-browser compatibility testing

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contributing
This is currently a personal project by Alexander, a first-year Electrical and Electronics Engineering student. Contributions, issues, and feature requests are welcome.

Acknowledgments
Inspired by neuroscience research on stress reduction and cognitive load

Built with security best practices from OWASP guidelines

UI/UX design principles based on cognitive psychology research

Contact
GitHub: alexander-devstack

Version History
v0.75 (Current) - Days 1-12 Complete

Search, filter, and sort functionality

Password details view with metadata

Complete CRUD operations

Advanced password generator

Neuroscience-inspired UX

v1.0 (Planned) - Day 16 Release

Security hardening complete

Full testing coverage

Production-ready build

Deployment documentation
```
