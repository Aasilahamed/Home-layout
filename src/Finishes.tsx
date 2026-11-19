export default function Finishes({upper}: {upper: boolean}) {
  return <g aria-label="Illustrative floor finishes">
    <defs>
      <pattern id="oak" width="96" height="24" patternUnits="userSpaceOnUse">
        <rect width="96" height="24" fill="#dfbf98"/>
        <rect width="96" height="12" fill="#e8cfae"/>
        <path d="M0 0h96M0 12h96M29 0v12m46 0v12" fill="none" stroke="#bb9973" strokeWidth=".8"/>
        <path d="M5 7q18 -3 35 0t45 -1M18 19q21 2 46 -1" fill="none" stroke="#cda982" strokeWidth=".8"/>
      </pattern>
      <pattern id="stone" width="47" height="47" patternUnits="userSpaceOnUse">
        <rect width="47" height="47" fill="#ece6dc" stroke="#d4cbbd"/>
        <path d="m2 38 12-6 4-8 13-4 9-12" fill="none" stroke="#ded7cc" strokeWidth=".8"/>
      </pattern>
      <pattern id="wet-tile" width="17" height="17" patternUnits="userSpaceOnUse">
        <rect width="17" height="17" fill="#c6d8d2" stroke="#e4eeea" strokeWidth="1.5"/>
      </pattern>
      <pattern id="paver" width="60" height="32" patternUnits="userSpaceOnUse">
        <rect width="60" height="32" fill="#dad5c9"/>
        <path d="M0 0h60M0 16h60M30 0v16M0 16v16" stroke="#bfb9ac" fill="none"/>
      </pattern>
      <linearGradient id="linen" x2="1" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#dbe4dc"/><stop offset=".48" stopColor="#a7beb3"/><stop offset="1" stopColor="#809d91"/>
      </linearGradient>
    </defs>
    <rect x="47" y="104" width="474" height="596" fill="url(#stone)"/>
    {upper ? <>
      <rect x="40" y="6" width="488" height="98" fill="url(#oak)"/>
      <rect x="47" y="104" width="474" height="273" fill="url(#oak)"/>
      <path d="M40 6h137v98H40z M391 6h137v98H391z" fill="url(#wet-tile)"/>
      <rect x="47" y="700" width="474" height="405" fill="url(#stone)"/>
      <rect x="331" y="782" width="190" height="323" fill="url(#oak)"/>
      <rect x="331" y="700" width="190" height="82" fill="url(#wet-tile)"/>
      <rect x="40" y="1105" width="488" height="66" fill="url(#paver)"/>
    </> : <>
      <rect x="40" y="6" width="488" height="98" fill="url(#wet-tile)"/>
      <rect x="229" y="104" width="83" height="142" fill="url(#wet-tile)"/>
      <rect x="312" y="104" width="209" height="273" fill="url(#oak)"/>
      <rect x="40" y="700" width="488" height="412" fill="url(#paver)"/>
    </>}
    <rect x="211" y="466" width="137" height="144" rx="3" fill="#d1b79e"/>
    <rect x="216" y="471" width="127" height="134" rx="2" fill="none" stroke="#efe1cf" strokeWidth="3"/>
  </g>
}
