import React from 'react';

/**
 * AnimatedPatient
 * Expressive Orange Patient Mascot:
 * - Moves according to the cursor:
 *   - eyes/pupils track cursor across the entire screen
 *   - face shifts with 3D parallax
 *   - body shifts and leans towards cursor
 * - Eyes CLOSE completely into upward arcs (⌒ ⌒) when view password is tapped!
 * - Mouth morphs on emotion (sad frown on error, gentle on shy, smile on normal)
 * - Retains original vibrant colors and clay aesthetic
 */
export const AnimatedPatient = ({
  expression = 'idle',
  isBlinking = false,
  eyesClosed = false,
  gaze = { x: 0, y: 0 },
  faceShift = { x: 0, y: 0 },
  bodyShift = { x: 0, y: 0, rot: 0 },
  intensity = 1.0,
  isRoleActive = true,
  isSettled = true,
  className = ''
}) => {
  const shouldCloseEyes = eyesClosed || expression === 'shy_closed' || isBlinking;
  const isSad = expression === 'sad';
  const isHappy = expression === 'happy' || expression === 'success';
  const isCurious = expression === 'curious';
  const isSurprised = expression === 'surprised';
  const isThinking = expression === 'thinking';
  const isAttentive = expression === 'attentive';

  // Eye gaze displacement
  const gx = (gaze?.x || 0) * intensity;
  const gy = (gaze?.y || 0) * intensity;

  // Face parallax
  const fx = (faceShift?.x || 0) * intensity;
  const fy = (faceShift?.y || 0) * intensity;

  // Body displacement from cursor
  const bx = (bodyShift?.x || 0) * intensity;
  const by = (bodyShift?.y || 0) * intensity;
  const rot = (bodyShift?.rot || 0) * intensity;

  return (
    <div
      className={`avatar-head relative select-none transition-transform duration-100 ease-out ${className}`}
      style={{
        transform: `scale(${isRoleActive ? 1.04 : 0.98}) translate(${bx}px, ${by}px) rotate(${rot}deg)`,
        transformOrigin: 'bottom center',
        zIndex: isRoleActive ? 25 : 15,
        filter: 'drop-shadow(0 14px 24px rgba(255, 107, 36, 0.28))'
      }}
    >
      <svg
        viewBox="0 0 240 220"
        className="w-full h-auto overflow-visible"
        style={{
          transformOrigin: 'bottom center',
          animation: isSettled
            ? 'patientIdle 4.8s ease-in-out infinite alternate'
            : 'none'
        }}
      >
        <defs>
          {/* Main Orange Body Gradient (3D Clay Sphere) */}
          <radialGradient id="patientBodyGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFA466" />
            <stop offset="45%" stopColor="#FF6D26" />
            <stop offset="85%" stopColor="#EB5307" />
            <stop offset="100%" stopColor="#C94000" />
          </radialGradient>

          {/* Left Top Specular Highlight */}
          <radialGradient id="patientSpecHighlight" cx="30%" cy="25%" r="35%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Arm Gradient */}
          <linearGradient id="patientArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA466" />
            <stop offset="100%" stopColor="#EB5307" />
          </linearGradient>

          {/* Card Soft Shadow */}
          <filter id="patientCardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#9C3400" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="115" cy="204" rx="90" ry="14" fill="#0F172A" opacity="0.12" />

        {/* Body Group */}
        <g id="patient-body-group">
          {/* Sphere Body */}
          <circle cx="115" cy="116" r="92" fill="url(#patientBodyGrad)" />
          {/* 3D Specular Highlight */}
          <circle cx="115" cy="116" r="92" fill="url(#patientSpecHighlight)" />
          {/* Bottom Shadow Curve */}
          <path
            d="M 35 145 C 50 195, 175 195, 195 145 C 180 185, 55 185, 35 145 Z"
            fill="#B83800"
            opacity="0.3"
          />
        </g>

        {/* Expressive Face Group with Cursor Parallax */}
        <g
          id="patient-face-group"
          className="avatar-face"
          transform={`translate(${fx}, ${fy})`}
        >
          {/* Eyebrows */}
          <g
            className="avatar-eyebrows transition-transform duration-200"
            style={{
              transform: isSad
                ? 'translateY(2px)'
                : isCurious || isSurprised
                ? 'translateY(-3px)'
                : 'translateY(0)'
            }}
          >
            {isSad ? (
              /* Sad Eyebrows Slanting Inward */
              <>
                <line x1="88" y1="84" x2="102" y2="88" stroke="#9E2F00" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="133" y1="88" x2="147" y2="84" stroke="#9E2F00" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </>
            ) : (isCurious || isSurprised) ? (
              <>
                <line x1="88" y1="86" x2="102" y2="86" stroke="#9E2F00" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <line x1="133" y1="86" x2="147" y2="87" stroke="#9E2F00" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </>
            ) : null}
          </g>

          {/* LEFT EYE */}
          <g className="avatar-eye">
            {shouldCloseEyes ? (
              /* EYES CLOSED: Upward Curved Arc (⌒ shape) */
              <path
                d="M 87 101 Q 95 91 103 101"
                fill="none"
                stroke="#1E1E24"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : isHappy ? (
              <path
                d="M 87 101 Q 95 89 103 101"
                fill="none"
                stroke="#1E1E24"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : (
              /* Normal Bead Eye tracking cursor */
              <g className="avatar-pupil">
                <circle cx={95 + gx} cy={98 + gy} r="6" fill="#1E1E24" />
                <circle cx={93.5 + gx * 0.75} cy={96 + gy * 0.75} r="2" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* RIGHT EYE */}
          <g className="avatar-eye">
            {shouldCloseEyes ? (
              /* EYES CLOSED: Upward Curved Arc (⌒ shape) */
              <path
                d="M 132 101 Q 140 91 148 101"
                fill="none"
                stroke="#1E1E24"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : isHappy ? (
              <path
                d="M 132 101 Q 140 89 148 101"
                fill="none"
                stroke="#1E1E24"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : (
              /* Normal Bead Eye tracking cursor */
              <g className="avatar-pupil">
                <circle cx={140 + gx} cy={98 + gy} r="6" fill="#1E1E24" />
                <circle cx={138.5 + gx * 0.75} cy={96 + gy * 0.75} r="2" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* DYNAMIC MOUTH EXPRESSIONS */}
          <g className="avatar-mouth transition-all duration-200">
            {isSad ? (
              /* Sad Frown (︵ shape) */
              <path
                d="M 108 122 Q 118 111 128 122"
                fill="none"
                stroke="#7A2200"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : shouldCloseEyes ? (
              /* Gentle Shy Mouth */
              <path
                d="M 111 114 Q 118 118 125 114"
                fill="none"
                stroke="#7A2200"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : isHappy ? (
              <g>
                <path
                  d="M 104 110 Q 118 128 132 110 Z"
                  fill="#8A2300"
                  stroke="#7A2200"
                  strokeWidth="1.5"
                />
                <path d="M 107 111 Q 118 116 129 111" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : isSurprised ? (
              <ellipse cx="118" cy="116" rx="5.5" ry="7" fill="#8A2300" stroke="#7A2200" strokeWidth="1" />
            ) : isThinking ? (
              <path
                d="M 111 114 Q 118 112 125 115"
                fill="none"
                stroke="#7A2200"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : isAttentive ? (
              <path
                d="M 110 112 Q 118 119 126 112"
                fill="none"
                stroke="#7A2200"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : (
              /* Classic Friendly Warm Smile (Idle) */
              <path
                d="M 108 111 Q 118 122 128 111"
                fill="none"
                stroke="#7A2200"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="80" cy="114" rx="7.5" ry="4.5" fill="#FF4400" opacity={shouldCloseEyes ? 0.38 : isHappy ? 0.45 : 0.22} className="transition-opacity duration-200" />
          <ellipse cx="154" cy="114" rx="7.5" ry="4.5" fill="#FF4400" opacity={shouldCloseEyes ? 0.38 : isHappy ? 0.45 : 0.22} className="transition-opacity duration-200" />
        </g>

        {/* Arms & Medical Heart Card */}
        <g id="patient-arms-group">
          <path
            d="M 52 120 C 44 140, 58 175, 84 165 C 80 152, 65 142, 64 125 Z"
            fill="url(#patientArmGrad)"
          />
          <g filter="url(#patientCardShadow)" transform="translate(68, 118) rotate(-7)">
            <rect
              x="0"
              y="0"
              width="68"
              height="78"
              rx="14"
              fill="#FFFFFF"
              stroke="#F1F5F9"
              strokeWidth="1"
            />
            <rect x="12" y="14" width="44" height="42" rx="10" fill="#FFF1F2" />
            <path
              d="M 34 46 C 34 46, 20 37, 20 28 C 20 22, 25 18, 30 19 C 32.5 19.5, 34 22, 34 22 C 34 22, 35.5 19.5, 38 19 C 43 18, 48 22, 48 28 C 48 37, 34 46, 34 46 Z"
              fill="#EF4444"
            />
            <path
              d="M 24 30 L 29 30 L 32 23 L 35 36 L 38 27 L 41 30 L 44 30"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <circle cx="75" cy="162" r="11" fill="url(#patientArmGrad)" />
          <circle cx="132" cy="168" r="9" fill="url(#patientArmGrad)" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
};
