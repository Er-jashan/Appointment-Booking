# Medicura Appointment Booking System

## Overview
Medicura is a full-stack web application for booking medical appointments. It provides separate interfaces for patients, doctors, and administrators, allowing users to book appointments, manage profiles, and handle doctor onboarding. The project is organized into three main folders: `admin`, `backend`, and `frontend`.

## Project Purpose
Medicura aims to streamline the process of scheduling and managing medical appointments for clinics, hospitals, and individual practitioners. The platform provides an easy-to-use interface for patients to find and book appointments with doctors based on specialty, location, and availability. Doctors can manage their profiles, view appointments, and update their schedules, while administrators oversee the entire system, onboard new doctors, and monitor appointment statistics. The project is designed to reduce manual effort, minimize scheduling conflicts, and improve the overall patient experience by offering a modern, digital solution for healthcare appointment management.

---
## Project Structure

- **admin/**: Admin dashboard for managing doctors, appointments, and patients.
- **backend/**: Node.js/Express REST API server, MongoDB database, authentication, file uploads, and business logic.
- **frontend/**: Patient-facing React app for browsing doctors, booking appointments, and managing user profiles.

---

## Features

### Admin Panel (`admin/`)
- Add, edit, and delete doctors
- View all appointments and patients
- Dashboard with statistics
- Authentication for admin users

### Backend API (`backend/`)
- RESTful endpoints for doctors, appointments, users, and admin actions
- MongoDB for data storage
- Cloudinary integration for image uploads
- JWT-based authentication
- Multer for file uploads
- Validation and error handling

### Patient Frontend (`frontend/`)
- Browse doctors by specialty
- Book appointments
- View and manage profile and appointments
- Responsive UI with Tailwind CSS

---

## Technologies Used
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, Cloudinary, Multer, JWT
- **Admin Panel:** React, Vite, Tailwind CSS

---

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB instance
- Cloudinary account (for image uploads)


### 1. Backend Setup
```sh
cd backend
npm install
# Create a .env file with MongoDB and Cloudinary credentials
npm start
```

### 2. Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

### 3. Admin Panel Setup
```sh
cd admin
npm install
npm run dev
```

---

## Environment Variables
Create a `.env` file in the `backend/` and `admin/` that will hold your secret keys


## API Endpoints (Backend)
- `/api/admin/add-doctor` (POST): Add a new doctor (admin only)
- `/api/doctor/...` : Doctor-related endpoints
- `/api/user/...` : Patient/user-related endpoints

---

## Folder Details

### admin/
- `src/pages/Admin/`: Admin dashboard pages
- `src/components/`: Shared UI components
- `src/context/`: React context for state management

### backend/
- `controllers/`: Route handlers for admin, doctor, user
- `models/`: Mongoose schemas
- `routes/`: Express routers
- `middlewares/`: Auth, file upload, validation
- `config/`: Database and Cloudinary config

### frontend/
- `src/pages/`: Patient-facing pages
- `src/components/`: Shared UI components
- `src/context/`: React context for state management

---

## License
This is project is for demonstration of skills only.

---

## Author
Developed by `harmanbajwa2954` and `Er-jashan`.
