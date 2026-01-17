# BinO-Vault

> Local-only, zero-knowledge password manager inspired by cognitive neuroscience.  
> No cloud. No vendors. No silent data collection.

In a world where every product wants to be "AI-powered" and "cloud-synced," BinO-Vault takes the opposite stance: your most sensitive secrets should never leave your device.

---

## Project Status

**Current Phase:** Frontend Component System (Day 5)  
**Backend:** Complete  
**Frontend:** In progress

### Progress Overview

- UI/UX Design – complete  
- Backend API – complete (Day 3)  
- Frontend Foundations – complete (Day 4–5)  
- Integration & Testing – upcoming

**Latest Update (Jan 17, 2026):**

- Frontend design system and reusable component library implemented in React + Tailwind (Button, Input with password toggle, Password Card with risk status).
- API service layer created to connect React to the Flask backend (but not yet wired into final screens).

---

## Backend Architecture (Implemented)

### Tech Stack

- Framework: Flask (Python 3.14)  
- Database: SQLite (encrypted at rest)  
- Encryption: AES-256-GCM (Fernet)  
- Hashing: Argon2id for master password  
- Auth: Session-based token authentication

### API Endpoints

**Authentication**

- `POST /auth/register` – Create new vault with master password  
- `POST /auth/login` – Authenticate and create session  
- `POST /auth/logout` – End session  
- `GET /auth/verify` – Verify session token  
- `POST /auth/recovery-key` – Generate recovery key

**Password Management**

- `POST /passwords` – Add new password entry  
- `GET /passwords` – List all passwords (encrypted)  
- `GET /passwords/<id>` – Get specific password details  
- `PUT /passwords/<id>` – Update password entry  
- `DELETE /passwords/<id>` – Delete password entry

### Security Features

- Zero-knowledge: passwords encrypted before hitting disk  
- AES-256-GCM symmetric encryption for vault contents  
- Argon2id hashing for master password (OWASP-recommended, memory-hard)  
- Cryptographically secure password generator (16-character default)  
- Password strength calculation  
- Recovery key system for master password loss  
- Session-token-based authentication

### Backend Structure

backend/
├── api/
│ ├── auth_routes.py # Authentication endpoints
│ └── password_routes.py # Password CRUD endpoints
├── core/
│ ├── encryption.py # AES-256-GCM encryption helpers
│ ├── password_manager.py # Core password management logic
│ └── database.py # SQLite database handler
├── utils/
│ ├── password_generator.py # Strong password generation
│ └── password_strength.py # Strength calculation
└── app.py # Flask application entry point

Run `python backend/app.py` and use `test_api.html` to exercise the endpoints.

---

## Frontend Architecture (In Progress)

### Tech Stack

- Framework: Vite + React  
- Styling: Tailwind CSS (configured with custom design system)  
- State: React hooks (Context planned for authentication)

### Current Frontend Deliverables (Day 4–5)

**Folder Structure**

frontend/src/
├── components/
│ └── common/
│ ├── Button.jsx # Reusable button (primary / secondary)
│ ├── Input.jsx # Text / password input with show/hide toggle
│ └── Card.jsx # Password card with risk status
├── services/
│ └── api.js # Axios-based client for Flask API
├── styles/
│ └── designSystem.js # Centralized design tokens
├── App.jsx # Component showcase / test harness
├── index.css # Tailwind + global styles
└── main.jsx # React entry point

**Design System (Implemented in Tailwind + JS)**

- Colors  
  - `primary`: `#00FFA3`  
  - `bgDark`: `#1A1A1A`  
  - `cardBg`: `#2A2A2A`  
  - `textWhite`, `textGray`  
  - Risk colors: `safe` (green), `warning` (yellow), `critical` (red)
- Border radii  
  - `card`: 12px  
  - `button`: 8px  
  - `input`: 8px

This design system is available both in Tailwind's configuration and in `designSystem.js` for non-class-based usage.

**Reusable Components**

- `Button.jsx`  
  - Props: `variant` (`primary` | `secondary`), `type`, `disabled`, `onClick`, `children`  
  - Encapsulates consistent padding, typography, focus states, and color variants.

- `Input.jsx`  
  - Props: `label`, `type`, `value`, `onChange`, `placeholder`, `required`, etc.  
  - Optional password visibility toggle implemented with `useState`, rendering an eye icon that switches between masked and plain text input.

- `Card.jsx`  
  - Props: `service`, `username`, `status` (`safe` | `warning` | `critical`), `onClick`  
  - Uses status to drive left border color and text treatments:
    - Safe → green border ("Calm")  
    - Warning → yellow border ("Alert")  
    - Critical → red border ("Critical")  
  - Dark card background to match Figma dashboard design.

