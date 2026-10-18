export default function Logo() {
  return (
    <div className="inline-flex items-center">
      <svg width="210" height="27" viewBox="0 0 320 40">
        <g transform="translate(0,2)">
          <path
            d="M18 0 L20 13.5 L30 8 L22 17 L36 18 L22 19 L30 28 L20 22.5 L18 36 L16 22.5 L6 28 L14 19 L0 18 L14 17 L6 8 L16 13.5 Z"
            fill="#FF6B35"
          />
        </g>
        <text
          fontFamily="Sora,sans-serif"
          fontWeight="700"
          fontSize="26"
          letterSpacing="-0.5"
          y="28"
          x="46"
        >
          <tspan fill="#FFFFFF">event</tspan>
          <tspan fill="#FF6B35">foundry</tspan>
        </text>
      </svg>
    </div>
  );
}
