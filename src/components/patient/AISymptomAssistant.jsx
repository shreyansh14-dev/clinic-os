import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, Sparkles, AlertTriangle, ShieldCheck, Stethoscope, CalendarPlus, ChevronRight } from 'lucide-react';

export const AISymptomAssistant = () => {
  const { doctors, departments, setActiveTab } = useApp();
  const [symptomInput, setSymptomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState(null);

  const predefinedSymptoms = [
    'Severe Chest Tightness & Shortness of Breath',
    'Chronic Headache & Blurred Vision',
    'Persistent Cough & Fever for 4 days',
    'Skin Rash & Red Swelling with Itching',
    'Joint Pain in Knee after physical activity'
  ];

  const handleAnalyze = (inputVal) => {
    const textToAnalyze = inputVal || symptomInput;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setAssessment(null);

    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();
      let urgency = 'Moderate';
      let deptName = 'General Medicine';
      let recommendedDoctor = doctors[1]; // Dr. Arjun Sharma
      let summary = 'General clinical evaluation advised to rule out systemic infection or inflammation.';

      if (lower.includes('chest') || lower.includes('breath') || lower.includes('heart') || lower.includes('tightness')) {
        urgency = 'High (Urgent Evaluation Required)';
        deptName = 'Cardiology';
        recommendedDoctor = doctors[0]; // Dr. Souvik Sinha
        summary = 'Symptoms indicate potential cardiovascular or respiratory distress. Immediate consultation with a cardiologist is recommended.';
      } else if (lower.includes('headache') || lower.includes('vision') || lower.includes('dizziness') || lower.includes('migraine')) {
        urgency = 'Moderate to High';
        deptName = 'Neurology';
        recommendedDoctor = doctors[2]; // Dr. Kunal Sarkar
        summary = 'Symptoms suggest neuro-vascular tension or migraine. Neurological evaluation advised.';
      } else if (lower.includes('skin') || lower.includes('rash') || lower.includes('itching') || lower.includes('swelling')) {
        urgency = 'Low to Moderate';
        deptName = 'Dermatology';
        recommendedDoctor = doctors[3]; // Dr. Tuhin Banerjee
        summary = 'Cutaneous allergic or inflammatory reaction suspected.';
      } else if (lower.includes('joint') || lower.includes('bone') || lower.includes('fracture') || lower.includes('knee')) {
        urgency = 'Moderate';
        deptName = 'Orthopedics';
        recommendedDoctor = doctors[4]; // Dr. Henry D\'Souza
        summary = 'Musculoskeletal strain or joint inflammation detected.';
      }

      setAssessment({
        symptoms: textToAnalyze,
        urgency,
        deptName,
        recommendedDoctor,
        summary,
        guidance: [
          'Stay hydrated and avoid heavy exertion.',
          'Monitor body temperature and resting heart rate.',
          'Keep previous medical records handy for specialist consultation.'
        ]
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.15), rgba(15, 19, 29, 0.95))', border: '1px solid var(--border-highlight)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
            <Bot size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>AI Symptom Assistant & Triage Engine</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Powered by clinical rule-based decision trees for instant health guidance</p>
          </div>
        </div>
      </div>

      {/* Input Box & Presets */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.85rem' }}>Describe your symptoms</h3>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <textarea
            className="textarea-field"
            rows={3}
            placeholder="e.g. Sharp pain in chest when taking deep breath, dizziness, or persistent fever..."
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Try common examples:</span>
            {predefinedSymptoms.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSymptomInput(item);
                  handleAnalyze(item);
                }}
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: '1rem',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => handleAnalyze()} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing Symptoms...' : 'Analyze Symptoms'} <Sparkles size={16} />
          </button>
        </div>
      </div>

      {/* Analysis Output Result Card (Matching Slide 8 AI Symptom Assistant feature spec) */}
      {assessment && (
        <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border-highlight)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles style={{ color: 'var(--primary)' }} /> Clinical AI Assessment Result
            </h3>
            <span className={`badge ${assessment.urgency.includes('High') ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
              Urgency: {assessment.urgency}
            </span>
          </div>

          {/* Recommended Specialist Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Preliminary Guidance</h4>
              <p style={{ fontSize: '0.95rem', color: '#0f172a', background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.65rem', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                {assessment.summary}
              </p>

              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Next Step Recommendations</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {assessment.guidance.map((g, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--green)' }} /> {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Doctor Box */}
            <div style={{ background: 'var(--bg-dark)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-highlight)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>RECOMMENDED SPECIALIST</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.65rem', marginBottom: '0.85rem' }}>
                  <img src={assessment.recommendedDoctor.avatar} alt={assessment.recommendedDoctor.name} style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                  <div>
                    <h5 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: '700' }}>{assessment.recommendedDoctor.name}</h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{assessment.recommendedDoctor.specialty}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Available: {assessment.recommendedDoctor.availability}</p>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                onClick={() => setActiveTab('book-appointment')}
              >
                <CalendarPlus size={16} /> Book Consultation (₹{assessment.recommendedDoctor.fee})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
