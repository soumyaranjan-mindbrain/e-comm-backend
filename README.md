# BM2MALL Backend Setup Guide (Beginner Friendly)

Follow these simple steps to get the project running on your system.

---

### Step 1: Install Required Tools
If you don't have these already, download and install them:
1. **Node.js**: [Download here](https://nodejs.org/) (Required to run the code)
2. **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop) (Required for the Database)
   - *Note: After installing, make sure to **Open** Docker Desktop and wait until the status in the bottom-left corner turns green ("Engine Running").*

---

### Step 2: Install Project Dependencies
Open your terminal (PowerShell or Command Prompt) inside the `scripts` folder and run:
```bash
npm install
```

---

### Step 3: Setup Configuration (.env)
Create a new file named `.env` inside the `scripts` folder and paste the following content:
```env
PORT=3000
DATABASE_URL=mysql://root:secret@localhost:33061/ecommerce_app
DB_PASSWORD=secret
DB_NAME=ecommerce_app
JWT_ACCESS_SECRET=your-random-secret-key
JWT_REFRESH_SECRET=your-random-refresh-key
CONSOLE_LOG_EMAILS=true
```

---

### Step 4: Start the Database (Docker)
Instead of installing MySQL manually, we use Docker. Simply run this command:
```bash
docker-compose up -d
```
**What this does:** It automatically creates and starts a pre-configured MySQL database server for you.

---

### Step 5: Start the Application
Wait about 10 seconds for the database to finish setting up (the first run takes a moment to load the data). Then, run these two commands to start the backend:
```bash
npx prisma generate
npm run dev
```

**Setup Complete!** Your API is now live at: `http://localhost:3000`

