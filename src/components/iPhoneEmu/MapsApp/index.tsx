import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Marker } from 'pigeon-maps';
import MapsHeader from './MapsHeader';
import './MapsApp.css';
import { config } from '../../../lib/config';

const MELBOURNE: [number, number] = [-37.8136, 144.9631];

interface MapsAppProps {
  onClose: () => void;
}

// TypeScript: declare google on window
declare global {
  interface Window {
    google: any;
  }
}

const MapsApp: React.FC<MapsAppProps> = ({ onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.google.mapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else if (window.google) {
      initMap();
    }

    function initMap() {
      if (mapRef.current && window.google) {
        const melbourneCBD = { lat: -37.8136, lng: 144.9631 };
        const gmap = new window.google.maps.Map(mapRef.current, {
          center: melbourneCBD,
          zoom: 13,
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
            { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
            { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
            { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
            { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
            { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e7f7' }] },
            { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#b1b1b1' }] }
          ]
        });
        setMap(gmap);
      }
    }
  }, []);

  // Search function
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || !map || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
      }
    });
  };

  return (
    <motion.div
      className="maps-app"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <MapsHeader />
      <div className="maps-content">
        <div className="map-container" style={{ position: 'relative', height: 350 }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden' }} />
        </div>
        <div className="maps-controls">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for a place or address"
              className="search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="search-button" type="submit">Search</button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default MapsApp; 