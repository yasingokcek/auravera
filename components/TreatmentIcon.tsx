/** Markalı çizgi ikon seti — tedavi vitrini için. */
export default function TreatmentIcon({ slug, size = 30 }: { slug: string; size?: number }) {
  const c = "#0a8a76";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (slug) {
    case "sac_ekimi":
      return (
        <svg {...common}>
          <path d="M5 13a7 7 0 0 1 14 0v6a1 1 0 0 1-1 1h-2v-4H8v4H6a1 1 0 0 1-1-1z" />
          <path d="M8 7c1-2 7-2 8 1M9 5c.5-1.5 4-1.5 5 .5" />
        </svg>
      );
    case "dis":
      return (
        <svg {...common}>
          <path d="M12 4c2.5-1.5 6-1 6 3 0 3-1 5-1.5 8-.4 2.3-1.5 2.6-2 .5-.4-1.7-.5-3-2.5-3s-2.1 1.3-2.5 3c-.5 2.1-1.6 1.8-2-.5C7 12 6 10 6 7c0-4 3.5-4.5 6-3z" />
        </svg>
      );
    case "estetik":
      return (
        <svg {...common}>
          <path d="M9 4a6 6 0 0 0-2 9c.5 1 .5 2 .5 3 0 1.5 1 3 3.5 3" />
          <path d="M9 9h.01M13 8c1-2 4-1 4 1.5S15 13 15 15" />
          <path d="M18 4l.6 1.4L20 6l-1.4.6L18 8l-.6-1.4L16 6l1.4-.6z" />
        </svg>
      );
    case "obezite":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M8 4v3M16 4v3M12 4v3" />
          <path d="M8.5 14a3.5 3.5 0 0 1 7 0" />
        </svg>
      );
    case "tup_bebek":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M12 11c-3 0-5 2-5 5v3h10v-3c0-3-2-5-5-5z" />
          <path d="M12 14.5l-.8-.8a1 1 0 1 1 .8-1.6 1 1 0 1 1 .8 1.6z" fill={c} stroke="none" />
        </svg>
      );
    case "goz":
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
}
