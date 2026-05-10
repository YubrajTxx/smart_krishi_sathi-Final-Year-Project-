import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSun,
  faChartLine,
  faBookOpen,
  faArrowRight,
  faSeedling,
  faBell,
  faTasks,
  faStickyNote,
  faMapMarkedAlt,
  faCloud,
  faSun,
  faCloudRain,
  faSnowflake,
  faBolt,
  faLeaf,
  faWind
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { useLocation as useAppLocation } from '../../context/LocationContext.jsx';
import { getCurrentSeason } from '../../utils/seasonUtils';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { location: appLocation } = useAppLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Use coordinates from LocationContext
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${appLocation.lat}&longitude=${appLocation.lng}&current_weather=true`);
        const data = await response.json();
        setWeatherData(data.current_weather);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setLoading(false);
      }
    };
    fetchWeather();
  }, [appLocation.lat, appLocation.lng]);

  const getWeatherIcon = (code) => {
    if (code === 0) return faSun;
    if (code >= 1 && code <= 3) return faCloudSun;
    if (code >= 45 && code <= 48) return faCloud;
    if (code >= 51 && code <= 67) return faCloudRain;
    if (code >= 71 && code <= 77) return faSnowflake;
    if (code >= 80 && code <= 82) return faCloudRain;
    if (code >= 95) return faBolt;
    return faCloudSun;
  };

  const getWeatherText = (code) => {
    if (code === 0) return t('sunny');
    if (code >= 1 && code <= 3) return t('partly_cloudy_cond');
    if (code >= 45 && code <= 48) return t('foggy');
    if (code >= 51 && code <= 67) return t('rainy');
    if (code >= 71 && code <= 77) return t('snowy');
    if (code >= 80 && code <= 82) return t('showers');
    if (code >= 95) return t('thunderstorm');
    return t('variable');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="page-container home-page">
      <header className="card header-card">
        <div style={{ flex: 1 }}>
          <h2 className="home-title" style={{ color: 'var(--primary)', fontWeight: '800' }}>
            {t('namaste')}, {user?.name || t('farmer')}
          </h2>
          <p className="home-subtitle" style={{ fontSize: '1rem' }}>
            <FontAwesomeIcon icon={faMapMarkedAlt} style={{ marginRight: '8px', color: 'var(--primary)' }} />
            {appLocation.label || t('select_location')} • {t('seasonal_cycle')}: <FontAwesomeIcon icon={
              getCurrentSeason() === 'Spring' ? faLeaf :
              getCurrentSeason() === 'Summer' ? faSun :
              getCurrentSeason() === 'Monsoon' ? faCloudRain :
              getCurrentSeason() === 'Autumn' ? faWind :
              faSnowflake
            } style={{ marginLeft: '8px', marginRight: '4px', color: 'var(--accent)' }} /> {getCurrentSeason()}
          </p>
        </div>
      </header>

      <motion.div
        className="home-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Weather Card */}
        <motion.div className="card weather-card" variants={itemVariants}>
          <div className="weather-icon-section">
            <FontAwesomeIcon
              icon={loading ? faCloudSun : getWeatherIcon(weatherData?.weathercode)}
              className="weather-icon"
            />
            <h1 className="weather-temp">{loading ? '--' : `${Math.round(weatherData?.temperature)}°C`}</h1>
            <div className="weather-date-time">
              <span className="weather-time">
                {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="weather-date">
                {currentDateTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="weather-info">
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', opacity: 0.9 }}>
              {appLocation.label || 'Unknown Area'}
            </span>
            <h3 className="weather-title" style={{ marginTop: '0.25rem' }}>{loading ? t('loading_weather') : getWeatherText(weatherData?.weathercode)}</h3>
            <p className="weather-desc">
              {loading
                ? t('retrieving_weather')
                : t('weather_summary', { wind: weatherData?.windspeed })}
            </p>
            <Link to="/weather" className="btn btn-blue-outline weather-btn">
              {t('full_forecast')} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </motion.div>

        {/* Prediction Quick Action */}
        <motion.div className="card predict-card" variants={itemVariants}>
          <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }} />
          <h3>{t('ai_diagnosis')}</h3>
          <p style={{ color: 'var(--text-light)', margin: '1rem 0 2rem' }}>{t('soil_analysis_desc')}</p>
          <Link to="/predict" className="btn btn-green" style={{ width: '100%' }}>
            {t('predict')}
          </Link>
        </motion.div>

        {/* Library Card */}
        <motion.div className="card library-card" variants={itemVariants}>
          <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: '2.5rem', color: '#1B5E20', marginBottom: '1.5rem' }} />
          <h3>{t('library')}</h3>
          <p style={{ color: 'var(--text-light)', margin: '1rem 0 2rem' }}>{t('library_desc')}</p>
          <Link to="/learn" className="btn btn-blue-outline" style={{ width: '100%' }}>
            {t('browse_guides')}
          </Link>
        </motion.div>

        {/* Activity Summary */}
        <motion.div className="card activity-card" variants={itemVariants}>
          <FontAwesomeIcon icon={faTasks} style={{ fontSize: '2.5rem', color: '#9C27B0', marginBottom: '1.5rem' }} />
          <h3>{t('next_task')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#E3F2FD', padding: '10px', borderRadius: '10px' }}>
              <FontAwesomeIcon icon={faSeedling} style={{ color: '#0288D1' }} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>{t('irrigation_cycle')}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t('scheduled_tomorrow')}</span>
            </div>
          </div>
          <Link to="/activities" className="btn btn-blue-outline" style={{ width: '100%' }}>
            {t('planner')}
          </Link>
        </motion.div>


        {/* Map Explorer Card */}
        <motion.div className="card map-card" variants={itemVariants}>
          <div className="map-content">
            <h3 className="map-title"><FontAwesomeIcon icon={faMapMarkedAlt} style={{ color: 'var(--primary)', marginRight: '10px' }} />{t('district_highlights')}</h3>
            <p className="map-desc">{t('map_desc')}</p>
          </div>
          <Link to="/map" className="btn btn-green map-btn">
            {t('open_interactive_map')}
          </Link>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .home-page {
          /* Padding handled by page-container */
        }
        
        .home-title {
          font-size: 2rem;
          margin: 0;
        }
        
        .home-subtitle {
          color: var(--text-light);
          margin-top: 0.5rem;
        }
        
        .notification-wrapper {
          position: relative;
        }
        
        .notification-btn {
          background: #F5F5F5;
          border: none;
          padding: 0.875rem;
          border-radius: 50%;
          color: var(--text-dark);
          cursor: pointer;
          font-size: 1rem;
        }
        
        .notification-dot {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #dc2626;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .home-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        
        .weather-card {
          grid-column: span 2;
          display: flex;
          gap: 2rem;
          align-items: center;
          background: linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%);
          color: white;
          border: none;
          box-shadow: 0 15px 30px rgba(2, 136, 209, 0.2);
        }
        
        .weather-icon-section {
          text-align: center;
          flex-shrink: 0;
        }
        
        .weather-icon {
          font-size: 4rem;
          color: #FFD54F;
        }
        
        .weather-temp {
          font-size: 2.5rem;
          margin: 0.5rem 0 0;
          color: white;
          font-weight: 800;
        }

        .weather-date-time {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
          opacity: 0.9;
        }

        .weather-time {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .weather-date {
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .weather-info {
          flex: 1;
        }
        
        .weather-title {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          color: white;
        }
        
        .weather-desc {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          font-size: 0.95rem;
        }
        
        .weather-btn {
          margin-top: 1.5rem;
          width: auto;
          background: transparent;
          color: white;
          border-color: white;
        }
        .weather-btn:hover {
          background: white;
          color: #0288D1;
          border-color: white;
        }
        
        .map-card {
          grid-column: span 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }
        
        .map-title {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .map-desc {
          color: var(--text-light);
          max-width: 400px;
        }
        
        .map-btn {
          white-space: nowrap;
          flex-shrink: 0;
          width: auto;
        }



        .map-card {
            grid-column: span 3;
        }
        
        @media (max-width: 992px) {
          .home-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .weather-card {
            grid-column: span 2;
          }


          
          .map-card {
            grid-column: span 2;
          }
        }
        
        @media (max-width: 768px) {
          .home-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .weather-card {
            grid-column: span 1;
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          
          .weather-icon {
            font-size: 3.5rem;
          }
          
          .weather-temp {
            font-size: 2rem;
          }
          
          .weather-info {
            text-align: center;
          }
          
          .weather-btn {
            margin: 1rem auto 0;
          }
          
          .map-card {
            grid-column: span 1;
            flex-direction: column;
            text-align: center;
          }
          
          .map-content {
            text-align: center;
          }
          
          .map-desc {
            max-width: none;
          }
          
          .map-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
