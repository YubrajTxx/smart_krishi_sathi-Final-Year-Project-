import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkedAlt,
    faSatellite,
    faLandmark,
    faInfoCircle,
    faLayerGroup,
    faCheckCircle,
    faVrCardboard,
    faThermometerHalf,
    faFlask
} from '@fortawesome/free-solid-svg-icons';
import { useLocation as useAppLocation } from '../../context/LocationContext.jsx';
import L from 'leaflet';
import { getPlaceName } from '../../utils/geocoding';

// Fix Leaflet Default Icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to force map to recalculate its size on mount
const MapResizeComponent = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 500);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const LocationMarker = ({ tempPos, setTempPos }) => {
    useMapEvents({
        async click(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            setTempPos({ lat, lng, label: 'Locating...' });

            const label = await getPlaceName(lat, lng);
            setTempPos({ lat, lng, label });
        },
    });

    return (
        <Marker position={[tempPos.lat, tempPos.lng]} />
    );
};

const MapPage = () => {
    const { location: appLocation, setLocation } = useAppLocation();
    const [tempPos, setTempPos] = useState({
        lat: appLocation.lat,
        lng: appLocation.lng,
        label: appLocation.label
    });
    const [isApplied, setIsApplied] = useState(false);

    const [overlayData] = useState([
        { id: 1, pos: [27.62, 85.55], type: 'soil', level: 'High', crop: 'Rice', detail: 'Nitrogen Rich' },
        { id: 2, pos: [27.58, 85.51], type: 'thermal', temp: '22°C', detail: 'Optimal for Maize' },
        { id: 3, pos: [27.65, 85.58], type: 'soil', level: 'Moderate', crop: 'Potatoes', detail: 'Sandy Loam' },
    ]);



    const handleUpdateLocation = () => {
        setLocation({
            ...appLocation,
            lat: tempPos.lat,
            lng: tempPos.lng,
            label: tempPos.label || `Selected Location (${tempPos.lat.toFixed(2)}, ${tempPos.lng.toFixed(2)})`
        });
        setIsApplied(true);
        setTimeout(() => setIsApplied(false), 2000);
    };

    const isValidLocation = appLocation && typeof appLocation.lat === 'number' && typeof appLocation.lng === 'number';

    if (!isValidLocation) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Map Data...</div>;
    }

    return (
        <div className="map-page-container" style={{ padding: '2rem 1rem', background: '#F8FAFC', minHeight: '100vh', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <header className="map-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto 2.5rem' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                    <h2 className="map-title" style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Regional Agricultural Map</h2>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1rem' }}>Detailed geographical insights and regional crop recommendation overlays.</p>
                </div>
                {(tempPos.lat !== appLocation.lat || tempPos.lng !== appLocation.lng) && (
                    <motion.button
                        className="btn btn-blue"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleUpdateLocation}
                        disabled={isApplied}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            padding: '0.8rem 1.5rem', 
                            borderRadius: '12px', 
                            boxShadow: isApplied ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' : '0 10px 15px -3px rgba(59, 130, 246, 0.3)', 
                            border: 'none', 
                            color: 'white', 
                            fontWeight: '700', 
                            background: isApplied ? '#10B981' : '#3b82f6',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} /> {isApplied ? 'Location Applied!' : 'Apply Location'}
                    </motion.button>
                )}
            </header>

            <div className="map-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                    className="map-card"
                    style={{
                        height: '600px',
                        padding: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                        background: 'white',
                        border: '4px solid #F8FAFC'
                    }}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <MapContainer
                        key={`${appLocation.lat}-${appLocation.lng}`}
                        center={[appLocation.lat, appLocation.lng]}
                        zoom={10}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <MapResizeComponent />
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
                        />
                        <LocationMarker tempPos={tempPos} setTempPos={setTempPos} />

                        {overlayData.map(data => (
                            <Marker
                                key={data.id}
                                position={data.pos}
                                icon={L.divIcon({
                                    className: 'custom-marker',
                                    html: `<div style="background: ${data.type === 'soil' ? '#06B6D4' : '#f59e0b'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div>`
                                })}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h5 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>
                                            <FontAwesomeIcon icon={data.type === 'soil' ? faFlask : faThermometerHalf} style={{ marginRight: '5px' }} />
                                            {data.type === 'soil' ? 'Soil Analysis' : 'Thermal Zone'}
                                        </h5>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                            {data.detail}<br />
                                            <b>Recommendation:</b> {data.crop || 'Monitor'}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </motion.div>

                <div className="map-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', background: 'white' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', margin: '0 0 1.25rem 0' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faLandmark} />
                            </div>
                            Active Region
                        </h4>
                        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                            <p style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b', marginBottom: '0.25rem' }}>{tempPos.label || 'Coordinates'}</p>
                            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, letterSpacing: '0.2px' }}>
                                Lat: {tempPos.lat.toFixed(4)}° N<br />
                                Lng: {tempPos.lng.toFixed(4)}° E
                            </p>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '1rem', lineHeight: '1.4' }}>
                            Click on the map to define new targeting boundaries.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', background: 'white' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', margin: '0 0 1.25rem 0' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faLayerGroup} />
                            </div>
                            Analysis Layers
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Soil Productivity', color: '#06B6D4' },
                                { label: 'Irrigation Access', color: '#3b82f6' },
                                { label: 'Thermal Zones', color: '#f59e0b' }
                            ].map((layer, idx) => (
                                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }} className="layer-option">
                                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: layer.color || '#3b82f6' }} />
                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>{layer.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.5rem', borderRadius: '20px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
                            <FontAwesomeIcon icon={faInfoCircle} /> Did you know?
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                            Cross-referencing humidity and soil data can increase yield by up to 25%.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .map-layout-grid { grid-template-columns: 1fr !important; }
                    .map-card { height: 450px !important; }
                    .map-header { flex-direction: column; align-items: flex-start !important; }
                    .btn-blue { width: 100%; justify-content: center; }
                }
                @media (max-width: 640px) {
                    .map-page-container { padding: 1.5rem 0.75rem !important; }
                    .map-title { font-size: 1.75rem !important; }
                    .map-card { height: 350px !important; border-radius: 16px !important; }
                    .card { padding: 1.25rem !important; }
                }
            `}</style>
        </div>
    );
};

export default MapPage;
