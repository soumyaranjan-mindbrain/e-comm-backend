# � BM2MALL Backend - Docker Setup Guide

Welcome to the **BM2MALL** backend project! This guide is designed for absolute beginners. Follow these steps to get the server running on your machine using Docker.

---

## �️ Step 1: Prerequisites
Before starting, ensure you have these two tools installed and running:

1.  **Docker Desktop**: [Download & Install](https://www.docker.com/products/docker-desktop)
    -   *Crucial: Open Docker Desktop. Wait until the whale icon in your taskbar stays still and the status is green (**Engine Running**).*
2.  **Visual Studio Code (VS Code)**: [Download & Install](https://code.visualstudio.com/)

---

## � Step 2: Quick Start (The "Magic" Command)

Open your terminal in the `scripts` folder and run these **3 commands**:

### 1. Create your configuration file
This file stores the database passwords and settings.
```powershell
# Windows (PowerShell)
copy env.example .env

# Mac / Linux / Git Bash
cp env.example .env
```

### 2. Start Everything
This command downloads the database, builds the app, and starts them together.
```bash
docker-compose up -d --build
```

### 3. Generate Database Client (Only if needed)
Wait about 30 seconds for the containers to start, then run this to make sure the code can "talk" to the database:
```bash
docker exec scripts-app-1 npm run prisma:generate
```
*(Note: The system usually does this automatically during build, but it's good to know!)*

---

## 🖥️ How to verify it's working?

Once everything is "Up", you can check these links in your browser:

| Service | Address | What is it? |
| :--- | :--- | :--- |
| **Backend API** | [http://localhost:3000/health](http://localhost:3000/health) | Should show `{"ok":true}` |
| **API Docs** | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) | Interactive Swagger documentation |
| **Database View** | [http://localhost:8080](http://localhost:8080) | phpMyAdmin (Manage your database visually) |

**Database Login (for phpMyAdmin):**
- **Server:** `db`
- **Username:** `root`
- **Password:** `secret`

---

## 📖 Command Breakdown (What did I just do?)

If you are curious about what those commands actually did:

1.  `copy env.example .env`: Creates a local copy of settings. Using `.env` is a standard way to hide secrets.
2.  `docker-compose up`: Starts multiple "containers" (mini virtual computers) at once.
3.  `-d` (Detached): Runs the containers in the background so you can keep using your terminal.
4.  `--build`: Re-builds the application code. Use this whenever you change the code in `src/`.
5.  `docker-compose down`: Stops and removes all containers. Use this when you are done working.

---

## ⚠️ Troubleshooting

| Problem | Solution |
| :--- | :--- |
| **"docker-compose" not found** | Docker Desktop is not installed or not in your "PATH". Try restarting VS Code. |
| **Port 33061 or 3000 in use** | Something else is running on those ports. Run `docker-compose down` to clear old containers. |
| **Database connection error** | Docker Desktop might not be running. Check the whale icon! |
| **Changes not showing?** | Run `docker-compose up -d --build` to force a refresh of the code. |

---

**Developed for the BM2MALL E-commerce system.**
