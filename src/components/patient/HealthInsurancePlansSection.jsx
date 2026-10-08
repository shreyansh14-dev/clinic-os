import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck, Shield, CheckCircle2, HeartPulse, Clock,
  Sparkles, Plus, X, ChevronRight, Download, Award,
  FileText, Building2, Activity, Phone, Info, Percent,
  Zap, ArrowRight, UserCheck, Stethoscope
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UnifiedPaymentModal } from '../common/UnifiedPaymentModal';

export const HealthInsurancePlansSection = () => {
  const { activePatient, showToast, submitInsuranceClaim } = useApp();
  const navigate = useNavigate();

  // State
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'individual' | 'family' | 'senior' | 'critical'
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [buyPlanModal, setBuyPlanModal] = useState(null);
  const [selectedSumInsuredIdx, setSelectedSumInsuredIdx] = useState({});

  // Checkout Form State
  const [applicantName, setApplicantName] = useState(activePatient?.name || 'Shreyansh Kumar');
  const [applicantAge, setApplicantAge] = useState(activePatient?.age || '29');
  const [applicantPhone, setApplicantPhone] = useState(activePatient?.phone || '+91 91234 56789');
  const [hasPreExisting, setHasPreExisting] = useState(false);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Health Insurance Plans Catalog
  const INSURANCE_PLANS = [
    {
      id: 'plan-star-comp',
      name: 'Star Health Comprehensive Care',
      provider: 'Star Health & Allied Insurance',
      category: 'individual',
      categoryLabel: 'Individual / Couple',
      badge: 'Most Popular • 99.2% Settlement',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      tagline: 'Zero sub-limits on room rent with full consumables protection',
      sumInsuredOptions: [
        { label: '₹10 Lakhs', monthly: 599, annual: 6499 },
        { label: '₹25 Lakhs', monthly: 949, annual: 10299 },
        { label: '₹50 Lakhs', monthly: 1399, annual: 15199 }
      ],
      cashlessHospitals: '14,200+ Hospitals',
      roomRentLimit: 'Single Private A/C Room (No Sub-limit)',
      prePostHosp: '60 Days Pre / 90 Days Post',
      waitingPeriodPED: '24 Months (Fast-Track Add-on available)',
      consumablesCover: '100% Covered (Zero deduction on PPE, gloves, syringes)',
      dayCareProcedures: 'All 405+ Day-Care Procedures Covered',
      freeHealthCheckup: 'Annual Full Body Screening Included (Every Year)',
      opdBenefit: 'Unlimited Free Digital Consults via ClinicOS Network',
      ambulanceCoverage: 'Unlimited Road Ambulance • Air Ambulance up to ₹5L',
      coPay: 'Zero Co-Pay across network hospitals',
      keyPerks: [
        '100% Cashless across all ClinicOS Partner Hospitals',
        'Automatic Restoration of Sum Insured up to 100%',
        'Bariatric Surgery & In-Utero Fetal Surgery Covered',
        'Zero Room Rent capping or proportionate deductions'
      ]
    },
    {
      id: 'plan-hdfc-optima',
      name: 'HDFC ERGO Optima Secure',
      provider: 'HDFC ERGO General Insurance',
      category: 'family',
      categoryLabel: 'Family Floater (2A + 2K)',
      badge: '4X Automatic Cover Doubler',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      tagline: 'Sum insured quadruples automatically with zero extra premium',
      sumInsuredOptions: [
        { label: '₹15 Lakhs (4X: ₹60L)', monthly: 849, annual: 9250 },
        { label: '₹25 Lakhs (4X: ₹1Cr)', monthly: 1299, annual: 14199 },
        { label: '₹50 Lakhs (4X: ₹2Cr)', monthly: 1899, annual: 20799 }
      ],
      cashlessHospitals: '13,500+ Hospitals',
      roomRentLimit: 'Any Room Category (Up to Suite Room)',
      prePostHosp: '60 Days Pre / 180 Days Post (Maximum Coverage)',
      waitingPeriodPED: '36 Months (Can reduce to 12 months with rider)',
      consumablesCover: '100% Covered via Secure Benefit',
      dayCareProcedures: 'All Advanced Minimally Invasive Surgeries Covered',
      freeHealthCheckup: 'Included for all insured family members',
      opdBenefit: '₹5,000 Annual Pharmacy Allowance on ClinicOS',
      ambulanceCoverage: '₹5,00,000 Worldwide Air Ambulance Support',
      coPay: 'Zero Co-Pay anywhere in India',
      keyPerks: [
        'Secure Benefit: 2X cover from Day 1, up to 4X after 2 years',
        'Plus Benefit: 100% additional sum insured on renewals',
        'Protect Benefit: Non-medical expenses & consumables 100% paid',
        'Restore Benefit: 100% Instant Recharge for unrelated claims'
      ]
    },
    {
      id: 'plan-care-supreme',
      name: 'Care Supreme Health Advantage',
      provider: 'Care Health Insurance',
      category: 'individual',
      categoryLabel: '₹1 Crore Super Shield',
      badge: '₹1 Crore Mega Cover • Unlimited Recharge',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      tagline: 'High-value medical security with global emergency hospitalization',
      sumInsuredOptions: [
        { label: '₹50 Lakhs', monthly: 899, annual: 9799 },
        { label: '₹1 Crore', monthly: 1199, annual: 13499 },
        { label: '₹2 Crores', monthly: 1799, annual: 19999 }
      ],
      cashlessHospitals: '16,000+ Hospitals Globally',
      roomRentLimit: 'No Sub-limit / Any Room Category',
      prePostHosp: '60 Days Pre / 90 Days Post',
      waitingPeriodPED: '24 Months',
      consumablesCover: 'Smart Select Add-on (100% Consumables)',
      dayCareProcedures: '540+ Day Care Treatments',
      freeHealthCheckup: 'Complimentary Comprehensive Health Checkup',
      opdBenefit: 'Unlimited OPD Doctor Visits on ClinicOS Platform',
      ambulanceCoverage: 'Air & Road Ambulance 100% Paid',
      coPay: 'No Co-Payment Clause',
      keyPerks: [
        'Cumulative Bonus Super: Up to 500% increase in sum insured',
        'Unlimited Automatic Recharge: Can be utilized multiple times',
        'Coverage for Robotic Surgeries & Modern Stem Cell Therapy',
        'AYUSH (Ayurveda, Yoga, Unani, Homeopathy) 100% covered'
      ]
    },
    {
      id: 'plan-niva-senior',
      name: 'Niva Bupa Senior First Gold',
      provider: 'Niva Bupa Health Insurance',
      category: 'senior',
      categoryLabel: 'Senior Citizen Care (60+ Yrs)',
      badge: 'Senior Care Specialist • Day-1 BP/Sugar Cover',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      tagline: 'Tailored for seniors with pre-existing conditions and home nursing',
      sumInsuredOptions: [
        { label: '₹10 Lakhs', monthly: 1450, annual: 16200 },
        { label: '₹15 Lakhs', monthly: 1990, annual: 22100 },
        { label: '₹25 Lakhs', monthly: 2750, annual: 30500 }
      ],
      cashlessHospitals: '10,500+ Hospitals',
      roomRentLimit: 'Single Private A/C Room',
      prePostHosp: '30 Days Pre / 60 Days Post',
      waitingPeriodPED: 'Day 1 Coverage for Hypertension & Type-2 Diabetes (Add-on)',
      consumablesCover: 'Covered under Senior Gold Rider',
      dayCareProcedures: 'All Day-Care procedures including Dialysis & Chemo',
      freeHealthCheckup: 'Senior Cardiac & Renal Panel included every year',
      opdBenefit: 'Free Geriatric Health Specialist Video Consults',
      ambulanceCoverage: 'Unlimited Emergency Road Ambulance',
      coPay: '20% Co-Pay (Can be waived with Zero Co-pay rider)',
      keyPerks: [
        'No Pre-policy medical tests required up to 65 years',
        'Home Healthcare, Oxygen Concentrators & Nursing Allowance included',
        'Organ Donor Expenses covered up to full Sum Insured',
        'Hassle-free direct TPA cashless clearance in under 30 minutes'
      ]
    },
    {
      id: 'plan-bajaj-critical',
      name: 'Bajaj Allianz Critical Illness & Cardiac Guard',
      provider: 'Bajaj Allianz General Insurance',
      category: 'critical',
      categoryLabel: 'Critical Illness Shield',
      badge: 'Lump-Sum Payout • 36 Critical Illnesses',
      badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      tagline: 'Full sum insured paid in cash upon first diagnosis of severe conditions',
      sumInsuredOptions: [
        { label: '₹20 Lakhs', monthly: 420, annual: 4600 },
        { label: '₹35 Lakhs', monthly: 680, annual: 7500 },
        { label: '₹50 Lakhs', monthly: 950, annual: 10400 }
      ],
      cashlessHospitals: 'Direct Bank Transfer / All Cashless Hospitals',
      roomRentLimit: '100% Lump Sum Cash Payment (No Bills Needed)',
      prePostHosp: 'Independent of Hospitalization Bills',
      waitingPeriodPED: '90 Days Initial Waiting Period',
      consumablesCover: 'Full lump-sum payout to spend freely',
      dayCareProcedures: 'Applicable across 36 Life-Threatening Diseases',
      freeHealthCheckup: 'Annual Lipid, ECG & Cardiac Profile',
      opdBenefit: 'International Second Medical Opinion Included',
      ambulanceCoverage: 'Road & Air Ambulance Allowance Included',
      coPay: 'Zero Co-Pay',
      keyPerks: [
        'Covers Heart Attack, Stroke, Cancer, Bypass Surgery, Kidney Failure',
        'Income Replacement Benefit: Additional ₹25,000/month for 12 months',
        'Zero Deductibles: Full cash disbursed within 48 hours of diagnosis',
        'Tax Benefit under Section 80D up to ₹75,000 per financial year'
      ]
    },
    {
      id: 'plan-clinicos-floater',
      name: 'ClinicOS Group Cashless Health Pass',
      provider: 'ICICI Lombard + ClinicOS Group Network',
      category: 'family',
      categoryLabel: 'Family Floater (Self + Spouse + Kids)',
      badge: 'ClinicOS Preferred • 100% Seamless Network',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      tagline: 'Integrated cashless experience with 15-min medicine refills & lab tests',
      sumInsuredOptions: [
        { label: '₹20 Lakhs', monthly: 999, annual: 10800 },
        { label: '₹35 Lakhs', monthly: 1499, annual: 16400 },
        { label: '₹50 Lakhs', monthly: 1999, annual: 21900 }
      ],
      cashlessHospitals: '15,000+ Hospitals (Priority ClinicOS Desk)',
      roomRentLimit: 'No Cap on Room Rent',
      prePostHosp: '60 Days Pre / 120 Days Post',
      waitingPeriodPED: '24 Months',
      consumablesCover: '100% Consumables Paid by ClinicOS TPA',
      dayCareProcedures: 'All Procedures with Instant Digital Pre-Auth',
      freeHealthCheckup: 'Annual Full Body Lab Test at Home for all 4 members',
      opdBenefit: '₹12,000/year ClinicOS Medicine & Lab Credit Included',
      ambulanceCoverage: '108 Emergency Ambulance 100% Free & Unlimited',
      coPay: 'Zero Co-Pay across all network hospitals',
      keyPerks: [
        'Direct 15-Minute Medicine Delivery Reimbursement (100%)',
        'Instant 15-Minute Cashless TPA Pre-Authorisation at partner hospitals',
        'Maternity & Normal Delivery covered up to ₹75,000 with newborn cover',
        'Dedicated Medical Concierge Manager on call 24/7'
      ]
    }
  ];

  // Filter plans based on category
  const filteredPlans = INSURANCE_PLANS.filter(plan => {
    if (selectedCategory === 'all') return true;
    return plan.category === selectedCategory;
  });

  const getPlanPrice = (plan) => {
    const idx = selectedSumInsuredIdx[plan.id] || 0;
    const option = plan.sumInsuredOptions[idx];
    if (billingPeriod === 'monthly') {
      return { price: option.monthly, period: '/month', sumLabel: option.label };
    }
    return { price: option.annual, period: '/year', sumLabel: option.label };
  };

  const handleSelectSumInsured = (planId, idx) => {
    setSelectedSumInsuredIdx(prev => ({ ...prev, [planId]: idx }));
  };

  const handleOpenBuyModal = (plan) => {
    setBuyPlanModal(plan);
    setGeneratedPolicy(null);
  };

  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) {
      showToast('Please provide applicant name and phone number.', 'warn');
      return;
    }
    // Present dynamic UPI QR payment interface
    setIsPaymentModalOpen(true);
  };

  const handlePaymentDone = (paymentDetails) => {
    const polNo = `POL-COS-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedPolicy(polNo);
    setIsPaymentModalOpen(false);

    // Submit linked policy into AppContext
    submitInsuranceClaim({
      provider: buyPlanModal.provider,
      policyNo: polNo,
      claimAmount: 0,
      preApprovedAmount: 0
    });

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    showToast(`Payment Verified! Health Insurance ${buyPlanModal.name} activated. Policy #${polNo}`);
  };

  return (
    <section className="w-full px-6 sm:px-10 pb-14 font-sans">
      <div className="bg-[#FAFBFD] rounded-[36px] border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* ── TOP SECTION HEADER & STATS ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-black border border-emerald-500/20 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% CASHLESS TPA NETWORK &amp; INSTANT PRE-AUTH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#16163B] m-0 tracking-tight font-heading">
              Health Insurance Plans, Pricing &amp; Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium m-0 mt-1 max-w-2xl leading-relaxed">
              Compare transparent health insurance policies with zero room-rent capping, instant cashless claims at 14,000+ hospitals, and comprehensive maternity, PED &amp; critical illness cover.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Billing Period Toggle */}
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3.5 py-1.5 rounded-xl border-none cursor-pointer transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#16163B] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('annual')}
                className={`px-3.5 py-1.5 rounded-xl border-none cursor-pointer transition-all flex items-center gap-1.5 ${
                  billingPeriod === 'annual'
                    ? 'bg-[#16163B] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-md bg-[#E9DF70] text-[#16163B] text-[9px] font-black">
                  Save 15%
                </span>
              </button>
            </div>

            {/* Manage Active Claims Link */}
            <button
              onClick={() => navigate('/insurance-claims')}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#16163B] hover:text-white text-[#16163B] border border-slate-200 font-extrabold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Manage Claims &amp; TPA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── 3 CORE VALUE PROPOSITION TILES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-black text-slate-900 block">14,000+ Cashless Hospitals</strong>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-snug">
                Admit cashless across all leading hospital chains with zero upfront deposits.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-black text-slate-900 block">30-Minute TPA Pre-Authorisation</strong>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-snug">
                Fast digital pre-auth approvals directly supported by on-site ClinicOS helpdesks.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-black text-slate-900 block">100% Consumables Paid</strong>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5 leading-snug">
                Gloves, oxygen masks, PPE kits, and medical consumables covered with zero deductions.
              </p>
            </div>
          </div>
        </div>

        {/* ── PLAN CATEGORY FILTER TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Insurance Plans (6)' },
            { id: 'individual', label: 'Individual & 1 Cr Shields' },
            { id: 'family', label: 'Family Floater (4 Members)' },
            { id: 'senior', label: 'Senior Citizens (60+ Yrs)' },
            { id: 'critical', label: 'Critical Illness Lump-Sum' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer shrink-0 transition-all ${
                selectedCategory === tab.id
                  ? 'bg-[#16163B] text-white border-[#16163B] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PLANS PRICING & DETAILS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const currentPricing = getPlanPrice(plan);
            const activeIdx = selectedSumInsuredIdx[plan.id] || 0;

            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {plan.categoryLabel}
                    </span>
                  </div>

                  {/* Plan Name & Provider */}
                  <h3 className="text-lg font-black text-slate-900 m-0 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                    {plan.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    By <strong className="text-slate-700">{plan.provider}</strong>
                  </div>

                  {/* Pricing Display */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Starting Premium
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#16163B] font-heading">
                          ₹{currentPricing.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {currentPricing.period}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Sum Insured
                      </span>
                      <span className="text-sm font-black text-emerald-700 block mt-0.5">
                        {currentPricing.sumLabel}
                      </span>
                    </div>
                  </div>

                  {/* Sum Insured Selector Pills */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Select Cover Amount
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {plan.sumInsuredOptions.map((opt, oIdx) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleSelectSumInsured(plan.id, oIdx)}
                          className={`py-1 px-1.5 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                            activeIdx === oIdx
                              ? 'bg-[#16163B] text-white border-[#16163B]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Key Features Checklist */}
                  <div className="mt-5 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>{plan.cashlessHospitals}</strong> Nationwide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Room: <strong>{plan.roomRentLimit}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.prePostHosp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{plan.consumablesCover}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{plan.opdBenefit}</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanDetails(plan)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenBuyModal(plan)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#16163B] hover:bg-slate-800 text-white font-black text-xs border-none transition-colors cursor-pointer text-center shadow-xs"
                  >
                    Get Instant Policy
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── 1. MODAL: FULL POLICY DETAILS & BROCHURE ── */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedPlanDetails.provider}
                </span>
                <h3 className="text-xl font-black text-slate-900 m-0 mt-1.5 font-heading">
                  {selectedPlanDetails.name}
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5 font-medium">
                  {selectedPlanDetails.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlanDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-xl border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-depth Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Cashless Network</span>
                <strong className="text-slate-900 block mt-0.5">{selectedPlanDetails.cashlessHospitals}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Room Rent Limit</span>
                <strong className="text-slate-900 block mt-0.5">{selectedPlanDetails.roomRentLimit}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Pre &amp; Post Hosp</span>
                <strong className="text-slate-900 block mt-0.5">{selectedPlanDetails.prePostHosp}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Co-Payment</span>
                <strong className="text-emerald-700 block mt-0.5">{selectedPlanDetails.coPay}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Pre-existing Diseases</span>
                <strong className="text-slate-900 block mt-0.5">{selectedPlanDetails.waitingPeriodPED}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Ambulance Support</span>
                <strong className="text-slate-900 block mt-0.5">{selectedPlanDetails.ambulanceCoverage}</strong>
              </div>
            </div>

            {/* Unique Plan Advantages */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider m-0">
                Core Policy Benefits &amp; Inclusions
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                {selectedPlanDetails.keyPerks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim Settlement Guarantee */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>IRDAI Certified Claim Settlement Ratio:</strong> Zero hidden co-pays at ClinicOS.
                </span>
              </div>
              <span className="text-xs font-black text-emerald-700 shrink-0">99.4% Verified</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
              >
                Close Brochure
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = selectedPlanDetails;
                  setSelectedPlanDetails(null);
                  handleOpenBuyModal(p);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#16163B] text-white font-black text-xs border-none cursor-pointer shadow-md"
              >
                Proceed to Instant Policy Issuance →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. MODAL: GET INSTANT QUOTE & BUY POLICY ── */}
      {buyPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            
            {!generatedPolicy ? (
              <form onSubmit={handleConfirmPurchase} className="space-y-5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                      Instant Cashless Issuance
                    </span>
                    <h3 className="text-lg font-black text-slate-900 m-0 mt-1">
                      Enroll in {buyPlanModal.name}
                    </h3>
                    <p className="text-xs text-slate-500 m-0 mt-0.5">
                      Sum Insured: <strong className="text-slate-800">{getPlanPrice(buyPlanModal).sumLabel}</strong> • Billing: <strong className="text-slate-800 capitalize">{billingPeriod}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBuyPlanModal(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg border-none cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Premium Summary Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Payable Premium</span>
                    <span className="text-xl font-black text-slate-900 font-heading">
                      ₹{getPlanPrice(buyPlanModal).price.toLocaleString('en-IN')} {getPlanPrice(buyPlanModal).period}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    18% GST Included
                  </span>
                </div>

                {/* Insured Member Inputs */}
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block mb-1">Primary Insured Member Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Age *</label>
                      <input
                        type="number"
                        required
                        value={applicantAge}
                        onChange={(e) => setApplicantAge(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>

                  {/* Pre-existing Health Declaration */}
                  <label className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasPreExisting}
                      onChange={(e) => setHasPreExisting(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600"
                    />
                    <span className="text-[11px] font-medium text-slate-600 leading-tight">
                      I declare pre-existing conditions (e.g. Diabetes or Hypertension). I understand the waiting period or Day-1 fast-track rider applies.
                    </span>
                  </label>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setBuyPlanModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#16163B] hover:bg-slate-800 text-white font-black text-xs border-none cursor-pointer shadow-md flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Pay Premium &amp; Activate (₹{getPlanPrice(buyPlanModal).price})</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">Policy Issued Successfully!</h3>
                  <p className="text-xs text-slate-500 m-0 mt-1">
                    Your digital cashless health card has been added to your ClinicOS profile.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Policy Number:</span>
                    <strong className="text-emerald-400 font-mono">{generatedPolicy}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Insured Person:</span>
                    <strong className="text-white">{applicantName} (Age: {applicantAge})</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Plan:</span>
                    <strong className="text-white">{buyPlanModal.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sum Insured:</span>
                    <strong className="text-[#E9DF70]">{getPlanPrice(buyPlanModal).sumLabel} Cashless</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBuyPlanModal(null);
                      navigate('/insurance-claims');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 cursor-pointer"
                  >
                    View in TPA Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyPlanModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-[#16163B] text-white font-black text-xs border-none cursor-pointer shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Dynamic UPI QR Payment Gateway Modal for Health Insurance Policy */}
      {buyPlanModal && (
        <UnifiedPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onDone={handlePaymentDone}
          amount={getPlanPrice(buyPlanModal).price}
          title="Health Insurance Policy Premium"
          subtitle={`${buyPlanModal.name} (${getPlanPrice(buyPlanModal).sumLabel} Cashless)`}
          particulars={`Policy Premium: ${applicantName} (${buyPlanModal.provider})`}
          breakdown={[
            { label: 'Policy Name', value: buyPlanModal.name },
            { label: 'Cashless Sum Insured', value: getPlanPrice(buyPlanModal).sumLabel },
            { label: `Base Premium (${billingPeriod})`, value: `₹${getPlanPrice(buyPlanModal).price}` },
            { label: 'Cashless Hospitals Network', value: buyPlanModal.cashlessHospitals },
            { label: 'Consumables & Room Rent', value: '100% Covered' }
          ]}
        />
      )}

    </section>
  );
};
