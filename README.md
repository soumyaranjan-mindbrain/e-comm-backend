# BM2MALL Backend - Comprehensive Setup Guide

This guide will help you set up the BM2MALL E-commerce backend from scratch on a new device.

---

## 📋 Prerequisites

Before you start, make sure you have the following installed on your system:

1.  **Node.js (v18 or higher)**: [Download here](https://nodejs.org/)
2.  **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop)
    *   *Important: After installing, open Docker Desktop and wait for it to start. The icon in the taskbar should show a green status.*
3.  **Git**: [Download here](https://git-scm.com/) (Required for cloning the code)

---

## 🚀 Step-by-Step Setup

### 1. Clone the Project
Open your terminal (PowerShell, Command Prompt, or Terminal) and run:
```bash
git clone <repository-url>
cd scripts
```

### 2. Configure Environment Variables
Copy the example environment file to create your own configuration:

**Windows (PowerShell):**
```powershell
copy env.example .env
```

**Mac/Linux:**
```bash
cp env.example .env
```
*Note: The `.env` file contains keys for JWT and Database connection. The default values in `env.example` are pre-configured for local Docker setup.*

### 3. Start the Database (Docker)
Ensure Docker Desktop is running, then run:
```bash
docker-compose up -d
```
**Why this step?** This command automatically:
- Downloads and starts a MySQL server.
- Sets up the database named `ecommerce_app`.
- **Automatically imports all tables and product data** using the provided `init.sql` script.
- Starts a `phpMyAdmin` panel for database viewing.

*Wait about 10-15 seconds after this command for the database to fully initialize.*

### 4. Install Dependencies
Install all the necessary libraries required by the code:
```bash
npm install
```

### 5. Generate Database Client & Start Application
Run these commands to sync the code with the database and start the server:
```bash
npx prisma generate
npm run dev
```

---

## ✅ Verification

Once the application starts, you can verify everything is working:

1.  **API Health Check**: Open `http://localhost:3000/health` in your browser. It should show `{"ok":true}`.
2.  **API Documentation**: Browse `http://localhost:3000/api-docs` to see all available endpoints and interactive documentation.
3.  **Database Console**: Browse `http://localhost:8080` to log into phpMyAdmin and see the database tables. (User: `root`, Password: `secret`).

---

## 🛠️ Troubleshooting

-   **Port 3000 is already in use**: Change the `PORT` value in your `.env` file.
-   **Docker command not found**: Ensure Docker Desktop is installed and added to your system PATH.
-   **Database connection error**: Ensure `docker-compose up -d` was successful and the container is running by checking `docker ps`.
-   **Prisma Client Error**: Run `npx prisma generate` again to rebuild the client.

---

**Happy Coding!** 🚀
