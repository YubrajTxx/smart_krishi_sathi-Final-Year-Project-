import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSun,
  faCloudRain,
  faSun,
  faWind,
  faTint,
  faTemperatureHigh,
  faMapMarkerAlt,
  faSyncAlt,
  faCloud,
  faSnowflake,
  faBolt,
  faTimes,
  faCheck,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { useLocation as useAppLocation } from '../../context/LocationContext.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getPlaceName } from '../../utils/geocoding';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Weather = () => {
  const { t } = useTranslation();
  const { location: appLocation, setLocation } = useAppLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [tempLocation, setTempLocation] = useState(appLocation);
  const [isApplied, setIsApplied] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${appLocation.lat}&longitude=${appLocation.lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_sum&timezone=auto&forecast_days=14`);
      const data = await response.json();

      setWeatherData({
        ...data.current_weather,
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0])
      });

      const forecastData = data.daily.time.map((time, index) => ({
        day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
        dateLabel: new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateRaw: time,
        temp: `${Math.round(data.daily.temperature_2m_max[index])}°`,
        tempMax: Math.round(data.daily.temperature_2m_max[index]),
        tempMin: Math.round(data.daily.temperature_2m_min[index]),
        icon: getWeatherIcon(data.daily.weathercode[index]),
        cond: getWeatherText(data.daily.weathercode[index]),
        weathercode: data.daily.weathercode[index],
        wind: data.daily.windspeed_10m_max[index],
        rain: data.daily.precipitation_sum[index]
      }));
      setForecast(forecastData);
      setDailyData(forecastData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    setTempLocation(appLocation);
    setSelectedDayIndex(0);
  }, [appLocation.lat, appLocation.lng]);

  const handleUpdateLocation = () => {
    setLocation(tempLocation);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  const handleCancel = () => {
    setTempLocation(appLocation);
  };

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

  return (
    <div className="weather-section-container" style={{ padding: '2rem 1rem', background: '#F0F7FF', minHeight: '100vh', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>

      {/* 1. TOP SECTION: 7-DAY FORECAST (Compact Horizontal Scroll) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', fontSize: '1.1rem', margin: 0, padding: '0 0.5rem' }}>{t('14_day_forecast')}</h4>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              id="datePicker"
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              onChange={(e) => {
                const selected = e.target.value;
                const index = forecast.findIndex(f => f.dateRaw === selected);
                if (index !== -1) setSelectedDayIndex(index);
              }}
              min={forecast[0]?.dateRaw}
              max={forecast[forecast.length - 1]?.dateRaw}
            />
            <button
              onClick={() => document.getElementById('datePicker').showPicker()}
              className="btn btn-blue-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '10px' }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} /> {t('pick_date')}
            </button>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          padding: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }} className="hide-scrollbar">
          {forecast.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedDayIndex(index)}
              style={{
                flex: '0 0 130px',
                textAlign: 'center',
                padding: '1.25rem 0.5rem',
                background: selectedDayIndex === index ? '#E0F2FE' : 'white',
                borderRadius: '20px',
                boxShadow: selectedDayIndex === index ? '0 8px 20px rgba(14, 165, 233, 0.15)' : '0 4px 15px rgba(0,0,0,0.03)',
                border: selectedDayIndex === index ? '2px solid #0EA5E9' : '1px solid #E0F2FE',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>{item.day}</span>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '600', marginTop: '-4px' }}>{item.dateLabel}</span>
              <FontAwesomeIcon icon={item.icon} style={{ fontSize: '2.2rem', color: '#0EA5E9', margin: '4px 0' }} />
              <div>
                <p style={{ fontWeight: '800', fontSize: '1.4rem', color: '#0F172A', margin: 0 }}>{item.temp}</p>
                <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600', margin: '4px 0 0' }}>{item.cond}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE SECTION: LARGE CURRENT WEATHER DASHBOARD */}
      <motion.div
        className="weather-main-card"
        style={{
          background: 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 100%)',
          color: 'white',
          borderRadius: '32px',
          boxShadow: '0 25px 50px -12px rgba(56, 189, 248, 0.2)',
          maxWidth: '1200px',
          margin: '0 auto 3rem',
          overflow: 'hidden',
          position: 'relative'
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="weather-card-content" style={{ padding: '3rem', position: 'relative', zIndex: 1 }}>
          <div className="weather-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>

            {/* Main Stats */}
            <div className="weather-stats-primary" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                  {selectedDayIndex === 0 ? t('today') : dailyData[selectedDayIndex]?.dateRaw}
                </span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '20px', marginBottom: '1rem' }}>
                <FontAwesomeIcon
                  icon={loading ? faSyncAlt : (selectedDayIndex === 0 ? getWeatherIcon(weatherData?.weathercode) : dailyData[selectedDayIndex]?.icon)}
                  spin={loading}
                  className="weather-main-icon"
                  style={{ fontSize: '8rem', color: '#FFD700', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.4))' }}
                />
              </div>
              <h1 className="weather-temp-main" style={{ fontSize: '7rem', fontWeight: '900', margin: '0', lineHeight: 1, color: 'white' }}>
                {loading ? '--' : (selectedDayIndex === 0 ? Math.round(weatherData?.temperature) : dailyData[selectedDayIndex]?.tempMax)}°C
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                  H: {loading ? '--' : (selectedDayIndex === 0 ? weatherData?.high : dailyData[selectedDayIndex]?.tempMax)}°
                  L: {loading ? '--' : (selectedDayIndex === 0 ? weatherData?.low : dailyData[selectedDayIndex]?.tempMin)}°
                </span>
              </div>
              <p className="weather-cond-text" style={{ fontSize: '2rem', opacity: 0.95, fontWeight: '600', marginTop: '0.5rem' }}>
                {loading ? t('loading_weather') : (selectedDayIndex === 0 ? getWeatherText(weatherData?.weathercode) : dailyData[selectedDayIndex]?.cond)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '1.5rem' }}>
                <span style={{ padding: '8px 20px', borderRadius: '100px', background: 'rgba(255,255,255,0.2)', fontSize: '0.95rem', fontWeight: '800', backdropFilter: 'blur(10px)', color: 'white' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                  {appLocation.label || `${appLocation.lat.toFixed(2)}, ${appLocation.lng.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="weather-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {[
                { icon: faWind, label: t('wind_max'), value: `${loading ? '--' : (selectedDayIndex === 0 ? weatherData?.windspeed : dailyData[selectedDayIndex]?.wind)} km/h`, color: '#BFDBFE' },
                { icon: faTint, label: t('rain_prob'), value: `${loading ? '--' : (selectedDayIndex === 0 ? '64%' : dailyData[selectedDayIndex]?.rain + ' mm')}`, color: '#BAE6FD' },
                { icon: faTemperatureHigh, label: t('feels_like'), value: `${loading ? '--' : (selectedDayIndex === 0 ? Math.round(weatherData?.temperature + 2) : dailyData[selectedDayIndex]?.tempMax + 2)}°`, color: '#FED7AA' },
                { icon: faCloud, label: t('condition'), value: `${loading ? '--' : (selectedDayIndex === 0 ? t('stable') : dailyData[selectedDayIndex]?.cond)}`, color: '#E9D5FF' }
              ].map((item, id) => (
                <motion.div
                  key={id}
                  className="detail-item"
                  whileHover={{ y: -5, background: 'rgba(255,255,255,0.2)' }}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '1.5rem 1rem',
                    borderRadius: '24px',
                    backdropFilter: 'blur(100px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    cursor: 'default'
                  }}>
                  <FontAwesomeIcon icon={item.icon} style={{ color: item.color, fontSize: '1.4rem', marginBottom: '0.75rem' }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '1.2rem', fontWeight: '800' }}>{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="bg-decoration-1" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}></div>
        <div className="bg-decoration-2" style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}></div>
      </motion.div>

      {/* 3. BOTTOM SECTION: INTERACTIVE LOCATION PICKER (EMBEDDED MAP) */}
      <motion.div
        className="weather-map-section"
        style={{
          padding: '2rem',
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          maxWidth: '1200px',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="map-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '12px', color: '#0F172A', margin: 0, fontWeight: '800' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              {t('select_regional_focus')}
            </h3>
            <p style={{ color: '#64748B', marginTop: '0.35rem', fontSize: '0.9rem' }}>{t('target_weather_desc')}</p>
          </div>
          <button
            onClick={fetchWeather}
            className="btn btn-blue-outline"
            style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}
          >
            <FontAwesomeIcon icon={faSyncAlt} spin={loading} /> {t('refresh')}
          </button>
        </div>

        <div className="map-wrapper" style={{ position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden', border: '4px solid #F8FAFC' }}>
          <MapContainer
            center={[appLocation.lat, appLocation.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarkerComponent tempLocation={tempLocation} setTempLocation={setTempLocation} />
            <MapRecenter lat={tempLocation.lat} lng={tempLocation.lng} />
          </MapContainer>
        </div>

        <div className="map-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap', gap: '1.25rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '24px' }}>
          <div className="coord-info">
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('current_selection')}</span>
            <p style={{ color: '#0F172A', margin: '4px 0 0', fontSize: '1.1rem', fontWeight: '800' }}>
              {tempLocation.label || `${tempLocation.lat.toFixed(4)}° N, ${tempLocation.lng.toFixed(4)}° E`}
            </p>
          </div>
          <div className="action-btns" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-blue-outline"
              style={{ borderRadius: '12px', padding: '0.75rem 1.5rem', fontWeight: '700', fontSize: '0.9rem', flex: 1, minWidth: '120px' }}
              onClick={handleCancel}
            >
              {t('reset')}
            </button>
            <button
              className="btn btn-blue"
              style={{ 
                borderRadius: '12px', 
                padding: '0.75rem 2rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                background: isApplied ? '#10B981' : '#3B82F6', 
                color: 'white', 
                border: 'none', 
                fontWeight: '700', 
                fontSize: '0.9rem', 
                boxShadow: isApplied ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' : '0 10px 15px -3px rgba(59, 130, 246, 0.3)', 
                flex: 2, 
                minWidth: '160px',
                transition: 'all 0.3s ease'
              }}
              onClick={handleUpdateLocation}
              disabled={isApplied}
            >
              <FontAwesomeIcon icon={isApplied ? faCheck : faCheck} /> {isApplied ? t('location_applied') : t('apply_location')}
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .weather-section-container { padding: 1rem 0.5rem !important; }
          .weather-card-content { padding: 2.5rem 1rem !important; }
          .weather-temp-main { font-size: 4.5rem !important; }
          .weather-cond-text { font-size: 1.5rem !important; }
          .weather-main-icon { font-size: 6rem !important; }
          .weather-detail-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .detail-item { padding: 1rem 0.5rem !important; }
          .detail-item p:last-child { font-size: 0.9rem !important; }
          .weather-map-section { padding: 1.25rem !important; border-radius: 24px !important; }
          .map-wrapper { height: 320px !important; }
          .map-controls { padding: 1rem !important; border-radius: 16px !important; }
          .action-btns { width: 100% !important; }
        }

        @media (max-width: 480px) {
          .weather-temp-main { font-size: 3.5rem !important; }
          .weather-main-icon { font-size: 4.5rem !important; }
          .weather-cond-text { font-size: 1.25rem !important; }
          .coord-info p { font-size: 0.9rem !important; }
        }
      `}</style>
    </div>
  );
};

// Helper component for map events
const LocationMarkerComponent = ({ tempLocation, setTempLocation }) => {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Show loading or coordinates immediately
      setTempLocation({
        lat,
        lng,
        label: 'Locating...'
      });

      const label = await getPlaceName(lat, lng);
      setTempLocation({
        lat,
        lng,
        label
      });
    },
  });

  return (
    <Marker position={[tempLocation.lat, tempLocation.lng]} />
  );
};

// Component to handle map center updates without full re-render
const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

export default Weather;
