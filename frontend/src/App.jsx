import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';

// Lazy load pages
const Splash = lazy(() => import('./pages/Splash/Splash'));
const Intro = lazy(() => import('./pages/Splash/Intro'));
const Home = lazy(() => import('./pages/Dashboard/Home'));
const PredictForm = lazy(() => import('./pages/Prediction/PredictForm'));
const Weather = lazy(() => import('./pages/Weather/Weather'));
const Library = lazy(() => import('./pages/Learn/Library'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ActivityTracker = lazy(() => import('./pages/Activities/ActivityTracker'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const MapPage = lazy(() => import('./pages/Map/MapPage'));
const NotificationPage = lazy(() => import('./pages/Notifications/NotificationPage'));
const About = lazy(() => import('./pages/About/About'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Legal/TermsOfService'));
const ContactSupport = lazy(() => import('./pages/Support/ContactSupport'));
const Login = lazy(() => import('./auth/Login'));
const Register = lazy(() => import('./auth/Register'));
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import 'leaflet/dist/leaflet.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <LanguageProvider>
      <LocationProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <AppContent onSearchClick={() => setIsSearchOpen(true)} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}

const AppContent = ({ onSearchClick, isSearchOpen, setIsSearchOpen }) => {
  return (
    <AppRoutes onSearchClick={onSearchClick} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
  );
}

import { useLocation } from 'react-router-dom';

const AppRoutes = ({ onSearchClick, isSearchOpen, setIsSearchOpen }) => {
  const location = useLocation();
  const hideNavPaths = ['/login', '/register', '/forgot-password'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className={`app ${shouldHideNav ? 'full-page' : ''}`}>
      {!shouldHideNav && <Navbar onSearchClick={onSearchClick} />}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <main className="main-content">
      <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Farmer Routes */}
          <Route path="/predict" element={<PredictForm />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/learn" element={<Library />} />
          
          <Route path="/activities" element={<ActivityTracker />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/map" element={<MapPage />} />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/support" element={<ContactSupport />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </main>
      {!shouldHideNav && <Footer />}
    </div>
  );
}

export default App;
