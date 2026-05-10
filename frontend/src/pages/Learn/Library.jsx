import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faArrowRight,
  faSeedling,
  faLeaf,
  faClock,
  faMapMarkerAlt,
  faStickyNote,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { getCurrentSeason } from '../../utils/seasonUtils';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const Library = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  const crops = [
    {
      id: 1,
      name: 'Rice (Oryza sativa)',
      season: 'Monsoon',
      desc: 'Staple grain requiring high water and nitrogen.',
      details: 'Rice is the most important crop in Nepal. It is grown from the Terai plains to the high mountains.',
      activities: ['Soil testing (Poush)', 'Seedbed prep (Baishakh)', 'Transplanting (Ashad)', 'Weeding', 'Harvesting (Kartik)'],
      notes: 'Check for stem borer infestation if leaves turn yellow.'
    },
    {
      id: 2,
      name: 'Maize (Corn)',
      season: 'Summer/Spring',
      desc: 'Versatile crop suitable for hilly regions.',
      details: 'Maize is the second most important crop in terms of area and production.',
      activities: ['Plowing', 'Sowing', 'Thinning', 'Earthing-up', 'Harvesting'],
      notes: 'Needs good drainage; avoid waterlogging.'
    },
    {
      id: 3,
      name: 'Wheat',
      season: 'Winter',
      desc: 'Crucial winter crop for food security.',
      details: 'Wheat is mostly grown in the Terai and inner Terai regions.',
      activities: ['Sowing (Mangsir)', 'Irrigation', 'Top-dressing', 'Harvesting'],
      notes: 'Optimum sowing time is mid-November.'
    }
  ];

  const filteredCrops = crops.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section-container" style={{ padding: '3rem 0' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>{t('knowledge_library')}</h2>
        <p style={{ color: 'var(--text-light)' }}>{t('knowledge_desc')}</p>
      </header>

      {!selectedCrop ? (
        <>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input
                type="text"
                placeholder={t('search_crops_placeholder')}
                style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', border: '1px solid #eee', borderRadius: '50px', fontSize: '1rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-blue-outline" style={{ height: '56px' }}><FontAwesomeIcon icon={faFilter} /> {t('category_filter')}</button>
          </div>

          <motion.div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}
            layout
          >
            {filteredCrops.map(crop => (
              <motion.div
                key={crop.id}
                className="card"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                layout
                onClick={() => setSelectedCrop(crop)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ background: 'var(--bg-light)', height: '160px', borderRadius: '15px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faSeedling} style={{ fontSize: '4rem', color: 'var(--primary)', opacity: 0.4 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem' }}>{crop.name}</h3>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    background: crop.season.includes(getCurrentSeason()) ? 'var(--primary)' : 'var(--accent)', 
                    color: 'white', 
                    padding: '4px 10px', 
                    borderRadius: '15px', 
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {crop.season.includes(getCurrentSeason()) && <FontAwesomeIcon icon={faCalendarCheck} />}
                    {crop.season}
                  </span>
                </div>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>{crop.desc}</p>

                <button className="btn btn-green" style={{ width: '100%' }}>
                  {t('access_deep_guide')} <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1B5E20 100%)', padding: '4rem 3rem', color: 'white', position: 'relative' }}>
            <button
              onClick={() => setSelectedCrop(null)}
              style={{ position: 'absolute', top: '20px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faTimesCircle} /> {t('close_guide')}
            </button>
            <h1 style={{ fontSize: '3.5rem', margin: 0 }}>{selectedCrop.name}</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '1rem' }}><FontAwesomeIcon icon={faClock} /> {t('primary_season')}: {selectedCrop.season}</p>
          </div>

          <div style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '2px solid #f0f0f0', marginBottom: '3rem' }}>
              {['info_tab', 'activities_tab', 'notes_tab'].map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey.split('_')[0])}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    background: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: activeTab === tabKey.split('_')[0] ? 'var(--primary)' : '#999',
                    borderBottom: activeTab === tabKey.split('_')[0] ? '4px solid var(--primary)' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                >
                  {t(tabKey)}
                </button>
              ))}
            </div>

            <div style={{ minHeight: '300px' }}>
              {activeTab === 'info' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2 }}>
                      <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}><FontAwesomeIcon icon={faInfoCircle} style={{ color: 'var(--primary)' }} /> {t('biological_profile')}</h3>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>{selectedCrop.details}</p>
                    </div>
                    <div style={{ flex: 1, background: '#f9f9f9', padding: '2rem', borderRadius: '20px' }}>
                      <h4 style={{ marginBottom: '1.5rem' }}><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--primary)' }} /> {t('ideal_conditions')}</h4>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--primary)' }} /> Temperate Climate</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--primary)' }} /> Well-drained Soil</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--primary)' }} /> pH 6.0 - 7.5</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activities' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}><FontAwesomeIcon icon={faLeaf} style={{ color: 'var(--primary)' }} /> {t('growing_cycle_activities')}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedCrop.activities.map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', background: '#F1F8E9', borderRadius: '15px', border: '1px solid #DCEDC8' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{i + 1}</div>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{act}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}><FontAwesomeIcon icon={faStickyNote} style={{ color: 'var(--primary)' }} /> {t('internal_observations')}</h3>
                  <div className="card" style={{ background: '#FFFDE7', border: '1px dashed #FBC02D', padding: '2rem' }}>
                    <p style={{ fontSize: '1.1rem', color: '#827717', fontStyle: 'italic' }}>"{selectedCrop.notes}"</p>
                  </div>
                  <button className="btn btn-blue-outline" style={{ marginTop: '2rem' }}>{t('add_personal_note')}</button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Library;
