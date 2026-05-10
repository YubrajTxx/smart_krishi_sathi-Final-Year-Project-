# Smart Krishi - Digital Farming Assistant

Smart Krishi is a comprehensive full-stack web application designed to empower farmers with modern technology. It provides a suite of tools including AI-powered crop prediction, weather forecasting, educational resources, and activity tracking to improve agricultural productivity and sustainability.

---

## 🏗 Project Architecture

The project follows a decoupled architecture with a clear separation between the frontend and backend.

### 1. Frontend (React)
- **Framework:** React.js (Vite)
- **State Management:** React Context API (Auth, Language, Location, Notifications)
- **Routing:** React Router DOM
- **Styling:** Custom CSS with a focus on modern, responsive design.
- **i18n:** Bilingual support (English and Nepali).
- **Key Libraries:** 
    - `leaflet`: For map integration.
    - `framer-motion`: For smooth animations.
    - `lucide-react`: For iconography.

### 2. Backend (Django)
- **Framework:** Django (Python)
- **API:** Django REST Framework (DRF)
- **Database:** SQLite (Development)
- **AI/ML:** Scikit-learn based prediction models.
- **Authentication:** Token-based authentication for secure access.

---

## 📂 Project Structure

### Backend (`/backend`)
- `apps/`: Contains the core logic divided into modular Django apps.
    - `accounts/`: User registration, login, and profile management.
    - `activities/`: Farm activity logging and tracking.
    - `crops/`: Information and management of various crop types.
    - `learn/`: Digital library and educational content for farmers.
    - `mapdata/`: GIS and location-based data services.
    - `notes/`: Personal notes management for farmers.
    - `notifications/`: Alert system for weather, tasks, and system updates.
    - `recommendations/`: Logic for AI-driven agricultural advice.
    - `support/`: Customer support and feedback mechanism.
    - `weather/`: Integration with weather APIs.
- `ai/`: Contains pre-trained Machine Learning models (`model.pkl`) and preprocessing scripts.
- `config/`: Django project configuration and settings.
- `requirements.txt`: Python dependencies.

### Frontend (`/frontend`)
- `src/`: Main source directory.
    - `api/`: Axios instances and API service functions.
    - `auth/`: Login and Register components.
    - `components/`: Reusable UI elements (Navbar, Footer, SearchOverlay, etc.).
    - `context/`: Context Providers for global state.
    - `i18n/`: Internationalization files and logic.
    - `pages/`: Individual view components (Home, Predict, Weather, Library, etc.).
    - `styles/`: Global CSS variables and base styles.
    - `utils/`: Helper functions.
- `public/`: Static assets.

---

## 🚀 Key Features

### 1. AI-Powered Crop Prediction
Farmers can input soil and environmental parameters to receive data-driven crop recommendations. This uses a trained Machine Learning model to analyze factors like NPK levels, temperature, humidity, and rainfall.

### 2. Activity Tracker
A dedicated module for farmers to log daily activities, plan future tasks, and monitor the progress of their farming cycle.

### 3. Agricultural Library (Learn)
A curated collection of articles, videos, and guides to help farmers adopt best practices and modern techniques.

### 4. Live Weather Updates
Real-time weather data and forecasts tailored to the farmer's location, helping them make informed decisions about irrigation and harvesting.

### 5. Interactive Map
Visualizes farming data and provides location-specific insights using Leaflet-based map integration.

### 6. Bilingual Support
The entire platform is accessible in both **English** and **Nepali**, ensuring accessibility for local farmers.

---

## 🛠 Setup and Installation

### Backend Setup
1. Navigate to `/backend`.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`.
5. Run migrations: `python manage.py migrate`.
6. Start the server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Start the development server: `npm run dev`.

---

## 🛡 Security and Roles
- **Public Access:** Home, Weather, and Library are accessible to all users.
- **Protected Routes:** Predict, Activity Tracking, and Profiles require user authentication.
- **Admin Role:** A specialized dashboard for managing users and platform content.

---

## 📄 License
This project is part of a Final Year Project (FYP). All rights reserved.
