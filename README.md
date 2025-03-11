# Employee Management System

A full-stack employee management web application built with a Django REST Framework (DRF) backend and a React (Vite) frontend.

## Table of Contents
- [Project Structure](#project-structure)
- [Backend Setup (Django DRF)](#backend-setup-django-drf)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Frontend Setup (React Vite)](#frontend-setup-react-vite)
  - [Prerequisites](#prerequisites-1)
  - [Setup Instructions](#setup-instructions-1)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [License](#license)

## Project Structure
```
.
├── backend/          # Django DRF Backend
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
└── frontend/         # React (Vite) Frontend
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Backend Setup (Django DRF)

### Prerequisites
- Python (>= 3.10 recommended)
- PostgreSQL

### Setup Instructions

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the `.env` file:
Create a `.env` file in the `backend` folder with the following variables:

```
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
SECRET_KEY=your_secret_key
DEBUG=True
```

5. Apply database migrations:
```bash
python manage.py migrate
```

6. Run the development server:
```bash
python manage.py runserver
```

## Frontend Setup (React Vite)

### Prerequisites
- Node.js (>= 18.x recommended)

### Setup Instructions

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
Ensure the backend `.env` file contains these variables:

```
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
SECRET_KEY=your_secret_key
DEBUG=True
```


## Running the Project

1. Ensure PostgreSQL is running.
2. Start the backend Django server:
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

3. Start the frontend React server:
```bash
cd frontend
npm run dev
```

## API Documentation
API endpoints and details are available at:
```
https://documenter.getpostman.com/view/31743247/2sAYk7SPb6
```

## License
This project is licensed under the [MIT License](LICENSE).

