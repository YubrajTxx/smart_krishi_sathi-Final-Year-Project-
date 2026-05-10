import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicroscope,
  faArrowRight,
  faUndo,
  faStar,
  faInfoCircle,
  faFlask,
  faCloudSun,
  faMapMarkerAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

// ── Exact categories from trained OrdinalEncoder ──────────────────────────
const ZONES        = ['Hill', 'Himal', 'Terai'];
const SEASONS      = ['Monsoon', 'Post Monsoon', 'Pre Monsoon', 'Spring', 'Winter'];
const IRRIGATIONS  = ['Borewell', 'Canal', 'Drip', 'Pond', 'Pump', 'Rainfed', 'River Lift', 'Sprinkler'];
const SOIL_TYPES   = ['Alluvial', 'Clay', 'Clay Loam', 'Loam', 'Sandy', 'Sandy Loam', 'Silt', 'Silty Clay'];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ── Sub-components ────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title }) => (
  <div className="pf-section-header">
    <FontAwesomeIcon icon={icon} />
    <span>{title}</span>
  </div>
);

const NumberField = ({ label, field, placeholder, rangeText, formData, onChange }) => (
  <div className="pf-field">
    <label className="pf-label">{label}</label>
    <input
      type="number"
      step="any"
      className="pf-input"
      placeholder={placeholder}
      value={formData[field]}
      onChange={(e) => onChange(field, e.target.value)}
      required
    />
    {rangeText && <span className="pf-range">{rangeText}</span>}
  </div>
);

