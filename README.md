# Mini HRMS

## Requirements

- PHP 8.x
- Composer
- Node.js 18+
- MySQL

## Installation

Clone the repository.

```bash
git clone <repository-url>
cd mini-hrms
```

Install dependencies.

```bash
npm install
npm run install:all
```

Configure the backend.

Open:

```
backend/.env
```

Update:

```
DB_DATABASE=mini_hrms
DB_USERNAME=root
DB_PASSWORD=
```

Import the provided SQL file into MySQL.

Run the application.

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://127.0.0.1:8000
```
