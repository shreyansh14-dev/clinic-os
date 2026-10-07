import React from 'react';

/**
 * AnimatedNurse
 * Active & Attentive Yellow Nurse Mascot:
 * - Moves according to cursor across entire screen:
 *   - body shifts and tilts towards cursor
 *   - face moves with 3D parallax
 *   - eyes track cursor with 60fps pupil deflection
 * - Eyes CLOSE into thin shut slits (— —) when view password is tapped!
 * - Thermometer/mouth reacts to email lean and login error
 * - Retains original vibrant colors and clay aesthetic
 */
export const AnimatedNurse = ({
  expression = 'idle',
  isBlinking = false,
  eyesClosed = false,
  gaze = { x: 0, y: 0 },
  faceShift = { x: 0, y: 0 },
  bodyShift = { x: 0, y: 0 },
  intensity = 1.0,
  isRoleActive = false,
  isSettled = true,
  isBouncing = false,
  bounceId = 0,
  className = ''
}) => {
  const shouldCloseEyes = eyesClosed || expression === 'shy_closed' || isBlinking;
  const isSad = expression === 'sad';
  const isLeaning = expression === 'leaning_right';
  const isHappy = expression === 'happy' || expression === 'success';
  const isCurious = expression === 'curious';

  // Eye gaze displacement
  const gx = (gaze?.x || 0) * 0.85 * intensity;
  const gy = (gaze?.y || 0) * 0.85 * intensity;

  // Face parallax
  const fx = (faceShift?.x || 0) * 0.85 * intensity;
  const fy = (faceShift?.y || 0) * 0.85 * intensity;

  // Body displacement from cursor
  const bx = (bodyShift?.x || 0) * 0.95 * intensity;
  const by = (bodyShift?.y || 0) * 0.95 * intensity;

  let extraTransform = '';
  if (isSad) {
    extraTransform = 'scaleY(0.96) translateY(4px)';
  }

  return (
    <div
      className={`avatar-head relative select-none will-change-transform ${className}`}
      style={{
        transform: `scale(${isRoleActive ? 1.05 : 0.98}) translate(${bx}px, ${by}px) ${extraTransform}`,
        transformOrigin: 'bottom center',
        zIndex: isRoleActive ? 20 : 10,
        filter: 'drop-shadow(0 14px 26px rgba(234, 179, 8, 0.28))'
      }}
    >
      <div
        key={bounceId}
        className={isBouncing ? 'avatar-bounce-active' : ''}
        style={{ transformOrigin: 'bottom center', width: '100%', height: '100%' }}
      >
        <svg
          viewBox="0 0 200 280"
          className="w-full h-auto overflow-visible"
          style={{
            transformOrigin: 'bottom center',
            animation: isSettled
              ? 'nurseIdle 5.6s ease-in-out infinite alternate'
              : 'none'
          }}
        >
        <defs>
          {/* Vivid Warm Yellow Gradient */}
          <radialGradient id="nurseBodyGrad" cx="38%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="80%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>

          {/* Top Pill Dome Specular Highlight */}
          <radialGradient id="nurseSpecHighlight" cx="38%" cy="20%" r="35%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Clipboard Drop Shadow */}
          <filter id="nurseBoardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#854D0E" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="95" cy="265" rx="55" ry="11" fill="#0F172A" opacity="0.12" />

        {/* Rounded Yellow Pill Body */}
        <g id="nurse-body-base">
          <rect
            x="45"
            y="55"
            width="105"
            height="215"
            rx="52.5"
            fill="url(#nurseBodyGrad)"
          />
          <ellipse cx="95" cy="95" rx="46" ry="36" fill="url(#nurseSpecHighlight)" />
        </g>

        {/* Nurse Cap */}
        <g id="nurse-cap" transform="translate(68, 26)">
          <path
            d="M 2 24 C 2 12, 14 6, 28 6 C 42 6, 54 12, 54 24 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          <path d="M 6 22 Q 28 16 50 22" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          <g transform="translate(28, 15)">
            <rect x="-2" y="-6" width="4" height="12" rx="1" fill="#EF4444" />
            <rect x="-6" y="-2" width="12" height="4" rx="1" fill="#EF4444" />
          </g>
        </g>

        {/* Expressive Face Group with Cursor Parallax */}
        <g
          id="nurse-face"
          className="avatar-face"
          transform={`translate(${fx}, ${fy})`}
        >
          {/* LEFT EYE */}
          <g className="avatar-eye">
            {shouldCloseEyes ? (
              /* EYES CLOSED: Shut Slit (— shape) */
              <line x1="72" y1="98" x2="84" y2="98" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            ) : isHappy ? (
              <path d="M 71 101 Q 78 91 85 101" fill="none" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
            ) : (
              <g className="avatar-pupil">
                <circle cx={78 + gx} cy={98 + gy} r="5.5" fill="#18181B" />
                <circle cx={76.5 + gx * 0.75} cy={96.5 + gy * 0.75} r="1.8" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* RIGHT EYE */}
          <g className="avatar-eye">
            {shouldCloseEyes ? (
              /* EYES CLOSED: Shut Slit (— shape) */
              <line x1="116" y1="98" x2="128" y2="98" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            ) : isHappy ? (
              <path d="M 115 101 Q 122 91 129 101" fill="none" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
            ) : (
              <g className="avatar-pupil">
                <circle cx={122 + gx} cy={98 + gy} r="5.5" fill="#18181B" />
                <circle cx={120.5 + gx * 0.75} cy={96.5 + gy * 0.75} r="1.8" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* Thermometer / Stylus in Mouth */}
          <g
            id="nurse-mouth"
            className="avatar-mouth transition-transform duration-250"
            transform={`translate(86, 115) rotate(${isSad ? '6' : isHappy ? '-4' : isCurious ? '3' : '0'})`}
          >
            {isSad ? (
              /* Wavy Sad Mouth */
              <path
                d="M -4 2 Q 8 -4 18 2 Q 28 8 38 2"
                fill="none"
                stroke="#18181B"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                {/* Thermometer Stem */}
                <rect
                  x="-6"
                  y="-3"
                  width="58"
                  height="6.5"
                  rx="3"
                  fill="#18181B"
                />
                {/* Red Tip Bulb */}
                <circle cx="48" cy="0" r="4.5" fill="#EF4444" />
                {/* Measurement Ticks */}
                <line x1="12" y1="-2" x2="12" y2="2" stroke="#FFFFFF" strokeWidth="1" />
                <line x1="20" y1="-2" x2="20" y2="2" stroke="#FFFFFF" strokeWidth="1" />
                <line x1="28" y1="-2" x2="28" y2="2" stroke="#FFFFFF" strokeWidth="1" />
              </>
            )}
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="64" cy="110" rx="6" ry="3.5" fill="#F97316" opacity={shouldCloseEyes ? 0.42 : isHappy ? 0.5 : 0.28} className="transition-opacity duration-200" />
          <ellipse cx="132" cy="110" rx="6" ry="3.5" fill="#F97316" opacity={shouldCloseEyes ? 0.42 : isHappy ? 0.5 : 0.28} className="transition-opacity duration-200" />
        </g>

        {/* Medical Clipboard Held in Hands */}
        <g id="nurse-clipboard" filter="url(#nurseBoardShadow)" transform="translate(68, 140) rotate(5)">
          <rect
            x="0"
            y="0"
            width="64"
            height="86"
            rx="12"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          <rect x="18" y="-6" width="28" height="12" rx="4" fill="#334155" />
          <circle cx="32" cy="0" r="2.5" fill="#94A3B8" />

          {/* Red Cross */}
          <g transform="translate(32, 26)">
            <rect x="-3" y="-9" width="6" height="18" rx="1.5" fill="#EF4444" />
            <rect x="-9" y="-3" width="18" height="6" rx="1.5" fill="#EF4444" />
          </g>

          {/* Notes lines */}
          <rect x="12" y="44" width="40" height="4" rx="2" fill="#E2E8F0" />
          <rect x="12" y="54" width="32" height="4" rx="2" fill="#E2E8F0" />
          <rect x="12" y="64" width="36" height="4" rx="2" fill="#E2E8F0" />

          {/* Yellow Hands */}
          <circle cx="2" cy="46" r="8" fill="url(#nurseBodyGrad)" />
          <circle cx="62" cy="50" r="8" fill="url(#nurseBodyGrad)" />
        </g>
      </svg>
      </div>
    </div>
  );
};
