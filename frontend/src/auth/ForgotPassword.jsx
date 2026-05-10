import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="section-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                className="card"
                style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {!submitted ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.8rem' }}>Reset Password</h2>
                            <p style={{ color: 'var(--text-light)' }}>Enter your email to receive a reset link</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: 'var(--primary)' }} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '10px' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-green" style={{ width: '100%', padding: '1rem' }}>
                                Send Reset Link <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: '#E8F5E9', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                            <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '1.5rem' }} />
                        </div>
                        <h3>Check your Email</h3>
                        <p style={{ color: 'var(--text-light)', margin: '1rem 0 2rem' }}>
                            We've sent a password reset link to <br /><strong>{email}</strong>
                        </p>
                        <button onClick={() => setSubmitted(false)} className="btn btn-blue-outline" style={{ width: '100%' }}>
                            Try another email
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