const SelectField = ({ label, field, options, formData, onChange }) => (
  <div className="pf-field">
    <label className="pf-label">{label}</label>
    <select
      className="pf-select"
      value={formData[field]}
      onChange={(e) => onChange(field, e.target.value)}
      required
    >
      <option value="">select</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────
const PredictForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');

  const [formData, setFormData] = useState({
    nitrogen: '', phosphorus: '', potassium: '', ph: '',
    temperature: '', humidity: '', rainfall: '',
    zone: '', season: '', irrigation: '', soil_type: ''
  });

  const { user } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setFormData({
      nitrogen: '', phosphorus: '', potassium: '', ph: '',
      temperature: '', humidity: '', rainfall: '',
      zone: '', season: '', irrigation: '', soil_type: ''
    });
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to generate predictions.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    // Build payload matching backend serializer field names
    const payload = {
      nitrogen:    parseFloat(formData.nitrogen),
      phosphorus:  parseFloat(formData.phosphorus),
      potassium:   parseFloat(formData.potassium),
      ph:          parseFloat(formData.ph),
      temperature: parseFloat(formData.temperature),
      humidity:    parseFloat(formData.humidity),
      rainfall:    parseFloat(formData.rainfall),
      zone:        formData.zone,
      season:      formData.season,
      irrigation:  formData.irrigation,
      soil_type:   formData.soil_type,
    };

    try {
      // Get auth token from localStorage (adjust key if your app uses a different one)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access');

      const res = await fetch(`${API_BASE}/recommendations/predict/`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || Object.values(data).flat().join(' ') || 'Prediction failed.';
        setError(msg);
      } else {
        setResult(data.recommendations);
      }
    } catch (err) {
      setError('Network error — make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-page">
      <motion.div
        className="card predict-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* ── Header ── */}
        <div className="predict-header">
          <div className="predict-icon-wrap">
            <FontAwesomeIcon icon={faMicroscope} className="predict-icon" />
          </div>
          <h2 className="predict-title">{t('ai_engine_title')}</h2>
          <p className="predict-subtitle">
            {t('ai_engine_desc')}
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit}>

            {/* ── SOIL NUTRIENTS ── */}
            <div className="pf-section">
              <SectionHeader icon={faFlask} title={t('soil_nutrients')} />
              <div className="pf-grid-2">
                <NumberField label={t('nitrogen')}    field="nitrogen"   placeholder="e.g. 85"  rangeText="Range: 0 – 140 kg/ha"  formData={formData} onChange={handleChange} />
                <NumberField label={t('phosphorus')}  field="phosphorus" placeholder="e.g. 53"  rangeText="Range: 5 – 122 kg/ha"  formData={formData} onChange={handleChange} />
                <NumberField label={t('potassium')}   field="potassium"  placeholder="e.g. 19"  rangeText="Range: 5 – 103 kg/ha"  formData={formData} onChange={handleChange} />
                <NumberField label={t('soil_ph')}         field="ph"         placeholder="e.g. 6.5" rangeText="Range: 3.5 – 8.2"       formData={formData} onChange={handleChange} />
              </div>
            </div>

            {/* ── CLIMATE CONDITIONS ── */}
            <div className="pf-section">
              <SectionHeader icon={faCloudSun} title={t('climate_conditions')} />
              <div className="pf-grid-2">
                <NumberField label={t('temperature') + " (°C)"} field="temperature" placeholder="e.g. 32" rangeText="Range: -5 – 43 °C" formData={formData} onChange={handleChange} />
                <NumberField label={t('humidity') + " (%)"}     field="humidity"    placeholder="e.g. 70" rangeText="Range: 30 – 98%"   formData={formData} onChange={handleChange} />
              </div>
              <div className="pf-grid-1">
                <NumberField label={t('rainfall') + " (mm)"} field="rainfall" placeholder="e.g. 200" rangeText="Range: 20 – 2813 mm" formData={formData} onChange={handleChange} />
              </div>
            </div>

            {/* ── LOCATION AND FARMING DETAILS ── */}
            <div className="pf-section">
              <SectionHeader icon={faMapMarkerAlt} title={t('farming_details')} />
              <div className="pf-grid-2">
                <SelectField label={t('zone')}           field="zone"       options={ZONES}       formData={formData} onChange={handleChange} />
                <SelectField label={t('season')}         field="season"     options={SEASONS}     formData={formData} onChange={handleChange} />
                <SelectField label={t('irrigation_type')} field="irrigation" options={IRRIGATIONS} formData={formData} onChange={handleChange} />
                <SelectField label={t('soil_type')}      field="soil_type"  options={SOIL_TYPES}  formData={formData} onChange={handleChange} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="pf-error">⚠ {error}</div>
            )}

            {/* Buttons */}
            <div className="predict-buttons">
              <button type="button" onClick={handleReset} className="btn btn-blue-outline predict-btn-reset">
                <FontAwesomeIcon icon={faUndo} style={{ marginRight: '8px' }} />
                {t('reset_inputs')}
              </button>
              <button type="submit" className="btn btn-green predict-btn-submit" disabled={loading}>
                {loading
                  ? <><FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />{t('ai_processing')}</>
                  : <>{t('predict_btn')} <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} /></>
                }
              </button>
            </div>
          </form>
        ) : (
          /* ── RESULTS ── */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="result-header">
              <h3 className="result-title">{t('results_title')}</h3>
              <button onClick={handleReset} className="btn btn-blue-outline">
                <FontAwesomeIcon icon={faUndo} /> &nbsp;{t('new_analysis')}
              </button>
            </div>

            <div className="result-grid">
              {result.map((item) => (
                <motion.div
                  key={item.rank}
                  className={`result-card ${item.rank === 1 ? 'result-card--top' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (item.rank - 1) * 0.12 }}
                >
                  {item.rank === 1 && (
                    <div className="top-badge">
                      <FontAwesomeIcon icon={faStar} /> {t('top_choice')}
                    </div>
                  )}

                  <div className="result-rank">#{item.rank}</div>
                  <h2 className="result-crop">{item.crop}</h2>
                  <div className="result-prob">{item.prob}% {t('match')}</div>

                  {/* Confidence bar */}
                  <div className="prob-bar-bg">
                    <motion.div
                      className="prob-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.prob}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </div>

                  <p className="result-desc">{item.desc}</p>

                  <div className="result-actions">
                    <button className="btn btn-blue-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}>
                      <FontAwesomeIcon icon={faInfoCircle} /> {t('details')}
                    </button>
                    <button className="btn btn-green" style={{ flex: 2, padding: '0.6rem', fontSize: '0.8rem' }}>
                      {t('learn_growth')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Styles ── */}
      <style jsx>{`
        .predict-page { padding: 2rem 1rem; }

        .predict-card {
          max-width: 860px;
          margin: 0 auto;
          padding: 2.5rem 2rem;
        }

        /* Header */
        .predict-header { text-align: center; margin-bottom: 2.5rem; }
        .predict-icon-wrap {
          background: var(--bg-light);
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .predict-icon  { font-size: 2.5rem; color: var(--primary); }
        .predict-title { font-size: 2rem; margin-bottom: 0.75rem; }
        .predict-subtitle {
          color: var(--text-light);
          max-width: 580px; margin: 0 auto; line-height: 1.6;
        }

        /* Sections */
        .pf-section {
          background: var(--bg-light, #f7f8fa);
          border: 1.5px solid #e0e0e8;
          border-radius: 14px;
          padding: 1.4rem 1.6rem;
          margin-bottom: 1.1rem;
        }
        .pf-section-header {
          display: flex; align-items: center; gap: 0.55rem;
          font-size: 0.72rem; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--primary, #2d8a4e);
          margin-bottom: 1.1rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid #e4e4ec;
        }

        /* Grids */
        .pf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 1.4rem; }
        .pf-grid-1 { margin-top: 0.9rem; }

        /* Fields */
        .pf-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .pf-label { font-size: 0.82rem; font-weight: 600; color: var(--text-light, #555); }

        .pf-input, .pf-select {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #c8c8d0;
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          color: #1a1a2e;
          font-size: 0.93rem;
          outline: none;
          transition: border-color 0.22s, box-shadow 0.22s;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .pf-input:focus, .pf-select:focus {
          border-color: var(--primary, #2d8a4e);
          box-shadow: 0 0 0 3px rgba(45, 138, 78, 0.14);
        }
        .pf-input::placeholder { color: #aab0bc; }
        .pf-select option { background: #fff; color: #1a1a2e; }
        .pf-range { font-size: 0.72rem; color: #9999aa; margin-top: -0.05rem; }

        /* Error */
        .pf-error {
          background: #fff3f3;
          border: 1px solid #f5a5a5;
          color: #c0392b;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          margin-top: 1rem;
        }

        /* Buttons */
        .predict-buttons {
          margin-top: 2rem;
          display: flex; gap: 1.5rem; justify-content: center;
        }
        .predict-btn-reset  { padding: 0.9rem 2rem; min-width: 140px; }
        .predict-btn-submit { padding: 0.9rem 2rem; font-size: 1rem; flex: 1; max-width: 380px; }

        /* Results */
        .result-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 2rem;
        }
        .result-title { font-size: 1.7rem; }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .result-card {
          background: white;
          border: 1.5px solid #e8e8f0;
          border-radius: 16px;
          padding: 1.8rem;
          position: relative;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .result-card--top {
          background: #f1faf4;
          border-color: var(--primary, #2d8a4e);
          border-width: 2px;
        }

        .top-badge {
          position: absolute; top: -14px; right: 16px;
          background: var(--accent, #f39c12);
          color: white; padding: 4px 14px;
          border-radius: 20px; font-weight: 800; font-size: 0.75rem;
        }

        .result-rank { font-size: 0.8rem; color: #999; font-weight: 600; }
        .result-crop { font-size: 1.9rem; color: var(--text-dark, #1a1a2e); margin: 0; }
        .result-prob { color: var(--primary, #2d8a4e); font-weight: 800; font-size: 1.1rem; }

        .prob-bar-bg {
          background: #e8f5e9; border-radius: 99px;
          height: 7px; overflow: hidden;
        }
        .prob-bar-fill {
          height: 100%; background: var(--primary, #2d8a4e); border-radius: 99px;
        }

        .result-desc { color: var(--text-light, #666); font-size: 0.88rem; line-height: 1.55; flex: 1; }
        .result-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }

        /* Responsive */
        @media (max-width: 640px) {
          .pf-grid-2          { grid-template-columns: 1fr; }
          .predict-buttons    { flex-direction: column; gap: 1rem; }
          .predict-btn-reset,
          .predict-btn-submit { width: 100%; max-width: none; }
          .predict-card       { padding: 1.5rem 1rem; }
          .result-grid        { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default PredictForm;
