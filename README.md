# 🚀 BM2MALL Backend - Ultimate Docker Guide

Welcome to the **BM2MALL** backend repository. This project is built for high-performance e-commerce, and this guide will help you set it up on any new machine in less than 5 minutes.

---

## 🛠️ Step 1: The Essentials
Before you run any commands, these two must be installed:

1.  **Docker Desktop** (REQUIRED): [Download here](https://www.docker.com/products/docker-desktop)
    *   *Pro Tip: Ensure the "Whale" icon in your taskbar is green before proceeding.*
2.  **VS Code**: [Download here](https://code.visualstudio.com/)

---

## ⚡ Step 2: One-Command Setup
Open your terminal inside the `scripts/` folder and follow these exact steps:

### 1️⃣ Prepare Configuration
We use a `.env` file to store database credentials safely.
```powershell
# Windows Users:
copy env.example .env

# Mac/Linux/Git Bash Users:
cp env.example .env
```

### 2️⃣ Launch the App
This command builds everything (Database, API, and Management Tools) and starts them in the background.
```bash
docker-compose up -d --build
```

### 3️⃣ Sync Database (Run this after 20 seconds)
Wait for the database to finish "booting up", then run:
```bash
docker exec scripts-app-1 npm run prisma:generate
```

---

## 🚦 Step 3: Flow Verification
How do you know if it's working? Check these **3 Vital Links**:

| Service | Local Address | Verification Status |
| :--- | :--- | :--- |
| **Backend API** | [http://localhost:3000/health](http://localhost:3000/health) | Should show `{"ok":true, "environment":"development"}` |
| **Interactive Docs** | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) | Complete Swagger UI for testing API calls |
| **Database Manager**| [http://localhost:8080](http://localhost:8080) | Login to **phpMyAdmin** to see live data |

**🔑 phpMyAdmin Credentials:**
- **Server:** `db`
- **Username:** `root`
- **Password:** `secret`

---

## 🧪 Developer Testing Mode
We have built-in features to make testing easier for developers:

*   **Hardcoded OTP Bypass:** In development mode, you can use OTP **`111111`** for any mobile number to login instantly without waiting for an SMS.
*   **Seeded Data:** The database comes pre-loaded with **15+ Products** and categories like "Fashion", "Trending", and "Electronics".

---

## ⚠️ Advanced Troubleshooting (New Device Gotchas)

| Error Message | Why it happens? | How to fix? |
| :--- | :--- | :--- |
| `Docker daemon is not running` | Docker is installed but not opened. | Launch Docker Desktop and wait for the green status. |
| `Port 3000 is already in use` | Another server (like React) is running. | Stop other projects or run `docker-compose down`. |
| `Can't connect to MySQL` | MySQL takes ~15s to import data (`init.sql`). | Just wait 15 seconds and try again. |
| `PrismaClient failed` | Client wasn't generated during build. | Run `docker exec scripts-app-1 npm run prisma:generate`. |
| `Permission Denied (PowerShell)` | Windows security blocks scripts. | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`. |

---

## 🛠️ Maintenance Commands
*   **Stop Project:** `docker-compose down` (Saves resources when not working).
*   **Fresh Start:** `docker-compose up -d --build` (Use this if you change any code).
*   **Check Logs:** `docker logs -f scripts-app-1` (See errors in real-time).

---

**Built with ❤️ for the BM2MALL E-commerce Ecosystem.**
