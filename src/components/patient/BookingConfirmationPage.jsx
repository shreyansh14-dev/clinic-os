import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, MapPin, Download, Stethoscope, ArrowLeft, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingConfirmationPage = ({ appointment: propAppointment }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = propAppointment || location.state?.appointment;

  useEffect(() => {
    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
  }, []);

  const tokenNumber = `OPD-TK-${Math.floor(1000 + Math.random() * 9000)}`;

  if (!appointment) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', background: 'white', border: '1px solid #e2e8f0', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.5rem 0' }}>No Booking Found</h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>Please complete a booking first.</p>
        <button
          onClick={() => navigate('/book-appointment')}
          style={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '0.65rem', padding: '0.7rem 1.5rem', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}
        >
          Book Appointment
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <button
        onClick={() => navigate('/my-appointments')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '700', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <ArrowLeft size={15} /> Back to My Appointments
      </button>

      {/* Success Card */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', border: '1px solid #bbf7d0' }}>
            <CheckCircle2 size={38} style={{ color: '#16a34a' }} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '0.3rem 1rem', fontSize: '0.7rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            OPD Booking Confirmed & Verified
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.35rem 0' }}>Appointment Successfully Booked!</h1>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Your appointment is registered with ClinicOS Smart Hospital EMR System.</p>
        </div>

        {/* OPD Token Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          borderRadius: '1.15rem', padding: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1.5rem', color: 'white', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>OPD Queue Token Number</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{tokenNumber}</div>
            <div style={{ fontSize: '0.7rem', color: '#bfdbfe', marginTop: '0.25rem' }}>Show this token at the OPD Reception Desk</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.85rem', padding: '0.85rem 1.25rem', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: '800' }}>Payment</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#4ade80' }}>PAID ✓</div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Doctor */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '0.75rem' }}>Attending Specialist</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {appointment.doctorAvatar ? (
                <img src={appointment.doctorAvatar} alt={appointment.doctorName} style={{ width: '50px', height: '50px', borderRadius: '0.65rem', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
              ) : (
                <div style={{ width: '50px', height: '50px', borderRadius: '0.65rem', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={22} style={{ color: 'white' }} />
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0f172a' }}>{appointment.doctorName}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>{appointment.specialty}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.15rem' }}>OPD Block A • Room 104</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '0.75rem' }}>Date & Slot Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#0f172a' }}>
                <Calendar size={14} style={{ color: '#0f172a' }} /> {appointment.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#0f172a' }}>
                <Clock size={14} style={{ color: '#0f172a' }} /> {appointment.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                <MapPin size={14} /> ClinicOS Central Hospital, Mumbai
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '0.85rem' }}>Transaction Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
            {[
              ['Patient', appointment.patientName || 'Patient'],
              ['Transaction ID', appointment.transactionId || 'N/A'],
              ['Payment Method', appointment.paymentMethod || 'Counter'],
              ['Consultation Fee', `₹${appointment.fee || 0}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>{label}:</span>
                <span style={{ fontWeight: '800', color: '#0f172a' }}>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem' }}>
              <span style={{ fontWeight: '900', color: '#0f172a' }}>Total Paid:</span>
              <span style={{ fontWeight: '900', color: '#0f172a', fontSize: '1rem' }}>₹{appointment.fee || 0}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => alert('Invoice PDF downloaded!')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '0.65rem', padding: '0.65rem 1.25rem', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer' }}
          >
            <Download size={15} /> Download Invoice PDF
          </button>
          <button
            onClick={() => navigate('/my-appointments')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '0.65rem', padding: '0.65rem 1.5rem', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer' }}
          >
            <Receipt size={15} /> View All Appointments
          </button>
        </div>
      </div>
    </div>
  );
};
