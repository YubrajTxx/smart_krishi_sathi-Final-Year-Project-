import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSeedling, 
  faCloudSun, 
  faBookOpen, 
  faArrowRight,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/LanguageContext.jsx';


const Intro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const introSlides = [
    {
      id: 1,
      icon: faSeedling,
      title: t('ai_prediction_title'),
      description: t('ai_prediction_desc'),
      color: '#10b981'
    },
    {
      id: 2,
      icon: faCloudSun,
      title: t('real_time_weather_title'),
      description: t('real_time_weather_desc'),
      color: '#3b82f6'
    },
    {
      id: 3,
      icon: faBookOpen,
      title: t('smart_library_title'),
      description: t('smart_library_desc'),
      color: '#8b5cf6'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < introSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/register');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    navigate('/register');
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    })
  };

  // 1 for forward, -1 for backward
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
    if (newDirection === 1) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const currentData = introSlides[currentSlide];

  return (
    <div className="intro-page">
      <div className="skip-container">
        <button onClick={handleSkip} className="btn-skip">{t('skip_intro')}</button>
      </div>

      <div className="carousel-container">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="slide-content"
          >
            <div 
              className="icon-container" 
              style={{ backgroundColor: `${currentData.color}20`, color: currentData.color }}
            >
              <FontAwesomeIcon icon={currentData.icon} className="slide-icon" />
            </div>
            
            <h2 className="slide-title">{currentData.title}</h2>
            <p className="slide-description">{currentData.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="indicators">
          {introSlides.map((_, index) => (
            <div 
              key={index} 
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundColor: index === currentSlide ? currentData.color : '#cbd5e1' }}
            ></div>
          ))}
        </div>

        <div className="controls">
          <button 
            className={`btn-control btn-prev ${currentSlide === 0 ? 'hidden' : ''}`}
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> {t('back')}
          </button>
          
          <button 
            className="btn-control btn-next"
            onClick={() => paginate(1)}
            style={{ backgroundColor: currentData.color, color: 'white' }}
          >
            {currentSlide === introSlides.length - 1 ? t('get_started') : t('next')} <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .intro-page {
          min-height: calc(100vh - 140px); /* Adjust based on navbar/footer height */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          position: relative;
          padding: 2rem;
        }

        .skip-container {
          position: absolute;
          top: 2rem;
          right: 2rem;
        }

        .btn-skip {
          background: transparent;
          border: none;
          color: #64748b;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .btn-skip:hover {
          color: #1e293b;
        }

        .carousel-container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
          max-width: 500px;
          width: 100%;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 450px;
        }

        .slide-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
        }

        .icon-container {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .slide-icon {
          font-size: 3rem;
        }

        .slide-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .slide-description {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 400px;
        }

        .indicators {
          display: flex;
          gap: 0.5rem;
          margin: 2rem 0;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .indicator-dot.active {
          width: 24px;
          border-radius: 12px;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: auto;
          gap: 1rem;
        }

        .btn-control {
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .btn-control:active {
          transform: scale(0.95);
        }

        .btn-prev {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-prev.hidden {
          visibility: hidden;
        }

        .btn-next {
          flex: 1;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        @media (max-width: 640px) {
          .carousel-container {
            padding: 2rem 1.5rem;
            min-height: 480px;
          }
          
          .skip-container {
            top: 1rem;
            right: 1rem;
          }
          
          .slide-title {
            font-size: 1.5rem;
          }
          
          .icon-container {
            width: 80px;
            height: 80px;
          }
          
          .slide-icon {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Intro;
