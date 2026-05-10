import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    // Default to Kathmandu
    const defaultLocation = {
        lat: 27.7007,
        lng: 85.3001,
        label: 'Kathmandu, Nepal'
    };

    const [location, setLocationState] = useState(() => {
        const stored = localStorage.getItem('krishi_location');
        return stored ? JSON.parse(stored) : defaultLocation;
    });

    const setLocation = (newLocation) => {
        setLocationState(newLocation);
        localStorage.setItem('krishi_location', JSON.stringify(newLocation));
    };

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
