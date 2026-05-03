import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BillboardCropper from './components/BillboardCropper'; 
import MapDashboard from './components/MapDashboard';
import { Toaster, toast } from 'react-hot-toast';

// 1. WE IMPORT THE CLERK BOUNCERS HERE
import { SignedIn, SignedOut, SignInButton, UserButton, RedirectToSignIn, useUser, useAuth } from '@clerk/clerk-react';

export default function App() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://hydravision-api.onrender.com/api/bookings/all');
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
        
        {/* THE TOAST NOTIFICATION PROVIDER */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Navigation Bar */}
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

            {/* 2. CLERK LOGIN BUTTONS INJECTED HERE */}
            <div style={{ borderLeft: '2px solid #eaeaea', paddingLeft: '20px', display: 'flex', alignItems: 'center' }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{ background: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

          </div>
        </nav>

        {/* The Router Switchboard */}
        <Routes>
          <Route path="/" element={<HeroLandingPage />} />
          <Route path="/book" element={<BookingSelection />} />
          <Route path="/express" element={<ExpressBookingView fetchBookings={fetchBookings} />} />
          <Route path="/pro" element={<ProDashboardView />} />
          <Route path="/map" element={<MapDashboard />} />
          <Route path="/live" element={<BillboardSimulator bookings={bookings.filter(b => b.status === 'APPROVED')} />} />
          
          {/* 3. THE ADMIN GATEKEEPER */}
          <Route path="/admin" element={
            <>
              <SignedIn>
                {/* If logged in, show the Admin Panel */}
                <AdminWrapper bookings={bookings} fetchBookings={fetchBookings} />
              </SignedIn>
              
              <SignedOut>
                {/* If NOT logged in, kick them to the login screen */}
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
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
// COMPONENTS
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

function BookingSelection() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', minHeight: '60vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '40px' }}>Step 1: Select a Booking</h1>
        
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div onClick={() => navigate('/express')} style={{ flex: 1, minWidth: '300px', backgroundColor: '#d30000', color: '#fff', padding: '50px 30px', borderRadius: '8px', cursor: 'pointer' }}>
            <p style={{ letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '15px' }}>OPTION 1</p>
            <h2 style={{ fontSize: '2rem', lineHeight: '1.2', marginBottom: '20px' }}>I want to share<br/>my photo or video<br/>on the billboard</h2>
            <p style={{ fontSize: '1.2rem' }}>Starting at ₹500</p>
          </div>

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
// 3. THE B2C EXPRESS FLOW (The Cropper) - SECURED
// ==========================================
function ExpressBookingView({ fetchBookings }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // 1. ADDED getToken HERE to get the VIP pass
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth(); 

  const handleCheckout = async (croppedFile) => {
    if (!isSignedIn) {
      toast.error("Please sign in at the top right before submitting your ad.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    formData.append('userId', 999);
    formData.append('screenId', 1); 
    formData.append('timeSlot', 'Flash 15 Seconds (Express)'); 
    formData.append('amountPaid', 500); 
    formData.append('imageFile', croppedFile);

    try {
      // 1. Fetch the secure Clerk Token
      const token = await getToken();

      // 2. Send the request
      await axios.post('https://hydravision-api.onrender.com/api/bookings/create', formData, {
        headers: { 
          // We DELETED the 'Content-Type' line here!
          'Authorization': `Bearer ${token}` // Keep the security pass
        }                                                
      });
      
      toast.success('Payment Successful! Ad submitted.');
      fetchBookings();
      navigate('/live');
    } catch (error) {
      toast.error('Error connecting to backend. Check console.');
      console.error(error);
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

function ProDashboardView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your work email to continue.");
      return;
    }
    navigate('/map');
  };

  return (
    <div style={{ backgroundColor: '#eff6ff', minHeight: '100vh', paddingBottom: '100px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'center', gap: '40px', backgroundColor: '#eff6ff', fontWeight: 'bold', color: '#475569', fontSize: '14px' }}>
        <span style={{ cursor: 'pointer' }}>Products ˅</span>
        <span style={{ cursor: 'pointer' }}>Solutions ˅</span>
        <span style={{ cursor: 'pointer' }}>Company ˅</span>
        <span style={{ cursor: 'pointer' }}>Resources ˅</span>
      </div>

      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '60px auto 40px', padding: '0 20px' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#1e40af', lineHeight: '1.2', marginBottom: '20px', fontWeight: '800' }}>
          The Intelligence Platform for<br/>OOH Advertising
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#3b82f6', marginBottom: '40px', fontWeight: '500' }}>
          Plan smarter. Buy faster. Measure everything. One platform connecting you to 1,700+ media partners across India.
        </p>

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

function AdminWrapper({ bookings, fetchBookings }) {
  const { getToken } = useAuth();
  const [proposals, setProposals] = useState([]);

  const fetchProposals = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('https://hydravision-api.onrender.com/api/proposals/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(res.data);
    } catch (e) { 
      console.error("Failed to fetch proposals", e); 
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // --- NEW: B2B Proposal Actions ---
  const approveProposal = async (id) => {
    try {
      const token = await getToken();
      await axios.put(`https://hydravision-api.onrender.com/api/proposals/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProposals(); 
      toast.success("Enterprise deal approved!");
    } catch (e) { toast.error("Failed to approve proposal."); console.error(e); }
  };

  const rejectProposal = async (id) => {
    if (window.confirm("Are you sure you want to reject this enterprise deal?")) {
      try {
        const token = await getToken();
        await axios.put(`https://hydravision-api.onrender.com/api/proposals/reject/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProposals(); 
        toast.success("Proposal rejected.");
      } catch (e) { toast.error("Failed to reject proposal."); console.error(e); }
    }
  };

  // --- EXISTING: B2C Booking Actions ---
  const approveBooking = async (id) => {
    try { 
      const token = await getToken();
      await axios.put(`https://hydravision-api.onrender.com/api/bookings/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` } 
      }); 
      fetchBookings(); 
      toast.success("B2C Ad approved!");
    } catch (e) { toast.error("Failed to approve."); console.error(e); }
  };
  
  const rejectBooking = async (id) => {
    try { 
      const token = await getToken();
      await axios.put(`https://hydravision-api.onrender.com/api/bookings/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` } 
      }); 
      fetchBookings(); 
      toast.success("B2C Ad rejected.");
    } catch (e) { toast.error("Failed to reject."); console.error(e); }
  };
  
  const deleteBooking = async (id) => {
    if (window.confirm("Delete this ad?")) {
      try { 
        const token = await getToken();
        await axios.delete(`https://hydravision-api.onrender.com/api/bookings/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` } 
        }); 
        fetchBookings(); 
        toast.success("Record deleted successfully.");
      } catch (e) { toast.error("Failed to delete."); console.error(e); }
    }
  };
  
  return <AdminPanel 
    bookings={bookings} proposals={proposals} 
    onApprove={approveBooking} onReject={rejectBooking} onDelete={deleteBooking} 
    onApproveProposal={approveProposal} onRejectProposal={rejectProposal} 
  />;
}

function AdminPanel({ bookings, proposals, onApprove, onReject, onDelete, onApproveProposal, onRejectProposal }) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeProposals = Array.isArray(proposals) ? proposals : [];

  // Calculate total revenues
  const totalB2CRevenue = safeBookings.filter(b => b?.status === 'APPROVED').reduce((sum, b) => sum + (b?.amountPaid || 0), 0);
  const totalB2BRevenue = safeProposals.filter(p => p?.status === 'APPROVED').reduce((sum, p) => sum + (p?.totalCost || 0), 0);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Revenue Dashboard */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px', letterSpacing: '1px' }}>APPROVED B2C REVENUE</h3>
          <h1 style={{ margin: 0, fontSize: '36px', color: '#0f172a' }}>₹{totalB2CRevenue.toLocaleString()}</h1>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px', letterSpacing: '1px' }}>APPROVED B2B REVENUE</h3>
          <h1 style={{ margin: 0, fontSize: '36px', color: '#10b981' }}>₹{totalB2BRevenue.toLocaleString()}</h1>
        </div>
      </div>

      {/* B2B Enterprise Proposals Section */}
      <h2 style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '10px', color: '#0f172a' }}>Enterprise B2B Proposals</h2>
      {safeProposals.length === 0 ? <p style={{ color: '#64748b' }}>No B2B proposals received yet.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '50px' }}>
          {safeProposals.map((prop) => (
            <div key={prop.id} style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '18px' }}>{prop.agencyEmail}</h3>
                <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px' }}><b>Targeted Inventory:</b> {prop.selectedScreens}</p>
                <span style={{ 
                  backgroundColor: prop.status === 'APPROVED' ? '#dcfce7' : prop.status === 'REJECTED' ? '#fee2e2' : '#e2e8f0', 
                  color: prop.status === 'APPROVED' ? '#166534' : prop.status === 'REJECTED' ? '#991b1b' : '#334155',
                  padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' 
                }}>
                  {prop.status}
                </span>
              </div>
              <div style={{ textAlign: 'right', minWidth: '200px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proposal Value</p>
                <h2 style={{ margin: '0 0 15px 0', color: '#10b981', fontSize: '28px' }}>₹{prop.totalCost?.toLocaleString()}</h2>
                
                {/* Action Buttons for Pending Proposals */}
                {prop.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => onApproveProposal(prop.id)} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                    <button onClick={() => onRejectProposal(prop.id)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing B2C Review Queue */}
      <h2 style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '10px', color: '#0f172a' }}>B2C Ad Review Queue</h2>
      {safeBookings.length === 0 ? <p style={{ color: '#64748b' }}>No B2C ads in database.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {safeBookings.map((booking) => (
            <div key={booking.id} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <img src={booking?.imagePath || 'https://via.placeholder.com/300'} alt="Ad" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{booking?.timeSlot ? booking.timeSlot.split(' ')[0] : 'Anytime'}</p>
                  <p style={{ margin: 0, fontWeight: '900', color: '#0f172a', fontSize: '18px' }}>₹{booking?.amountPaid || 0}</p>
                </div>
                <p style={{ margin: '0 0 15px 0', fontSize: '12px', fontWeight: 'bold', color: booking?.status === 'APPROVED' ? '#10b981' : booking?.status === 'REJECTED' ? '#ef4444' : '#f59e0b' }}>
                  STATUS: {booking?.status || 'UNKNOWN'}
                </p>
                {booking?.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button onClick={() => onApprove(booking.id)} style={{ flex: 1, padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                    <button onClick={() => onReject(booking.id)} style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', fontWeight: 'bold' }}>Reject</button>
                  </div>
                )}
                <button onClick={() => onDelete(booking.id)} style={{ width: '100%', padding: '10px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>Delete Record</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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