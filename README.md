# 🚀 BM2MALL Backend - Complete Setup Guide

Follow this guide for a 100% error-free setup on a new device.

---

## 📋 Prerequisites

Before you start, you MUST have these installed:

1.  **Node.js (v20+)**: [Download here](https://nodejs.org/)
2.  **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop)
    -   *Crucial: Open Docker Desktop and wait until you see the green **"Engine Running"** status.*
3.  **Git**: [Download here](https://git-scm.com/)

---

## 🛠️ Step-by-Step Installation

### Step 1: Clone the Project
Open your terminal (PowerShell or Command Prompt) and run:
```bash
git clone <repository-url>
cd scripts
```

### Step 2: Create Environment File (.env)
This is the most important step. Run this command:
```powershell
copy env.example .env
```
*Note: If you are on Mac/Linux, use `cp env.example .env`.*

### Step 3: Start the Database (Docker)
Ensure Docker Desktop is open and green. Then run:
```bash
docker-compose up -d db
```
**Why only `db`?** This command starts only the MySQL database server. It will automatically:
- Create the `ecommerce_app` database.
- Import all tables and initial product data from `init.sql`.

*Wait 15 seconds for the database to finish loading.*

### Step 4: Install Packages
Run this to install all the libraries (Prisma, Express, JWT, etc.):
```bash
npm install
```

### Step 5: Sync Database & Start App
Run these two commands to finish the setup:
```bash
npx prisma generate
npm run dev
```

**🎉 SUCCESS!** Your backend is now running at `http://localhost:3000`

---

## 🖥️ How to verify it's working?

-   **Test API**: Open `http://localhost:3000/health` (Should say `{"ok":true}`)
-   **Documentation**: Open `http://localhost:3000/api-docs` (Interactive Swagger Docs)
-   **Database View**: Open `http://localhost:8080` (phpMyAdmin)
    -   Host: `db`
    -   Username: `root`
    -   Password: `secret`

---

## ⚠️ Common Errors & Fixes

| Error | Solution |
| :--- | :--- |
| **"docker-compose" not found** | Install Docker Desktop and Restart your Terminal (VS Code). |
| **"prisma" command fails** | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell then try again. |
| **Port 33061 already in use** | Your previous Docker container is still running. Run `docker-compose down` and then try again. |
| **Database connection error** | Check if Docker container is green. Run `docker ps` to see if `scripts-db-1` is running. |

---

**Developed for the BM2MALL E-commerce system.**
