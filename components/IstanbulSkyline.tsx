/** İstanbul silueti — özel, zarif SVG illüstrasyon (Neden Türkiye bölümü). */
export default function IstanbulSkyline() {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a8a76" />
          <stop offset="55%" stopColor="#0fb39a" />
          <stop offset="100%" stopColor="#1e6bff" />
        </linearGradient>
        <linearGradient id="city" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#sky)" />
      {/* güneş */}
      <circle cx="470" cy="92" r="42" fill="#ffffff" opacity="0.25" />
      <circle cx="470" cy="92" r="26" fill="#ffffff" opacity="0.5" />
      {/* su yansıması çizgileri */}
      <g stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2">
        <line x1="40" y1="320" x2="180" y2="320" />
        <line x1="230" y1="332" x2="380" y2="332" />
        <line x1="420" y1="322" x2="560" y2="322" />
      </g>
      {/* cami siluetleri */}
      <g fill="url(#city)">
        {/* sol cami */}
        <path d="M120 300V215a40 40 0 0 1 80 0v85z" />
        <circle cx="160" cy="205" r="30" />
        <rect x="96" y="150" width="7" height="150" />
        <circle cx="99.5" cy="146" r="6" />
        <rect x="214" y="150" width="7" height="150" />
        <circle cx="217.5" cy="146" r="6" />
        {/* merkez büyük cami */}
        <path d="M300 300V200a55 55 0 0 1 110 0v100z" />
        <circle cx="355" cy="188" r="40" />
        <path d="M338 152h34l-17-26z" />
        <rect x="270" y="120" width="8" height="180" />
        <circle cx="274" cy="116" r="7" />
        <rect x="432" y="120" width="8" height="180" />
        <circle cx="436" cy="116" r="7" />
        {/* sağ küçük yapılar */}
        <rect x="470" y="240" width="40" height="60" rx="3" />
        <rect x="516" y="220" width="34" height="80" rx="3" />
        <path d="M30 300v-60a26 26 0 0 1 52 0v60z" />
        <circle cx="56" cy="232" r="18" />
      </g>
    </svg>
  );
}
