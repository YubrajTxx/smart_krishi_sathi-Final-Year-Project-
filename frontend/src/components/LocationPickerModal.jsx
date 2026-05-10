import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import L from 'leaflet';

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

const LocationPickerModal = ({ isOpen, onClose, currentLocation, onSelect }) => {
    const [tempLocation, setTempLocation] = useState(currentLocation);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setTempLocation({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    label: `Selected Location (${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)})`
                });
            },
        });

        return (
            <Marker position={[tempLocation.lat, tempLocation.lng]} />
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
                <motion.div
                    className="modal-content"
                    onClick={e => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ width: '90%', maxWidth: '800px', height: '600px', display: 'flex', flexDirection: 'column' }}
                >
                    <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--primary)' }} />
                            Select Your Location
                        </h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="modal-body" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <MapContainer
                            center={[tempLocation.lat, tempLocation.lng]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    </div>

                    <div className="modal-footer" style={{ padding: '1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontWeight: '600', color: '#333' }}>Coordinates:</p>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>{tempLocation.lat.toFixed(4)}, {tempLocation.lng.toFixed(4)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-blue-outline" onClick={onClose}>Cancel</button>
                            <button
                                className="btn btn-green"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={() => {
                                    onSelect(tempLocation);
                                    onClose();
                                }}
                            >
                                <FontAwesomeIcon icon={faCheck} /> Use This Location
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LocationPickerModal;
