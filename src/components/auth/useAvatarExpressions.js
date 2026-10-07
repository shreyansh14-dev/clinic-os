import { useState, useEffect, useRef } from 'react';

/**
 * useAvatarExpressions
 * Controls avatar gaze, blinking, and emotional states matching reference movements:
 * - ALL 3 avatars move according to the cursor:
 *   - eyes/pupils track cursor across the entire screen
 *   - faces move with parallax
 *   - bodies shift and tilt toward the cursor
 * - When view password is tapped (showPassword === true), eyes of all 3 avatars CLOSE completely!
 * - When email is focused, Doctor character LEANS RIGHT toward the input
 * - When password is focused, characters look attentively at password field
 * - When login fails / has error, characters show sad frowns and sad eyes
 * - Independent randomized natural blinking
 */
export const useAvatarExpressions = ({
  focusState = null,
  showPassword = false,
  selectedRole = 'patient',
  hasError = false,
  isSuccess = false,
  containerRef
}) => {
  // Independent Blinking States
  const [patientBlink, setPatientBlink] = useState(false);
  const [doctorBlink, setDoctorBlink] = useState(false);
  const [nurseBlink, setNurseBlink] = useState(false);

  // Error / Sad Expression State
  const [isErrorSad, setIsErrorSad] = useState(false);

  // Dynamic Avatar Movement States for all 3 characters
  const [avatarMotion, setAvatarMotion] = useState({
    gaze: { x: 0, y: 0 },
    faceShift: { x: 0, y: 0 },
    bodyShift: { x: 0, y: 0, rot: 0 }
  });

  // Target and Current Normalized Coordinates (-1 to +1)
  const targetNorm = useRef({ x: 0, y: 0 });
  const currentNorm = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // 1. Independent Natural Blinking (Patient 4-7s, Doctor 5-9s, Nurse 4-8s)
  useEffect(() => {
    let patientTimer, doctorTimer, nurseTimer;

    const schedulePatientBlink = () => {
      const delay = Math.random() * 3000 + 4000;
      patientTimer = setTimeout(() => {
        setPatientBlink(true);
        setTimeout(() => setPatientBlink(false), 120);
        schedulePatientBlink();
      }, delay);
    };

    const scheduleDoctorBlink = () => {
      const delay = Math.random() * 4000 + 5000;
      doctorTimer = setTimeout(() => {
        setDoctorBlink(true);
        setTimeout(() => setDoctorBlink(false), 130);
        scheduleDoctorBlink();
      }, delay);
    };

    const scheduleNurseBlink = () => {
      const delay = Math.random() * 4000 + 4000;
      nurseTimer = setTimeout(() => {
        setNurseBlink(true);
        setTimeout(() => setNurseBlink(false), 125);
        scheduleNurseBlink();
      }, delay);
    };

    const pStart = setTimeout(schedulePatientBlink, 1800);
    const dStart = setTimeout(scheduleDoctorBlink, 3500);
    const nStart = setTimeout(scheduleNurseBlink, 2400);

    return () => {
      clearTimeout(pStart);
      clearTimeout(dStart);
      clearTimeout(nStart);
      clearTimeout(patientTimer);
      clearTimeout(doctorTimer);
      clearTimeout(nurseTimer);
    };
  }, []);

  // 2. Error / Sad Expression when login fails
  useEffect(() => {
    if (hasError) {
      setIsErrorSad(true);
      const timer = setTimeout(() => {
        setIsErrorSad(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  // 3. Continuous 60 FPS Cursor Tracking for all 3 Avatars
  useEffect(() => {
    const handlePointerMove = (e) => {
      // If user is currently focused on a specific input, focus overrides cursor
      if (focusState === 'email' || focusState === 'password' || focusState === 'submit') {
        return;
      }

      // Center reference point (avatars are in left/bottom region of the screen)
      const stageCenterX = window.innerWidth * 0.32;
      const stageCenterY = window.innerHeight * 0.62;

      const dx = e.clientX - stageCenterX;
      const dy = e.clientY - stageCenterY;

      // Normalize across max distance
      const maxDistX = Math.max(300, window.innerWidth * 0.45);
      const maxDistY = Math.max(250, window.innerHeight * 0.45);

      const nx = Math.max(-1, Math.min(1, dx / maxDistX));
      const ny = Math.max(-1, Math.min(1, dy / maxDistY));

      targetNorm.current.x = nx;
      targetNorm.current.y = ny;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let lastX = 0;
    let lastY = 0;

    const tick = () => {
      let tx = targetNorm.current.x;
      let ty = targetNorm.current.y;

      // Input Focus Overrides
      if (focusState === 'email') {
        tx = 0.95;
        ty = -0.35;
      } else if (focusState === 'password') {
        tx = 0.90;
        ty = 0.10;
      } else if (focusState === 'submit') {
        tx = 0.75;
        ty = 0.75;
      } else if (isErrorSad) {
        tx = 0.15;
        ty = 0.85;
      }

      // Smooth Lerp (18% per frame for snappy responsive feel)
      currentNorm.current.x += (tx - currentNorm.current.x) * 0.18;
      currentNorm.current.y += (ty - currentNorm.current.y) * 0.18;

      const cx = currentNorm.current.x;
      const cy = currentNorm.current.y;

      if (Math.abs(cx - lastX) > 0.008 || Math.abs(cy - lastY) > 0.008) {
        lastX = cx;
        lastY = cy;

        const gx = Math.round(cx * 6.5 * 100) / 100;
        const gy = Math.round(cy * 5.0 * 100) / 100;

        const fx = Math.round(cx * 8.0 * 100) / 100;
        const fy = Math.round(cy * 5.0 * 100) / 100;

        const bx = Math.round(cx * 5.5 * 100) / 100;
        const by = Math.round(cy * 3.5 * 100) / 100;
        const rot = Math.round(cx * 3.5 * 100) / 100;

        setAvatarMotion({
          gaze: { x: gx, y: gy },
          faceShift: { x: fx, y: fy },
          bodyShift: { x: bx, y: by, rot }
        });

        if (containerRef?.current) {
          containerRef.current.style.setProperty('--pupil-x', `${gx}px`);
          containerRef.current.style.setProperty('--pupil-y', `${gy}px`);
          containerRef.current.style.setProperty('--face-px-x', `${fx}px`);
          containerRef.current.style.setProperty('--face-px-y', `${fy}px`);
          containerRef.current.style.setProperty('--body-px-x', `${bx}px`);
          containerRef.current.style.setProperty('--body-px-y', `${by}px`);
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, focusState, isErrorSad]);

  // 4. Derive Expression States
  // When showPassword is true: EYES MUST BE CLOSED FOR ALL AVATARS!
  const eyesClosed = Boolean(showPassword);
  const isLeaningRight = focusState === 'email';

  let patientExpression = 'idle';
  if (isSuccess) patientExpression = 'success';
  else if (isErrorSad) patientExpression = 'sad';
  else if (eyesClosed) patientExpression = 'shy_closed';
  else if (focusState === 'submit') patientExpression = 'happy';
  else if (focusState === 'email') patientExpression = 'attentive';
  else if (focusState === 'password') patientExpression = 'thinking';

  let doctorExpression = 'idle';
  if (isSuccess) doctorExpression = 'success';
  else if (isErrorSad) doctorExpression = 'sad';
  else if (eyesClosed) doctorExpression = 'shy_closed';
  else if (isLeaningRight) doctorExpression = 'leaning_right';
  else if (focusState === 'password') doctorExpression = 'thinking';

  let nurseExpression = 'idle';
  if (isSuccess) nurseExpression = 'success';
  else if (isErrorSad) nurseExpression = 'sad';
  else if (eyesClosed) nurseExpression = 'shy_closed';
  else if (isLeaningRight) nurseExpression = 'leaning_right';
  else if (focusState === 'submit') nurseExpression = 'happy';

  // Role Intensity Factors
  const roleIntensity = {
    patient: selectedRole === 'patient' ? 1.0 : 0.85,
    doctor: selectedRole === 'doctor' ? 1.0 : 0.85,
    nurse: selectedRole === 'admin' ? 1.0 : 0.8
  };

  return {
    patientBlink,
    doctorBlink,
    nurseBlink,
    eyesClosed,
    gaze: avatarMotion.gaze,
    faceShift: avatarMotion.faceShift,
    bodyShift: avatarMotion.bodyShift,
    isLeaningRight,
    isErrorSad,
    patientExpression,
    doctorExpression,
    nurseExpression,
    roleIntensity
  };
};
