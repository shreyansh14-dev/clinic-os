import React from 'react';

/**
 * AnimatedCloudsBackground
 * Renders realistic, dreamy animated white clouds floating gracefully across the sky:
 * - 3 layered tiers of procedural SVG cumulus and cirrus clouds
 * - Seamless 360-degree infinite drifting animation at varying parallax speeds
 * - Soft luminous sky ambient lighting and subtle cloud puff bobbing
 */
export const AnimatedCloudsBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Atmospheric Sky Gradient (Soft Heavenly Blue to Cloud White) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #D4E8FC 0%, #E2F0FD 25%, #EDF6FE 55%, #F8FBFE 100%)'
        }}
      />

      {/* 2. Soft Ambient Sun Ray & Glow */}
      <div className="absolute -top-24 left-[18%] w-[650px] h-[650px] rounded-full bg-white/60 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[90px] pointer-events-none" />

      {/* 3. High Cirrus Cloud Wisps (Slow, Ethereal, 85s Drift) */}
      <div className="absolute top-4 left-0 w-[200%] h-36 flex clouds-drift-slow opacity-45">
        <svg viewBox="0 0 1600 120" className="w-1/2 h-full shrink-0" preserveAspectRatio="none">
          <path
            d="M 0 60 Q 180 20 380 50 Q 580 80 800 40 Q 1020 10 1220 55 Q 1420 90 1600 50 L 1600 0 L 0 0 Z"
            fill="url(#cirrusGrad)"
          />
          <defs>
            <linearGradient id="cirrusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg viewBox="0 0 1600 120" className="w-1/2 h-full shrink-0" preserveAspectRatio="none">
          <path
            d="M 0 60 Q 180 20 380 50 Q 580 80 800 40 Q 1020 10 1220 55 Q 1420 90 1600 50 L 1600 0 L 0 0 Z"
            fill="url(#cirrusGrad)"
          />
        </svg>
      </div>

      {/* 4. Mid-Layer Large Fluffy Cumulus Clouds (Seamless 50s Drift) */}
      <div className="absolute -top-10 left-0 w-[200%] h-80 flex clouds-drift-mid opacity-75">
        <div className="w-1/2 h-full shrink-0 relative">
          {/* Cloud Formation A1 */}
          <div className="absolute top-8 left-[5%] animate-cloud-bob">
            <svg width="340" height="150" viewBox="0 0 340 150" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="170" cy="90" rx="130" ry="45" fill="#FFFFFF" />
                <circle cx="110" cy="70" r="48" fill="#FFFFFF" />
                <circle cx="165" cy="50" r="54" fill="#FFFFFF" />
                <circle cx="225" cy="65" r="44" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Cloud Formation A2 */}
          <div className="absolute top-16 left-[48%] animate-cloud-bob-delayed">
            <svg width="420" height="180" viewBox="0 0 420 180" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="210" cy="115" rx="160" ry="50" fill="#FFFFFF" />
                <circle cx="130" cy="90" r="55" fill="#FFFFFF" />
                <circle cx="195" cy="62" r="65" fill="#FFFFFF" />
                <circle cx="270" cy="80" r="58" fill="#FFFFFF" />
                <circle cx="330" cy="105" r="42" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Cloud Formation A3 */}
          <div className="absolute top-2 right-[6%] animate-cloud-bob">
            <svg width="290" height="130" viewBox="0 0 290 130" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="145" cy="80" rx="115" ry="38" fill="#FFFFFF" />
                <circle cx="100" cy="62" r="42" fill="#FFFFFF" />
                <circle cx="150" cy="46" r="48" fill="#FFFFFF" />
                <circle cx="195" cy="58" r="38" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </div>

        {/* Duplicate segment for seamless 100% loop */}
        <div className="w-1/2 h-full shrink-0 relative">
          <div className="absolute top-8 left-[5%] animate-cloud-bob">
            <svg width="340" height="150" viewBox="0 0 340 150" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="170" cy="90" rx="130" ry="45" fill="#FFFFFF" />
                <circle cx="110" cy="70" r="48" fill="#FFFFFF" />
                <circle cx="165" cy="50" r="54" fill="#FFFFFF" />
                <circle cx="225" cy="65" r="44" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
          <div className="absolute top-16 left-[48%] animate-cloud-bob-delayed">
            <svg width="420" height="180" viewBox="0 0 420 180" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="210" cy="115" rx="160" ry="50" fill="#FFFFFF" />
                <circle cx="130" cy="90" r="55" fill="#FFFFFF" />
                <circle cx="195" cy="62" r="65" fill="#FFFFFF" />
                <circle cx="270" cy="80" r="58" fill="#FFFFFF" />
                <circle cx="330" cy="105" r="42" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
          <div className="absolute top-2 right-[6%] animate-cloud-bob">
            <svg width="290" height="130" viewBox="0 0 290 130" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="145" cy="80" rx="115" ry="38" fill="#FFFFFF" />
                <circle cx="100" cy="62" r="42" fill="#FFFFFF" />
                <circle cx="150" cy="46" r="48" fill="#FFFFFF" />
                <circle cx="195" cy="58" r="38" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 5. Lower / Horizon Billowing Clouds (Seamless 38s Drift) */}
      <div className="absolute -bottom-16 left-0 w-[200%] h-80 flex clouds-drift-fast opacity-90">
        <div className="w-1/2 h-full shrink-0 relative">
          {/* Bottom Left Cloud */}
          <div className="absolute bottom-6 left-[2%] animate-cloud-bob">
            <svg width="480" height="200" viewBox="0 0 480 200" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="240" cy="140" rx="190" ry="55" fill="#FFFFFF" />
                <circle cx="140" cy="110" r="65" fill="#FFFFFF" />
                <circle cx="225" cy="80" r="75" fill="#FFFFFF" />
                <circle cx="310" cy="98" r="68" fill="#FFFFFF" />
                <circle cx="380" cy="125" r="52" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Bottom Center Cloud */}
          <div className="absolute bottom-2 left-[44%] animate-cloud-bob-delayed">
            <svg width="520" height="210" viewBox="0 0 520 210" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="260" cy="145" rx="210" ry="58" fill="#FFFFFF" />
                <circle cx="150" cy="115" r="72" fill="#FFFFFF" />
                <circle cx="245" cy="78" r="82" fill="#FFFFFF" />
                <circle cx="340" cy="100" r="74" fill="#FFFFFF" />
                <circle cx="415" cy="130" r="58" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Bottom Right Cloud */}
          <div className="absolute bottom-10 right-[3%] animate-cloud-bob">
            <svg width="400" height="175" viewBox="0 0 400 175" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="200" cy="120" rx="160" ry="48" fill="#FFFFFF" />
                <circle cx="120" cy="95" r="58" fill="#FFFFFF" />
                <circle cx="185" cy="70" r="68" fill="#FFFFFF" />
                <circle cx="260" cy="88" r="56" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </div>

        {/* Duplicate segment for seamless loop */}
        <div className="w-1/2 h-full shrink-0 relative">
          <div className="absolute bottom-6 left-[2%] animate-cloud-bob">
            <svg width="480" height="200" viewBox="0 0 480 200" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="240" cy="140" rx="190" ry="55" fill="#FFFFFF" />
                <circle cx="140" cy="110" r="65" fill="#FFFFFF" />
                <circle cx="225" cy="80" r="75" fill="#FFFFFF" />
                <circle cx="310" cy="98" r="68" fill="#FFFFFF" />
                <circle cx="380" cy="125" r="52" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
          <div className="absolute bottom-2 left-[44%] animate-cloud-bob-delayed">
            <svg width="520" height="210" viewBox="0 0 520 210" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="260" cy="145" rx="210" ry="58" fill="#FFFFFF" />
                <circle cx="150" cy="115" r="72" fill="#FFFFFF" />
                <circle cx="245" cy="78" r="82" fill="#FFFFFF" />
                <circle cx="340" cy="100" r="74" fill="#FFFFFF" />
                <circle cx="415" cy="130" r="58" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
          <div className="absolute bottom-10 right-[3%] animate-cloud-bob">
            <svg width="400" height="175" viewBox="0 0 400 175" fill="none">
              <g filter="url(#cloudShadow)">
                <ellipse cx="200" cy="120" rx="160" ry="48" fill="#FFFFFF" />
                <circle cx="120" cy="95" r="58" fill="#FFFFFF" />
                <circle cx="185" cy="70" r="68" fill="#FFFFFF" />
                <circle cx="260" cy="88" r="56" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* SVG Global Filters for Soft Cloud Shadow Depth */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="cloudShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#90BBE7" floodOpacity="0.32" />
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#B6D4F5" floodOpacity="0.45" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
