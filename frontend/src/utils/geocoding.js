/**
 * Reverse geocoding utility using Nominatim OpenStreetMap API
 */

export const getPlaceName = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
            headers: {
                'Accept-Language': 'en'
            }
        });
        const data = await response.json();

        if (data && data.address) {
            const { city, town, village, suburb, district, state, county } = data.address;
            const place = city || town || village || suburb || district || county || 'Unknown Place';
            const region = state || '';
            return region ? `${place}, ${region}` : place;
        }

        return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    } catch (error) {
        console.error("Geocoding error:", error);
        return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    }
};
