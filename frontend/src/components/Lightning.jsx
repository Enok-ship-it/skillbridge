// Animated SVG lightning bolts that strike across the hero section
const Lightning = () => (
  <>
    <div className="lightning-flash"></div>

    {/* Bolt 1 — Top Left */}
    <svg
      className="absolute top-[8%] left-[6%] w-16 h-32 opacity-70 pointer-events-none hidden md:block"
      viewBox="0 0 40 100" fill="none"
    >
      <path className="bolt-path" d="M25 0 L8 45 L22 45 L12 100 L35 40 L20 40 Z"
        stroke="#fbbf24" strokeWidth="1.8" fill="rgba(251,191,36,0.12)" />
    </svg>

    {/* Bolt 2 — Top Right */}
    <svg
      className="absolute top-[14%] right-[8%] w-14 h-28 opacity-60 pointer-events-none hidden md:block"
      viewBox="0 0 40 100" fill="none"
      style={{ animationDelay: '2.5s' }}
    >
      <path className="bolt-path" d="M25 0 L8 45 L22 45 L12 100 L35 40 L20 40 Z"
        stroke="#22d3ee" strokeWidth="1.8" fill="rgba(34,211,238,0.12)"
        style={{ animationDelay: '2.5s' }} />
    </svg>

    {/* Bolt 3 — Mid Left */}
    <svg
      className="absolute top-[55%] left-[3%] w-10 h-20 opacity-50 pointer-events-none hidden lg:block"
      viewBox="0 0 40 100" fill="none"
    >
      <path className="bolt-path" d="M25 0 L8 45 L22 45 L12 100 L35 40 L20 40 Z"
        stroke="#818cf8" strokeWidth="2" fill="rgba(129,140,248,0.1)"
        style={{ animationDelay: '4s' }} />
    </svg>
  </>
)

export default Lightning