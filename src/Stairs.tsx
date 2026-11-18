// Drawing coordinates follow the stair footprint on the east side of both halls.
export default function Stairs({upper}: {upper: boolean}) {
  return <g transform="translate(405 380)" aria-label="Staircase on the east side of the hall">
    <rect width="108" height="314" fill="#e7d2af" stroke="#725d46" strokeWidth="2"/>
    <rect y="59" width="50" height="195" fill={upper ? '#e2e9e7' : '#f4eee5'}/>
    {upper && <path d="M2 61l46 191m0-191L2 252" stroke="#a5b4af" strokeDasharray="5 4"/>}
    {Array.from({length:12}, (_,i) => <g key={i}>
      <rect x="50" y={59+i*16.25} width="58" height="16.25" fill={`hsl(35 42% ${84-i*.95}%)`}/>
      <path d={`M50 ${60+i*16.25}h58`} stroke="#fff3d9" strokeWidth="2"/>
      <path d={`M50 ${75+i*16.25}h58`} stroke="#8d7252" strokeWidth="2"/>
    </g>)}
    {[16,33,50].map(x=><path key={x} d={`M${x} 0v59 M${x} 254v60`} stroke="#927858" strokeWidth="2"/>)}
    <path d="M49 59v195" stroke="#5a685e" strokeWidth="4"/>
    <path d="M5 28h72v255H8" stroke="white" strokeWidth="8" fill="none" strokeLinejoin="round"/>
    <path d="M5 28h72v255H8" stroke="#22634e" strokeWidth="4" fill="none" strokeLinejoin="round"/>
    <circle cx={upper?8:5} cy={upper?283:28} r="5" fill="#22634e"/>
    <path d={upper?'M17 19L5 28l12 9':'M20 274L8 283l12 9'} stroke="#22634e" strokeWidth="4" fill="none"/>
  </g>
}
