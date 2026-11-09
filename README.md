# Fingerprint Authentication System

A modern fingerprint authentication system built with React, Node.js, Express, and PostgreSQL.

## Features

- User registration and login
- Fingerprint authentication using WebAuthn
- Secure session management
- PostgreSQL database integration
- REST API
- Responsive user interface

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- SimpleWebAuthn Browser

### Backend
- Node.js
- Express.js
- PostgreSQL
- WebAuthn
- Express Session

## Project Structure

```text
fingerprint-auth-system/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yaschilal24/Fingerprint-auth-system.git
cd Fingerprint-auth-system
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Configure your backend `.env` file.

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

Configure your frontend `.env` file.

## Run the Application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment Variables

Configure your environment variables using the appropriate `.env` files. Never commit passwords, database credentials, or secret keys.

## Author

**Yaschilal Adane**

Software Engineering Student  
Injibara University, Ethiopia

## License

This project is for educational and learning purposes.
