# BM2MALL Backend Setup Guide

Follow these simple steps to run the project on your system.

### 1. Prerequisites
Install these if you don't have them:
- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

### 2. Setup Project
Open your terminal in the `scripts` folder and run:
```bash
npm install
```

---

### 3. Environment File
Create a file named `.env` inside the `scripts` folder and paste this:
```env
PORT=3000
DATABASE_URL=mysql://root:secret@localhost:33061/ecommerce_app
DB_PASSWORD=secret
DB_NAME=ecommerce_app
JWT_ACCESS_SECRET=any-random-secret-key
JWT_REFRESH_SECRET=any-random-refresh-key
CONSOLE_LOG_EMAILS=true
```

---

### 4. Start Database
Run this command to start the database:
```bash
docker-compose up -d
```
*Wait 10 seconds for it to start.*

---

### 5. Import Database Data
Run this to load the latest tables and products:
**Windows (PowerShell):**
```powershell
get-content "../latest_ecommerce_shop.sql" | docker exec -i scripts-db-1 mysql -u root -p"secret" ecommerce_app
```

---

### 6. Run the App
Finally, run these two commands:
```bash
npx prisma generate
npm run dev
```

**Project is now live at:** `http://localhost:3000`
