# BinO-Vault 🔐

> A neuroscience-inspired password manager with local-only storage. No cloud. No AI. Just security.

![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Day](https://img.shields.io/badge/Day-6%2F16-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🧠 Philosophy

**"Your passwords don't need AI—they need proper encryption and a calm interface."**

BinO-Vault is designed around neuroscience principles:
- **Calm colors** reduce anxiety around security
- **Clear feedback** builds trust through transparency
- **Local-first** architecture eliminates cloud breach risks
- **Accessible design** works for all age groups

---

## 🎯 Current Progress (Day 6 of 16)

### ✅ Completed
- **Days 1-2:** Complete Figma UI/UX design (4 screens, design system)
- **Day 3:** Flask backend with Argon2id authentication and SQLite database
- **Day 4:** Password encryption strategy and backend architecture
- **Day 5:** Frontend setup with Vite + React, routing configured
- **Day 6:** 🆕 **Complete authentication system with working login flow!**
  - Built Login page with inline styles for pixel-perfect control
  - Implemented React Router with protected routes
  - Created AuthContext for global authentication state
  - Integrated backend login API with session management
  - Successfully authenticated with Argon2-hashed master password
  - Built Dashboard with empty state and logout functionality

### 🚧 In Progress (Day 7-16)
- **Day 7:** Testing, edge case handling, API documentation
- **Days 8-9:** Dashboard UI and password CRUD operations
- **Day 10:** Password generator with strength indicator
- **Days 11-13:** Password list, search/filter, edit/delete
- **Days 14-16:** Security hardening, testing, deployment prep

---

## 🔐 Security Architecture

### Current Implementation
- **Master Password Hashing:** Argon2id (memory-hard, GPU-resistant)
  - Parameters: `time_cost=2`, `memory_cost=65536` (64 MB), `parallelism=4`
  - 256-bit hash output, 128-bit salt
- **Session Management:** Cryptographically secure tokens (`secrets.token_urlsafe(32)`)
- **Database:** SQLite with proper table design (`users`, `sessions`, `password_entries`)
- **Frontend Protection:** `ProtectedRoute` component guards dashboard access

### Planned Features
- **Password Encryption:** AES-256-GCM for stored credentials
- **Recovery Key System:** Human-readable 20-character backup (format: `XXXX-XXXX-XXXX-XXXX-XXXX`)
- **Session Expiry:** 24-hour automatic timeout
- **Rate Limiting:** Exponential backoff on failed login attempts

---

## 🎨 Design System

### Color Palette
Primary (Safety):   #00FFA3  /* Mint green - calm, secure feeling */
Background:         #1A1A1A  /* Dark gray - reduces eye strain */
Text:               #FFFFFF  /* White - high contrast */
Secondary Text:     #D1D5DB  /* Light gray - supporting info */
Error:              #EF4444  /* Red - clear error indication */


### UX Principles
1. **Always-visible actions:** No hover-only buttons (accessibility for older users)
2. **Large click targets:** Minimum 48px height for buttons
3. **Explicit feedback:** "Login Successful! Your passwords are safe."
4. **Calm visual hierarchy:** Plenty of negative space, soft rounded corners

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router v6** for navigation
- **Context API** for state management
- **Inline styles** for design precision (no Tailwind conflicts)

### Backend
- **Flask** (Python) with blueprint architecture
- **Argon2** for password hashing
- **SQLite** for local database
- **CORS** enabled for frontend-backend communication

### Development Tools
- **Git** for version control
- **VS Code** as IDE
- **PyCharm** for backend development
- **Chrome DevTools** for debugging

---

## 📂 Project Structure

BinO-Vault/
├── backend/
│   ├── api/
│   │   ├── auth_routes.py          # ✅ Login/register endpoints (Day 6)
│   │   └── password_routes.py      # 🚧 CRUD endpoints (Day 8-9)
│   ├── auth/
│   │   └── password_hasher.py      # ✅ Argon2 hashing class
│   ├── crypto/
│   │   └── encryption.py           # 🚧 AES-256-GCM (Day 8)
│   ├── app.py                      # ✅ Flask initialization
│   ├── database.py                 # ✅ SQLAlchemy models
│   └── passwords.db                # ✅ Active database
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx           # ✅ Complete login page (Day 6)
│   │   │   ├── Dashboard.jsx       # ✅ Basic dashboard (Day 6)
│   │   │   └── ProtectedRoute.jsx  # ✅ Auth guard (Day 6)
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # ✅ Global auth state (Day 6)
│   │   ├── App.jsx                 # ✅ Root with routing
│   │   └── main.jsx                # ✅ Entry point
│   └── package.json
│
├── designs/
│   ├── Login-screen-2x.jpg         # ✅ Figma export
│   ├── Dashboard-2x.jpg
│   ├── Add-Password-2x.jpg
│   └── Password-Details-2x.jpg
│
└── README.md

---

## 🚀 Getting Started

### Prerequisites
bash
# Python 3.8+
python --version

# Node.js 16+
node --version

# Git
git --version


### Installation

1. **Clone the repository**
`bash
git clone https://github.com/alexander-devstack/BinO-Vault.git
cd BinO-Vault


2. **Backend Setup**
bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scriptsctivate
pip install -r requirements.txt


3. **Create Database & User**
bash
# Create tables and test user
python -c "import sqlite3; from argon2 import PasswordHasher; from datetime import datetime; conn = sqlite3.connect('passwords.db'); conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, master_password_hash TEXT NOT NULL, created_at TEXT NOT NULL)'); conn.execute('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, session_token TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)'); ph = PasswordHasher(); conn.execute('INSERT INTO users (master_password_hash, created_at) VALUES (?, ?)', (ph.hash('YourMasterPassword123'), datetime.now().isoformat())); conn.commit(); conn.close(); print('Database setup complete!')"


4. **Run Backend**
bash
python app.py
# Server runs on http://localhost:5000


5. **Frontend Setup** (new terminal)
bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173


6. **Login**
- Open `http://localhost:5173`
- Enter master password: `YourMasterPassword123`
- Click "Unlock Vault"

---

## 📊 Development Timeline

### Week 1 (Days 1-7): Foundation ✅
| Day | Focus | Status |
|-----|-------|--------|
| 1-2 | UI/UX Design in Figma | ✅ Complete |
| 3 | Backend Core (Flask + Argon2) | ✅ Complete |
| 4 | Backend Password Management | ✅ Complete |
| 5 | Frontend Setup (Vite + React) | ✅ Complete |
| 6 | **Authentication Flow** | ✅ **Complete!** |
| 7 | Testing & Documentation | 🚧 Next Up |

### Week 2 (Days 8-14): Features
| Day | Focus | Status |
|-----|-------|--------|
| 8 | Dashboard & Empty States | 🔜 Upcoming |
| 9 | Add Password Modal | 🔜 Upcoming |
| 10 | Password Generator | 🔜 Upcoming |
| 11 | Password List View | 🔜 Upcoming |
| 12 | Edit & Delete | 🔜 Upcoming |
| 13 | Search & Filter | 🔜 Upcoming |
| 14 | Polish & UX Refinements | 🔜 Upcoming |

### Week 3 (Days 15-16): Launch
| Day | Focus | Status |
|-----|-------|--------|
| 15 | Security Hardening | 🔜 Upcoming |
| 16 | Final Testing & Deployment | 🔜 Upcoming |

---

## 🔒 Why Local-First?

### Cloud Password Managers Have Risks
- **Data breaches:** LastPass (2022), OneLogin (2017)
- **Subscription fees:** $3-10/month, forever
- **Vendor lock-in:** Hard to export/migrate
- **Privacy concerns:** Your data on their servers

### BinO-Vault's Approach
- ✅ **Zero server cost:** Everything runs locally
- ✅ **Zero attack surface:** No cloud means no cloud breaches
- ✅ **Full control:** You own the database file
- ✅ **No tracking:** No telemetry, no ads, no data collection

---

## 🎓 What I'm Learning

### Day 6 Accomplishments
- **React Context API:** Managing global authentication state
- **Protected Routes:** Implementing route guards with React Router
- **Session Management:** Storing and validating JWT-style tokens
- **Inline CSS-in-JS:** Pixel-perfect control without CSS framework conflicts
- **API Integration:** Connecting React frontend to Flask backend
- **Error Handling:** Displaying user-friendly error messages
- **Git Workflow:** Resolving merge conflicts, pull before push

### Skills Developed (Days 1-6)
- Full-stack architecture planning
- Security-first design (Argon2, secure sessions)
- RESTful API design with Flask blueprints
- Modern React patterns (hooks, context, functional components)
- Database design and normalization
- Version control best practices (Git + GitHub)

---

## 🤝 Contributing

This is a personal learning project, but feedback is welcome! Feel free to:
- Open an issue for bugs or suggestions
- Star ⭐ the repo if you find it interesting
- Fork and experiment with your own features

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Alexander**
- GitHub: [@alexander-devstack](https://github.com/alexander-devstack)
- Learning: Full-stack development, security, UX design
- Currently: BE EEE student, building portfolio projects

---

## 🎯 Next Session Goals (Day 7)

1. Write unit tests for authentication flow
2. Add error handling for edge cases (network failures, expired sessions)
3. Document all API endpoints with request/response examples
4. Test login flow on different browsers
5. Create Day 7 continuation prompt for seamless development

---

**Last Updated:** January 18, 2026 - Day 6 Complete! 🎉

---

*"Security doesn't have to be scary. It should feel calm, empowering, and completely in your control."*
