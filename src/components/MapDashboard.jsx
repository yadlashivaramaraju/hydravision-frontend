import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Your live Mapbox Public Token
mapboxgl.accessToken = 'pk.eyJ1IjoieWFkbGFzaGl2YXJhbWFyYWp1IiwiYSI6ImNtbjgzMmp6eTA1MGUycXF3bWU5NDVlenUifQ.doLWx-kGpdRsUowMg9mk8Q';

export default function MapDashboard() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [cart, setCart] = useState([]);

  // Mock Enterprise Database
  const screens = [
    { id: 1, name: "Jubilee Hills Checkpost", city: "Hyderabad", lat: 17.4326, lng: 78.4071, price: 5000, impressions: "12,000/hr", format: "Digital Spectacular" },
    { id: 2, name: "HITEC City Cyber Towers", city: "Hyderabad", lat: 17.4504, lng: 78.3808, price: 7500, impressions: "25,000/hr", format: "Highway LED" },
    { id: 3, name: "Banjara Hills Rd No. 12", city: "Hyderabad", lat: 17.4156, lng: 78.4347, price: 6000, impressions: "18,000/hr", format: "Digital Spectacular" },
    { id: 4, name: "Koramangala Sony World", city: "Bangalore", lat: 12.9352, lng: 77.6245, price: 8000, impressions: "30,000/hr", format: "Digital Spectacular" },
    { id: 5, name: "Indiranagar 100ft Rd", city: "Bangalore", lat: 12.9784, lng: 77.6408, price: 7000, impressions: "22,000/hr", format: "Street Furniture" }
  ];

  // Initialize the Map natively
  useEffect(() => {
    if (map.current) return; // Prevent map from rendering twice

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [78.4071, 17.4326],
      zoom: 11.5,
      pitch: 45, // Tilted 3D perspective
      bearing: -17.6 // Slight rotation
    });

    // Add our custom purple pins to the map
    screens.forEach((screen) => {
      const el = document.createElement('div');
      el.innerHTML = `₹${screen.price / 1000}k`;
      el.style.backgroundColor = '#7c3aed';
      el.style.color = 'white';
      el.style.padding = '5px 10px';
      el.style.borderRadius = '20px';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '12px';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
      el.style.border = '2px solid white';

      // When a user clicks a pin on the map
      el.addEventListener('click', () => {
        setSelectedScreen(screen);
      });

      new mapboxgl.Marker(el)
        .setLngLat([screen.lng, screen.lat])
        .addTo(map.current);
    });
  }, []); // Empty dependency array ensures this runs exactly once

  const addToCart = (screen) => {
    if (!cart.find(item => item.id === screen.id)) setCart([...cart, screen]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* LEFT SIDEBAR: The AdQuick Campaign Builder */}
      <div style={{ width: '400px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 10, boxShadow: '5px 0 15px rgba(0,0,0,0.05)' }}>
        
        <div style={{ padding: '25px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '20px' }}>Campaign Builder</h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Select inventory from the map.</p>
          </div>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}>Exit</button>
        </div>
        
        <div style={{ flex: 1, padding: '25px', overflowY: 'auto', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Selected Inventory</h3>
          
          {selectedScreen ? (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc' }}>
              <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{selectedScreen.format}</span>
              <h3 style={{ margin: '10px 0', color: '#0f172a', fontSize: '18px' }}>{selectedScreen.name}</h3>
              <p style={{ margin: '5px 0', color: '#475569', fontSize: '14px' }}>📍 {selectedScreen.city}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0', padding: '10px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Est. Impressions</p>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a' }}>{selectedScreen.impressions}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Daily Rate</p>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a' }}>₹{selectedScreen.price}</p>
                </div>
              </div>

              <button onClick={() => addToCart(selectedScreen)} style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                + Add to Plan
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '8px', color: '#94a3b8' }}>
              <p style={{ fontSize: '30px', margin: '0 0 10px 0' }}>🗺️</p>
              <p style={{ margin: 0 }}>Click a purple marker on the map to view screen details and pricing.</p>
            </div>
          )}

          {cart.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Your Plan ({cart.length})</h3>
              {cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <span style={{ color: '#334155' }}>{item.name}</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '25px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px' }}>
            <span style={{ color: '#64748b' }}>Total Cost:</span>
            <span style={{ fontWeight: '900', color: '#0f172a' }}>₹{cartTotal.toLocaleString()}</span>
          </div>
          <button disabled={cart.length === 0} style={{ width: '100%', backgroundColor: cart.length > 0 ? '#10b981' : '#cbd5e1', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: cart.length > 0 ? 'pointer' : 'not-allowed', fontSize: '16px' }}>
            Submit Request for Proposal
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: The Native Mapbox Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}