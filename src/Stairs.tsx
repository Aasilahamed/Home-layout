// Drawing coordinates follow the stair footprint on the east side of both halls.
export default function Stairs({upper}: {upper: boolean}) {
  return <g transform="translate(405 435)" aria-label="Staircase entered beside the bedroom at the north end of the hall">
    <rect width="108" height="314" fill="#e7d2af" stroke="#725d46" strokeWidth="2"/>
    <rect y="59" width="50" height="195" fill={upper ? '#e2e9e7' : '#f4eee5'}/>
    {upper && <path d="M2 61l46 191m0-191L2 252" stroke="#a5b4af" strokeDasharray="5 4"/>}
    {Array.from({length:12}, (_,i) => <g key={i}>
      <rect x="50" y={59+i*16.25} width="58" height="16.25" fill={`hsl(35 42% ${73+i*.95}%)`}/>
      <path d={`M50 ${60+i*16.25}h58`} stroke="#fff3d9" strokeWidth="2"/>
      <path d={`M50 ${75+i*16.25}h58`} stroke="#8d7252" strokeWidth="2"/>
    </g>)}
    {[16,33,50].map(x=><path key={x} d={`M${x} 0v59 M${x} 254v60`} stroke="#927858" strokeWidth="2"/>)}
  </g>
}
