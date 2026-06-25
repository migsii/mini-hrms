# Mini HRMS

A web-based **Human Resource Management System (HRMS)** developed using **React (Vite)** for the frontend and **Laravel** for the backend. The system provides employee management, attendance tracking, payroll management, and dashboard analytics.

---

# Tech Stack

- **Frontend:** React + Vite
- **Backend:** Laravel
- **Database:** PostgreSQL
- **Charts:** Recharts
- **Styling:** CSS Modules

---

# Requirements

Before running the project, make sure the following are installed:

- PHP 8.x or later
- Composer
- Node.js 18+
- npm
- PostgreSQL

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/<your-username>/mini-hrms.git
cd mini-hrms
```

---

## 2. Install root dependencies

```bash
npm install
```

---

## 3. Install frontend and backend dependencies

```bash
npm run install:all
```

This command will:

- Install React dependencies
- Install Laravel Composer dependencies
- Create `backend/.env` (if it doesn't exist)
- Generate the Laravel application key

---

## 4. Configure the database

Open:

```
backend/.env
```

Update the database configuration to match your PostgreSQL installation.

Example:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mini_hrms
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

---

## 5. Import the database

Import the provided SQL file into PostgreSQL.

```
database/mini_hrms.sql
```

---

# Running the Project

Start both the frontend and backend servers.

```bash
npm run dev
```

The application will be available at:

Frontend

```
http://localhost:5173
```

Backend API

```
http://127.0.0.1:8000
```

---

# Available Scripts

| Command                    | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `npm install`              | Installs the root development dependencies.                            |
| `npm run install:frontend` | Installs React frontend dependencies.                                  |
| `npm run install:backend`  | Installs Laravel Composer dependencies.                                |
| `npm run setup:backend`    | Creates `.env` (if missing) and generates the Laravel application key. |
| `npm run install:all`      | Installs frontend/backend dependencies and sets up Laravel.            |
| `npm run dev:frontend`     | Starts only the React frontend development server.                     |
| `npm run dev:backend`      | Starts only the Laravel backend server.                                |
| `npm run dev`              | Starts both frontend and backend servers concurrently.                 |

---

# Project Structure

```
mini-hrms/
│
├── backend/                 # Laravel Backend
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── .env.example
│   └── artisan
│
├── frontend/                # React + Vite Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── database/
│   └── mini_hrms.sql
│
├── package.json
├── package-lock.json
└── README.md
```

---

# Notes

- The repository **does not include** the `backend/.env` file.
- During installation, `backend/.env` is automatically created from `backend/.env.example`.
- Remember to update the database credentials inside `backend/.env` before running the application.
- If using Windows, the provided setup scripts work out of the box.
- For macOS/Linux, manually copy `.env.example` to `.env` before generating the application key if needed.

---
