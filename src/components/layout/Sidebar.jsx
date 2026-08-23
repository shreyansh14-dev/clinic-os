import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarPlus, CalendarCheck, FileText, TestTube2,
  Receipt, HeartPulse, Pill, ShieldAlert, Stethoscope,
  Activity, Bed, ShieldCheck, Syringe, Siren, Droplet, FlaskConical, Building2
} from 'lucide-react';

/* ── Sidebar nav images per item ── */
const NAV_IMAGES = {
  '/':                 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=60&h=60&fit=crop&auto=format',
  '/book-appointment': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&auto=format',
  '/my-appointments':  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=60&h=60&fit=crop&auto=format',
  '/lab-tests':        'https://images.unsplash.com/photo-1559757175-7cb036db33b9?w=60&h=60&fit=crop&auto=format',
  '/medical-records':  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=60&h=60&fit=crop&auto=format',
  '/diagnostic-tests': 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=60&h=60&fit=crop&auto=format',
  '/bills':            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=60&h=60&fit=crop&auto=format',
  '/insurance-claims': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=60&h=60&fit=crop&auto=format',
  '/health-tracker':   'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=60&h=60&fit=crop&auto=format',
  '/my-meds':          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60&h=60&fit=crop&auto=format',
  '/vaccines':         'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=60&h=60&fit=crop&auto=format',
  '/emergency-sos':    'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=60&h=60&fit=crop&auto=format',
};

export const Sidebar = () => {
  const { currentRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const patientNav = [
    { path: '/',                 label: 'Dashboard',           icon: LayoutDashboard },
    { path: '/book-appointment', label: 'Book Appointment',    icon: CalendarPlus    },
    { path: '/my-appointments',  label: 'My Appointments',     icon: CalendarCheck   },
    { path: '/lab-tests',        label: 'Lab Tests at Home',   icon: FlaskConical    },
    { path: '/medical-records',  label: 'Medical Records',     icon: FileText        },
    { path: '/diagnostic-tests', label: 'My Lab Reports',      icon: TestTube2       },
    { path: '/bills',            label: 'Bills & Receipts',    icon: Receipt         },
    { path: '/insurance-claims', label: 'Insurance Claims',    icon: ShieldCheck     },
    { path: '/health-tracker',   label: 'Health Vitals Log',   icon: HeartPulse      },
    { path: '/my-meds',          label: 'Meds Schedule',       icon: Pill            },
    { path: '/vaccines',         label: 'Vaccine Passport',    icon: Syringe         },
    { path: '/emergency-sos',    label: '108 SOS Ambulance',   icon: Siren           },
  ];

  const doctorNav = [
    { path: '/doctor-console',      label: 'Doctor Console',       icon: LayoutDashboard },
    { path: '/doctor-appointments', label: 'Consultation Queue',   icon: CalendarCheck   },
    { path: '/emr-timeline',        label: 'Patient EMR Records',  icon: FileText        },
    { path: '/create-prescription', label: 'Issue Digital Rx',     icon: Stethoscope     },
    { path: '/ipd-rounds',          label: 'Ward Rounds (IPD)',    icon: Bed             },
    { path: '/lab-tests-review',    label: 'Diagnostic Reports',   icon: TestTube2       },
  ];

  const adminNav = [
    { path: '/admin',               label: 'Authority Dashboard',  icon: LayoutDashboard },
    { path: '/bed-management',      label: 'IPD Ward & Beds',      icon: Bed             },
    { path: '/insurance-approvals', label: 'TPA Insurance Desk',   icon: ShieldCheck     },
    { path: '/manage-doctors',      label: 'Doctor & Staff Roster',icon: Stethoscope     },
    { path: '/manage-departments',  label: 'Departments & Fees',   icon: Building2       },
    { path: '/system-invoices',     label: 'Financial Ledger',     icon: Receipt         },
    { path: '/blood-bank',          label: 'Blood Bank Stock',     icon: Droplet         },
    { path: '/ambulance-fleet',     label: 'Ambulance Fleet',      icon: Siren           },
    { path: '/audit-logs',          label: 'Security Audit Logs',  icon: ShieldAlert     },
  ];

  const navItems = currentRole === 'doctor' ? doctorNav
    : currentRole === 'admin'  ? adminNav
    : patientNav;

  const roleConfig = {
    patient: { label: 'Patient Hub',       dot: '#34d399' },
    doctor:  { label: 'Doctor Workspace',  dot: '#60a5fa' },
    admin:   { label: 'Admin Control',     dot: '#f59e0b' },
  };
  const rc = roleConfig[currentRole];

  return (
    <aside style={{
      width: '230px', minWidth: '230px',
      background: 'linear-gradient(180deg,#0f172a 0%,#0a1020 100%)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', flexShrink: 0,
    }}>

      {/* Role badge */}
      <div style={{ padding: '1rem 0.85rem 0.5rem', flexShrink: 0 }}>
        <div style={{
          padding: '0.5rem 0.85rem',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.65rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: rc.dot, boxShadow: `0 0 8px ${rc.dot}`, flexShrink: 0 }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#e2e8f0' }}>
            {rc.label}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.4rem 0.7rem 1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          const img = NAV_IMAGES[path];
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '0.65rem',
                border: 'none', width: '100%', textAlign: 'left',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '0.78rem',
                fontWeight: isActive ? 800 : 600,
                transition: 'all 0.15s ease',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? '#ffffff' : '#cbd5e1',           // ← BRIGHT text
                borderLeft: isActive ? '3px solid #ffffff' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; } }}
            >
              {/* Small thumbnail image on hover/active, icon otherwise */}
              {isActive && img ? (
                <img
                  src={img}
                  alt={label}
                  style={{ width: 22, height: 22, borderRadius: '0.35rem', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}
                  onError={e => e.target.style.display = 'none'}
                />
              ) : (
                <Icon size={14} style={{ color: isActive ? '#ffffff' : '#94a3b8', flexShrink: 0 }} />
              )}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer branding */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.7rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <Activity size={11} style={{ color: '#34d399' }} /> ClinicOS
          </div>
          <p style={{ fontSize: '0.6rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>Smart Healthcare & EMR Platform</p>
        </div>
      </div>
    </aside>
  );
};