**API Service Layer**

`services/api.js` defines a typed interface around the Flask backend:

- `authAPI`: `register`, `login`, `logout`, `verify`, `generateRecoveryKey`  
- `passwordAPI`: `getAll`, `getById`, `create`, `update`, `remove`

All calls are centralized behind Axios with a shared `baseURL`, ready to be wired into the login screen and dashboard.

### Next Frontend Milestones

- Implement `AuthContext` to hold authentication state (session token, logged-in status)  
- Build production login screen from Figma using existing `Input` and `Button` components  
- Add React Router for:
  - `/` – Login  
  - `/dashboard` – Password list  
  - `/add` – Add password  
  - `/password/:id` – Password details  
- Connect dashboard to real data via `passwordAPI`  
- Add protected routes and session verification

---

## UI Design

All screens are designed in Figma with a dark theme, Poppins typography, and a compact layout suitable for laptops and smaller displays.

### Screenshots

#### Complete Interface Overview
!Complete User Interface

#### Login Screen
!Login Screen

#### Dashboard (Password List)
!Dashboard

#### Add Password Form
!Add Password

#### Password Details View
!Password Details

---

## Problem & Positioning

Modern password managers increasingly rely on:

- Cloud sync to vendor-controlled infrastructure  
- "AI features" that require analyzing user data  
- Broad telemetry and opaque privacy models

For students and early-career professionals with 15–30+ accounts, this leads to a trade-off between:

- Weak, reused passwords  
- Constant resets and productivity loss  
- Anxiety around both personal security and vendor trust

**BinO-Vault's core thesis:** password management does not need cloud analytics or AI. It needs strong encryption, thoughtful UX, and a refusal to collect unnecessary data in the first place.

---

## Solution Overview

### Security Model

- Local-only, encrypted SQLite database  
- Master password never leaves the device; only Argon2id hashes are stored  
- No cloud sync by design; backup and migration controlled directly by the user  
- Open source implementation for inspection and audit

### Neuroscience-Informed UX

Instead of algorithmic personalization, BinO-Vault uses design patterns grounded in cognitive psychology:

- Color-coded risk levels (Calm / Alert / Critical) for fast visual parsing  
- Real-time password strength feedback  
- Minimal, focused screens to reduce cognitive load  
- Encouraging copy and calm visual language to support sustained good habits

---

## Roadmap

**Phase 1 – Design (Complete)**  
- Competitive analysis and positioning  
- UX flows, screen designs, design system  
- Neuroscience principles mapped into UI patterns

**Phase 2 – Backend (Complete)**  
- Flask API, database, encryption, and auth  
- Password generator and strength evaluation  
- Session handling and recovery flow  
- Test harness for endpoints

**Phase 3 – Frontend (In Progress)**  
- React + Tailwind setup and design system integration  
- Reusable components (buttons, inputs, cards)  
- API client layer to backend  
- Layout and routing of core screens

**Phase 4 – Integration & Testing (Planned)**  
- Full wiring of frontend to backend  
- Security and UX testing  
- Documentation and packaging  
- Local distribution story (e.g., packaged app)  

---

## About the Author

BinO-Vault is built by Alexander Samuel R, a first-year BE (Electrical & Electronics Engineering) student, with interests in:

- Security-conscious product design  
- Neuroscience-informed UX  
- Python/Flask backends and modern React frontends

The project is intended as a serious exploration of:

- Privacy-first alternatives to cloud-centric tooling  
- How design, not AI, can drive better user security behavior  
- End-to-end ownership of a full-stack product: from concept to implementation

---

## Links

- **GitHub:** https://github.com/alexander-devstack  
- **LinkedIn:** https://www.linkedin.com/in/alexanersamuel2006  
- **Medium:** https://medium.com/@alexandersamuel2310  

---

## License

MIT License.  
Use, learn from, and extend this project, but please retain attribution where appropriate.

---

## Updates Log

**January 17, 2026** – Phase 3 (Day 5): Frontend component library complete. Implemented reusable Button, Input (with password toggle using React hooks), and Card components. Created centralized design system and API service layer. Tailwind CSS configured with custom colors matching Figma design.

**January 16, 2026** – Phase 2 (Day 3): Backend API fully implemented with Flask. 10 REST endpoints, AES-256-GCM encryption, Argon2id hashing, password generator, and testing interface complete. 930+ lines of production code.

**January 15, 2026** – Phase 1: UI/UX design finished, design system documented, competitive analysis complete.


