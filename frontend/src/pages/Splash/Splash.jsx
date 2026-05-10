import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faArrowRight,
  faSeedling,
  faCloudSun,
  faBookOpen,
  faMicroscope
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const Splash = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="splash-page">
      <div className="splash-bg">
        <div className="bg-overlay"></div>
        <div className="bg-gradient"></div>
      </div>

      <motion.div
        className="splash-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="splash-brand">
          <div className="brand-logo">
            <FontAwesomeIcon icon={faLeaf} />
          </div>
          <span className="brand-name">Smart Krishi Sathi</span>
        </motion.div>

        <motion.div variants={itemVariants} className="splash-hero-text">
          <h1>
            Sustainable Agriculture, <br />
            <span className="accent-text">Smarter Decisions.</span>
          </h1>
          <p>
            Empowering farmers with AI-driven recommendations, real-time weather analytics, and modern sustainable practices for a better yield.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="splash-btn-group">
          <Link to="/intro" className="btn-primary-large">
            Get Started Free <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
          <Link to="/login" className="btn-secondary-large">
            Sign In to Dashboard
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="splash-features-minimal">
          <div className="mini-feature">
            <FontAwesomeIcon icon={faMicroscope} />
            <span>AI Soil Testing</span>
          </div>
          <div className="mini-feature">
            <FontAwesomeIcon icon={faCloudSun} />
            <span>Hyper-local Weather</span>
          </div>
          <div className="mini-feature">
            <FontAwesomeIcon icon={faBookOpen} />
            <span>Smart Library</span>
          </div>
        </motion.div>
      </motion.div>

      <style jsx="true">{`
        .splash-page {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #ffffff;
        }

        .splash-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .bg-overlay {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80') center/cover no-repeat;
          opacity: 0.15;
          filter: saturate(0.8) contrast(1.1);
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(16, 185, 129, 0.05) 100%);
        }

        .splash-content {
          position: relative;
          z-index: 10;
          max-width: 1000px;
          width: 90%;
          text-align: center;
          color: #1e293b;
        }

        .splash-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .brand-logo {
          width: 44px;
          height: 44px;
          background: #10b981;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #1e293b;
          text-transform: uppercase;
        }

        .splash-hero-text h1 {
          font-size: clamp(2.5rem, 7vw, 4rem);
          line-height: 1;
          font-weight: 900;
          margin-bottom: 1.5rem;
          letter-spacing: -3px;
          color: #0f172a;
        }

        .accent-text {
          color: #10b981;
          display: inline-block;
          background: linear-gradient(120deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .splash-hero-text p {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #64748b;
          max-width: 650px;
          margin: 0 auto 3.5rem;
          line-height: 1.6;
          font-weight: 500;
        }

        .splash-btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .btn-primary-large {
          background: #10b981;
          color: white;
          padding: 1.15rem 2.25rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.3);
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .btn-primary-large:hover {
          transform: translateY(-4px) scale(1.02);
          background: #059669;
          box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary-large {
          background: #f1f5f9;
          color: #1e293b;
          padding: 1.15rem 2.25rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          text-decoration: none;
        }

        .btn-secondary-large:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .splash-features-minimal {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
        }

        .mini-feature {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
          padding: 0.5rem 1rem;
          background: rgba(241, 245, 249, 0.6);
          border-radius: 99px;
          backdrop-filter: blur(4px);
        }

        .mini-feature i, .mini-feature svg {
          color: #10b981;
          font-size: 1rem;
        }

        @media (max-width: 640px) {
          .splash-features-minimal {
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .mini-feature {
            width: fit-content;
          }
          .splash-btn-group {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary-large, .btn-secondary-large {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Splash;
