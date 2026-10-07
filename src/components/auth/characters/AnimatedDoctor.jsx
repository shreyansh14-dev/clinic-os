import React from 'react';

/**
 * AnimatedDoctor
 * Calm & Professional Purple Doctor Mascot:
 * - Moves according to cursor across entire screen:
 *   - body shifts and rotates towards cursor
 *   - face moves with 3D parallax
 *   - eyes track cursor with 60fps pupil deflection
 * - Eyes CLOSE completely when view password is tapped!
 * - When email is focused, leans right toward the input field
 * - Slumps slightly with sad frown on login error
 * - Retains original vibrant colors and clay aesthetic
 */
export const AnimatedDoctor = ({
  expression = 'idle',
  isBlinking = false,
  eyesClosed = false,
  gaze = { x: 0, y: 0 },
  faceShift = { x: 0, y: 0 },
  bodyShift = { x: 0, y: 0 },
  isLeaningRight = false,
  intensity = 1.0,
  isRoleActive = false,
  isSettled = true,
  isBouncing = false,
  bounceId = 0,
  className = ''
}) => {
  const shouldCloseEyes = eyesClosed || expression === 'shy_closed' || isBlinking;
  const isSad = expression === 'sad';
  const isLeaning = isLeaningRight || expression === 'leaning_right';
  const isThinking = expression === 'thinking';
  const isSuccess = expression === 'success';
  const isSurprised = expression === 'surprised';

  // Eye gaze displacement
  const gx = (gaze?.x || 0) * 0.9 * intensity;
  const gy = (gaze?.y || 0) * 0.9 * intensity;

  // Face parallax
  const fx = (faceShift?.x || 0) * 0.9 * intensity;
  const fy = (faceShift?.y || 0) * 0.9 * intensity;

  // Body displacement from cursor
  const bx = (bodyShift?.x || 0) * 1.05 * intensity;
  const by = (bodyShift?.y || 0) * 1.05 * intensity;

  let extraTransform = '';
  if (isSad) {
    extraTransform = 'scaleY(0.95) translateY(5px)';
  } else if (isSuccess) {
    extraTransform = 'translateY(-3px)';
  }

  return (
    <div
      className={`avatar-head relative select-none will-change-transform ${className}`}
      style={{
        transform: `scale(${isRoleActive ? 1.05 : 0.98}) translate(${bx}px, ${by}px) ${extraTransform}`,
        transformOrigin: 'bottom center',
        zIndex: isRoleActive ? 22 : 12,
        filter: 'drop-shadow(0 18px 30px rgba(99, 32, 238, 0.32))'
      }}
    >
      <div
        key={bounceId}
        className={isBouncing ? 'avatar-bounce-active' : ''}
        style={{ transformOrigin: 'bottom center', width: '100%', height: '100%' }}
      >
        <svg
          viewBox="0 0 220 320"
          className="w-full h-auto overflow-visible"
          style={{
            transformOrigin: 'bottom center',
            animation: isSettled
              ? 'doctorIdle 6.4s ease-in-out infinite alternate'
              : 'none'
          }}
        >
        <defs>
          {/* Vivid Purple 3D Clay Cylinder Gradient */}
          <radialGradient id="doctorBodyGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#8F5CFF" />
            <stop offset="40%" stopColor="#6C38FF" />
            <stop offset="80%" stopColor="#5018DF" />
            <stop offset="100%" stopColor="#3C0CAD" />
          </radialGradient>

          {/* Top Pill Dome Specular Highlight */}
          <radialGradient id="doctorSpecHighlight" cx="35%" cy="18%" r="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* White Lab Coat Gradient */}
          <linearGradient id="doctorCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Stethoscope Tubing Gradient */}
          <linearGradient id="stethTubingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Silver Metal Piece */}
          <linearGradient id="stethMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="60%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="110" cy="300" rx="65" ry="12" fill="#0F172A" opacity="0.14" />

        {/* Body Base */}
        <g id="doctor-body-base">
          <rect
            x="48"
            y="20"
            width="124"
            height="270"
            rx="62"
            fill="url(#doctorBodyGrad)"
          />
          <ellipse cx="110" cy="70" rx="55" ry="42" fill="url(#doctorSpecHighlight)" />
        </g>

        {/* Expressive Face Group with Cursor Parallax */}
        <g
          id="doctor-face"
          className="avatar-face"
          transform={`translate(${fx}, ${fy})`}
        >
          {/* Vertical Dark Pill Slot on Forehead */}
          <rect
            x="102"
            y="55"
            width="16"
            height="36"
            rx="8"
            fill="#1E143E"
            opacity="0.95"
          />

          {/* Glasses Frame & Bridge */}
          <g className="avatar-glasses">
            <circle cx="82" cy="72" r="14" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" />
            <circle cx="138" cy="72" r="14" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.4" />
            <rect x="94" y="70" width="32" height="3" rx="1.5" fill="#1E143E" />
          </g>

          {/* LEFT EYE */}
          <g className="avatar-eye">
            {shouldCloseEyes ? (
              /* EYES CLOSED: Shy Slits / Shut Eyelids */
              <line x1="74" y1="72" x2="90" y2="72" stroke="#1E143E" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="82" cy="72" r="6.5" fill="#FFFFFF" />
                <g className="avatar-pupil">
                  <circle cx={82 + gx} cy={72 + gy} r="4" fill="#0F172A" />
                  <circle cx={80.5 + gx * 0.75} cy={70.5 + gy * 0.75} r="1.5" fill="#FFFFFF" />
                </g>
              </>
            )}
          </g>

          {/* RIGHT EYE */}
          <g className="avatar-eye">
            {shouldCloseEyes ? (
              /* EYES CLOSED: Shy Slits / Shut Eyelids */
              <line x1="130" y1="72" x2="146" y2="72" stroke="#1E143E" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="138" cy="72" r="6.5" fill="#FFFFFF" />
                <g className="avatar-pupil">
                  <circle cx={138 + gx} cy={72 + gy} r="4" fill="#0F172A" />
                  <circle cx={136.5 + gx * 0.75} cy={70.5 + gy * 0.75} r="1.5" fill="#FFFFFF" />
                </g>
              </>
            )}
          </g>

          {/* Doctor Expressive Mouth */}
          <g className="avatar-mouth transition-all duration-200">
            {isSad ? (
              /* Sad Frown (︵ shape) */
              <path
                d="M 103 106 Q 110 99 117 106"
                fill="none"
                stroke="#3C0CAD"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : shouldCloseEyes ? (
              /* Small Surprised / Shy Mouth */
              <ellipse cx="110" cy="103" rx="3" ry="3.5" fill="#3C0CAD" />
            ) : isLeaning ? (
              /* Vertical Nose/Mouth Line */
              <line x1="110" y1="99" x2="110" y2="105" stroke="#3C0CAD" strokeWidth="2.5" strokeLinecap="round" />
            ) : isSuccess ? (
              <path
                d="M 102 101 Q 110 108 118 101"
                fill="none"
                stroke="#3C0CAD"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : isThinking ? (
              <path
                d="M 104 103 L 116 101"
                fill="none"
                stroke="#3C0CAD"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : isSurprised ? (
              <ellipse cx="110" cy="102" rx="3.5" ry="4" fill="#3C0CAD" />
            ) : (
              /* Calm Neutral Smile */
              <path
                d="M 103 102 Q 110 105 117 102"
                fill="none"
                stroke="#3C0CAD"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </g>
        </g>

        {/* White Doctor Lab Coat */}
        <g id="doctor-coat">
          <path
            d="M 48 160 C 48 140, 60 130, 80 130 L 140 130 C 160 130, 172 140, 172 160 L 172 270 C 172 282, 160 290, 140 290 L 80 290 C 60 290, 48 282, 48 270 Z"
            fill="url(#doctorCoatGrad)"
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          <path d="M 88 130 L 110 182 L 132 130 Z" fill="#5018DF" />

          {/* Coat Lapels */}
          <path d="M 84 130 L 102 182 L 80 182 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <path d="M 136 130 L 118 182 L 140 182 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />

          {/* Center Seam & Buttons */}
          <line x1="110" y1="182" x2="110" y2="290" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="110" cy="205" r="3" fill="#64748B" />
          <circle cx="110" cy="235" r="3" fill="#64748B" />
          <circle cx="110" cy="265" r="3" fill="#64748B" />

          {/* Chest Pocket & Stethoscope */}
          <rect x="62" y="195" width="22" height="26" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <rect x="67" y="191" width="12" height="5" rx="1.5" fill="#3B82F6" />
        </g>

        {/* Modern Medical Stethoscope */}
        <g id="doctor-stethoscope">
          <path
            d="M 84 140 C 74 150, 74 195, 96 220 C 114 240, 126 240, 134 220 C 146 195, 146 150, 136 140"
            fill="none"
            stroke="url(#stethTubingGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 115 233 L 115 255"
            fill="none"
            stroke="url(#stethTubingGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="115" cy="262" r="10" fill="url(#stethMetalGrad)" stroke="#475569" strokeWidth="1.5" />
          <circle cx="115" cy="262" r="5" fill="#334155" />
        </g>
      </svg>
      </div>
    </div>
  );
};
