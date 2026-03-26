import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BillboardCropper from './components/BillboardCropper'; 
import MapDashboard from './components/MapDashboard'; // The new Mapbox component!

export default function App() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://hydravision-api.onrender.com/api/admin/all');
      setBookings(response.data);
    } catch (error) {
      console.error("Error connecting to Spring Boot:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Router>
      <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000' }}>
        
        {/* White E-commerce Navigation Bar (TimesSquareBillboard style) */}
        <nav style={{ backgroundColor: '#ffffff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 100 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>
              WELCOME TO<br/><span style={{ fontSize: '18px', fontWeight: 'normal' }}>HYDRAVISION.COM</span>
            </h2>
          </Link>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', fontWeight: 'bold', fontSize: '15px' }}>
            <Link to="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
            <Link to="/live" style={{ color: '#000', textDecoration: 'none' }}>Live Stream</Link>
            <Link to="/admin" style={{ color: '#000', textDecoration: 'none' }}>Admin</Link>
            <Link to="/book" style={{ padding: '12px 24px', backgroundColor: '#d30000', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
              BOOK NOW 📅
            </Link>
          </div>
        </nav>

        {/* The Router Switchboard */}
        <Routes>
          <Route path="/" element={<HeroLandingPage />} />
          <Route path="/book" element={<BookingSelection />} />
          <Route path="/express" element={<ExpressBookingView fetchBookings={fetchBookings} />} />
          <Route path="/pro" element={<ProDashboardView />} />
          <Route path="/map" element={<MapDashboard />} />
          <Route path="/admin" element={<AdminWrapper bookings={bookings} fetchBookings={fetchBookings} />} />
          <Route path="/live" element={<BillboardSimulator bookings={bookings.filter(b => b.status === 'APPROVED')} />} />
        </Routes>
        
        {/* Simple Footer */}
        <footer style={{ backgroundColor: '#000', color: '#fff', padding: '40px', textAlign: 'center', marginTop: 'auto' }}>
          <p>© 2026 Welcome to HydraVision | All Rights Reserved</p>
        </footer>
      </div>
    </Router>
  );
}

// ==========================================
// 1. THE HERO LANDING PAGE (TimesSquare Clone)
// ==========================================
function HeroLandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1920&auto=format&fit=crop")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        height: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 10%' 
      }}>
        <h1 style={{ color: '#fff', fontSize: '4rem', maxWidth: '800px', lineHeight: '1.2', marginBottom: '20px' }}>
          See yourself and your loved ones on a massive billboard in Hyderabad for ₹500!
        </h1>
        <div>
          <button onClick={() => navigate('/book')} style={{ padding: '15px 30px', backgroundColor: 'transparent', color: '#fff', border: '2px solid #fff', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
            BOOK NOW →
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Don't be a face in the crowd™</h2>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
          Experience the magic of Hyderabad like you've never before. See yourself and your loved ones on a massive billboard at Jubilee Hills Checkpost.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 2. THE BOOKING SELECTION PAGE
// ==========================================
function BookingSelection() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', minHeight: '60vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '40px' }}>Step 1: Select a Booking</h1>
        
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* OPTION 1: B2C Tourist/Personal (RED BOX) */}
          <div onClick={() => navigate('/express')} style={{ flex: 1, minWidth: '300px', backgroundColor: '#d30000', color: '#fff', padding: '50px 30px', borderRadius: '8px', cursor: 'pointer' }}>
            <p style={{ letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '15px' }}>OPTION 1</p>
            <h2 style={{ fontSize: '2rem', lineHeight: '1.2', marginBottom: '20px' }}>I want to share<br/>my photo or video<br/>on the billboard</h2>
            <p style={{ fontSize: '1.2rem' }}>Starting at ₹500</p>
          </div>

          {/* OPTION 2: B2B Brand/Agency (GRAY BOX) */}
          <div onClick={() => navigate('/pro')} style={{ flex: 1, minWidth: '300px', backgroundColor: '#f4f4f4', color: '#000', padding: '50px 30px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ddd' }}>
            <p style={{ letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '15px', color: '#666' }}>OPTION 2</p>
            <h2 style={{ fontSize: '2rem', lineHeight: '1.2', marginBottom: '20px' }}>I want to promote<br/>my brand<br/>on the billboard</h2>
            <p style={{ fontSize: '1.2rem', color: '#444' }}>Starting at ₹5,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. THE B2C EXPRESS FLOW (The Cropper)
// ==========================================
function ExpressBookingView({ fetchBookings }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (croppedFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('userId', 1);
    formData.append('screenId', 1);
    formData.append('timeSlot', 'Flash 15 Seconds (Express)'); 
    formData.append('amountPaid', 500); 
    formData.append('imageFile', croppedFile);

    try {
      await axios.post('https://hydravision-api.onrender.com/api/bookings/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Payment Successful! Ad submitted to the big screen.');
      fetchBookings();
      navigate('/live');
    } catch (error) {
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>Upload Your Memory</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>Jubilee Hills Checkpost • ₹500 for 15 Seconds</p>
      
      {loading ? (
        <div style={{ padding: '50px', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
          <h2>Processing Transaction...</h2>
        </div>
      ) : (
        <BillboardCropper onCropComplete={handleCheckout} />
      )}
    </div>
  );
}

// ==========================================
// 4. THE B2B "ADQUICK" VIEW (AdQuick Clone)
// ==========================================
function ProDashboardView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your work email to continue.");
    navigate('/map'); // Instantly transports them to the 3D map!
  };

  return (
    <div style={{ backgroundColor: '#eff6ff', minHeight: '100vh', paddingBottom: '100px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      
      {/* AdQuick Style Sub-Navbar */}
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'center', gap: '40px', backgroundColor: '#eff6ff', fontWeight: 'bold', color: '#475569', fontSize: '14px' }}>
        <span style={{ cursor: 'pointer' }}>Products ˅</span>
        <span style={{ cursor: 'pointer' }}>Solutions ˅</span>
        <span style={{ cursor: 'pointer' }}>Company ˅</span>
        <span style={{ cursor: 'pointer' }}>Resources ˅</span>
      </div>

      {/* AdQuick Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '60px auto 40px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#1e40af', lineHeight: '1.2', marginBottom: '20px', fontWeight: '800' }}>
          The Intelligence Platform for<br/>OOH Advertising
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#3b82f6', marginBottom: '40px', fontWeight: '500' }}>
          Plan smarter. Buy faster. Measure everything. One platform connecting you to 1,700+ media partners across India.
        </p>

        {/* The Magic Email Input Form */}
        <form onSubmit={handleGetStarted} style={{ display: 'flex', backgroundColor: 'white', padding: '8px', borderRadius: '30px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)' }}>
          <input 
            type="email" 
            placeholder="Your work email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, border: 'none', padding: '15px 20px', borderRadius: '30px', outline: 'none', fontSize: '16px' }}
          />
          <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '25px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.2s' }}>
            Get Started
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <p>Enter your email to launch the Enterprise Mapbox Dashboard.</p>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADMIN WRAPPER & PANEL
// ==========================================
function AdminWrapper({ bookings, fetchBookings }) {
  const approveBooking = async (id) => {
    try { await axios.put(`https://hydravision-api.onrender.com/api/admin/approve/${id}`); fetchBookings(); } catch (e) { alert("Failed"); }
  };
  const rejectBooking = async (id) => {
    try { await axios.put(`https://hydravision-api.onrender.com/api/admin/reject/${id}`); fetchBookings(); } catch (e) { alert("Failed"); }
  };
  const deleteBooking = async (id) => {
    if (window.confirm("Delete this ad?")) {
      try { await axios.delete(`https://hydravision-api.onrender.com/api/admin/delete/${id}`); fetchBookings(); } catch (e) { alert("Failed"); }
    }
  };
  return <AdminPanel bookings={bookings} onApprove={approveBooking} onReject={rejectBooking} onDelete={deleteBooking} />;
}

function AdminPanel({ bookings, onApprove, onReject, onDelete }) {
  const totalRevenue = bookings.filter(b => b.status === 'APPROVED').reduce((sum, booking) => sum + booking.amountPaid, 0);
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', border: '1px solid #ddd' }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>TOTAL APPROVED REVENUE</h3>
          <h1 style={{ margin: 0, fontSize: '36px', color: '#d30000' }}>₹{totalRevenue.toLocaleString()}</h1>
        </div>
      </div>
      <h2>Ad Review Queue</h2>
      {bookings.length === 0 ? <p>No ads in database.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
              <img src={booking.imagePath} alt="Ad" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <p><b>{booking.timeSlot.split(' ')[0]}</b> | ₹{booking.amountPaid}</p>
                <p>{booking.status}</p>
                {booking.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onApprove(booking.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#000', color: '#fff', border: 'none' }}>Approve</button>
                    <button onClick={() => onReject(booking.id)} style={{ flex: 1, padding: '8px', border: '1px solid #000' }}>Reject</button>
                  </div>
                )}
                <button onClick={() => onDelete(booking.id)} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#d30000', color: 'white', border: 'none' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. BILLBOARD SIMULATOR COMPONENT
// ==========================================
function BillboardSimulator({ bookings }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (bookings.length === 0) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % bookings.length), 3000); 
    return () => clearInterval(interval);
  }, [bookings.length]);

  if (bookings.length === 0) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>No approved ads to display.</h3>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
      <div style={{ width: '100%', maxWidth: '900px', height: '500px', backgroundColor: 'black', position: 'relative' }}>
        <img src={bookings[currentIndex].imagePath} alt="Live Ad" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#d30000', color: 'white', padding: '4px 12px', fontWeight: 'bold' }}>LIVE</div>
      </div>
    </div>
  );
}