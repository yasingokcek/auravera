/**
 * AuraVera logo — "aura arc" üstünde altın bir hâle, yanında wordmark.
 * size: ikon yüksekliği (px). withWordmark=false ise sadece amblem.
 */
export default function Logo({
  size = 34,
  withWordmark = true,
  light = false,
}: {
  size?: number;
  withWordmark?: boolean;
  light?: boolean;
}) {
  const teal = "#0FB39A";
  const gold = "#1E6BFF";
  const wordColor = light ? "#FFFFFF" : "#0F172A";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="AuraVera"
      >
        {/* aura halo arc */}
        <path
          d="M9 30a15 15 0 0 1 30 0"
          stroke={gold}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* drop / vera leaf */}
        <path
          d="M24 14c5 6 8 10 8 15a8 8 0 1 1-16 0c0-5 3-9 8-15z"
          fill={teal}
        />
        {/* inner glow */}
        <circle cx="24" cy="30" r="3.4" fill="#FBF8F2" opacity="0.9" />
      </svg>
      {withWordmark && (
        <span
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: size * 0.62,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: wordColor,
            lineHeight: 1,
          }}
        >
          Aura<span style={{ color: teal }}>Vera</span>
        </span>
      )}
    </span>
  );
}
