import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [activeTab, setActiveTab] = useState('BOOKING'); 
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://hydravision-api.onrender.com/api/admin/all');
      setBookings(response.data);
    } catch (error) {
      console.error("Error connecting to Spring Boot:", error);
    }
  };

  const approveBooking = async (id) => {
    try {
      await axios.put('https://hydravision-api.onrender.com/api/admin/approve/${id}');
      fetchBookings();
    } catch (error) {
      alert("Database update failed!");
    }
  };

  const rejectBooking = async (id) => {
    try {
        await axios.put('https://hydravision-api.onrender.com/api/admin/reject/${id}');
        fetchBookings();
    } catch (error) {
        alert("Database update failed!");
    }
  };

  const deleteBooking = async (id) => {
    // Adding a quick confirmation popup so you don't delete by accident!
    if (window.confirm("Are you sure you want to permanently delete this ad?")) {
      try {
          await axios.delete('https://hydravision-api.onrender.com/api/admin/delete/${id}');
          fetchBookings(); // Refresh the screen
      } catch (error) {
          alert("Failed to delete the ad from the database.");
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ backgroundColor: '#0f172a', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#38bdf8', margin: 0, letterSpacing: '2px' }}>⚡ HYDRAVISION</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('BOOKING')} style={navBtnStyle(activeTab === 'BOOKING')}>+ Book Ad</button>
          <button onClick={() => setActiveTab('ADMIN')} style={navBtnStyle(activeTab === 'ADMIN')}>Admin Panel</button>
          <button onClick={() => setActiveTab('BILLBOARD')} style={{ ...navBtnStyle(activeTab === 'BILLBOARD'), backgroundColor: activeTab === 'BILLBOARD' ? '#22c55e' : '#1e293b' }}>Live Billboard</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'BOOKING' && <BookingForm onSuccess={() => { fetchBookings(); setActiveTab('ADMIN'); }} />}
        {activeTab === 'ADMIN' && <AdminPanel bookings={bookings} onApprove={approveBooking} onReject={rejectBooking} onDelete={deleteBooking} />}
        {activeTab === 'BILLBOARD' && <BillboardSimulator bookings={bookings.filter(b => b.status === 'APPROVED')} />}
      </div>
    </div>
  );
}

// ==========================================
// 1. THE BOOKING PAGE (Dynamic DOOH Pricing)
// ==========================================
function BookingForm({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [timeSlot, setTimeSlot] = useState('18:00 - 19:00 (Evening Prime)');
  const [loading, setLoading] = useState(false);

  // Dynamic pricing logic (Hyderabad Traffic Simulation)
  const getPriceForSlot = (slot) => {
    if (slot.includes('18:00') || slot.includes('19:00')) return 5000; // Peak Evening Traffic (Jubilee Hills)
    if (slot.includes('09:00') || slot.includes('10:00')) return 4000; // Peak Morning Commute (Madhapur)
    if (slot.includes('14:00')) return 1500; // Afternoon Lull
    return 1000; // Base rate
  };

  const currentPrice = getPriceForSlot(timeSlot);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload your brand's ad image!");
    setLoading(true);

    const formData = new FormData();
    formData.append('userId', 1); 
    formData.append('screenId', 1); 
    formData.append('timeSlot', timeSlot);
    formData.append('amountPaid', currentPrice); // Sending the dynamic price to Java!
    formData.append('imageFile', file);

    try {
      await axios.post('https://hydravision-api.onrender.com/api/bookings/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Payment Successful! Ad submitted for review.');
      onSuccess();
    } catch (error) {
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '5px' }}>Book Screen: Jubilee Hills Checkpost</h2>
      <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>Estimated impressions: 12,000 cars/hour</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>Select Time Slot</label>
          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px' }}>
            <option>09:00 - 10:00 (Morning Rush)</option>
            <option>14:00 - 15:00 (Afternoon Lull)</option>
            <option>18:00 - 19:00 (Evening Prime)</option>
            <option>19:00 - 20:00 (Evening Prime)</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>Upload Creative (1920x1080)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px dashed #cbd5e1', borderRadius: '6px' }} />
        </div>

        {/* Dynamic Price Display */}
        <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #22c55e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#166534', fontWeight: 'bold' }}>Total Cost:</span>
          <span style={{ color: '#15803d', fontSize: '24px', fontWeight: '900' }}>₹{currentPrice.toLocaleString()}</span>
        </div>

        <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: loading ? '#94a3b8' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Processing Transaction...' : `Pay ₹${currentPrice.toLocaleString()} & Broadcast`}
        </button>
      </form>
    </div>
  );
}

// ==========================================
// 2. ADMIN PANEL COMPONENT (With Revenue Dashboard)
// ==========================================
function AdminPanel({ bookings, onApprove, onReject, onDelete }) {
  // --- CALCULATE REVENUE ---
  // This looks at all 'APPROVED' bookings and adds up their 'amountPaid'
  const totalRevenue = bookings
    .filter(b => b.status === 'APPROVED')
    .reduce((sum, booking) => sum + booking.amountPaid, 0);

  return (
    <div>
      {/* 🚀 The Revenue KPI Card */}
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Approved Revenue</h3>
          <h1 style={{ margin: 0, fontSize: '36px', color: '#22c55e' }}>₹{totalRevenue.toLocaleString()}</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '14px' }}>Active Screen</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Jubilee Hills Checkpost</p>
        </div>
      </div>

      <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b' }}>Ad Review Queue</h2>
      
      {bookings.length === 0 ? (
        <p>No ads in database. Go to 'Book Ad' to create one!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <img src={`https://hydravision-api.onrender.com/uploads/${booking.imagePath}`} alt="Ad" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#334155' }}>{booking.timeSlot.split(' ')[0]}</span>
                  <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>₹{booking.amountPaid?.toLocaleString()}</span>
                </div>
                
                <p style={{ margin: '0 0 15px 0' }}>
                  <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: booking.status === 'APPROVED' ? '#dcfce7' : booking.status === 'REJECTED' ? '#fee2e2' : '#fef3c7', color: booking.status === 'APPROVED' ? '#166534' : booking.status === 'REJECTED' ? '#991b1b' : '#92400e' }}>
                    {booking.status}
                  </span>
                </p>

                {/* Always show the Delete button, no matter the status */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                  {booking.status === 'PENDING' && (
                    <>
                      <button onClick={() => onApprove(booking.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                      <button onClick={() => onReject(booking.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                    </>
                  )}
                  {/* The new Trash button */}
                  <button onClick={() => onDelete(booking.id)} style={{ padding: '8px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. BILLBOARD SIMULATOR COMPONENT
// ==========================================
function BillboardSimulator({ bookings }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (bookings.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bookings.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [bookings.length]);

  if (bookings.length === 0) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>No approved ads to display.</h3>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '900px', height: '500px', backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '12px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <img src={'https://hydravision-api.onrender.com/uploads/${bookings[currentIndex].imagePath}'} alt="Live Ad" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px', animation: 'pulse 2s infinite' }}>LIVE</div>
      </div>
      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
    </div>
  );
}

// --- HELPER STYLES ---
const navBtnStyle = (isActive) => ({
  padding: '8px 16px', cursor: 'pointer', border: 'none', borderRadius: '6px', fontWeight: 'bold', transition: '0.2s',
  backgroundColor: isActive ? '#38bdf8' : '#1e293b', color: isActive ? '#0f172a' : '#f8fafc'
});