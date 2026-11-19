import Finishes from './Finishes'
import Stairs from './Stairs'

// Coordinates trace the NTS sheet in drawing units. Printed room sizes are independent.
type Wall = [name: string, x1: number, y1: number, x2: number, y2: number]
type Room = [name: string, size: string, x: number, y: number]
type Opening = [id: string, x: number, y: number, width: number, rotation: number]
const shell: Wall[] = [
  ['west facade', 47,104,47,700], ['north facade',47,104,521,104],
  ['east facade',521,104,521,700], ['hall south',47,700,521,700],
]
const ground: Wall[] = [
  ['utility west',40,6,40,104], ['utility north',40,6,528,6], ['utility east',528,6,528,104],
  ['kitchen to toilet',229,110,229,315],
  ['toilet south',229,246,312,246], ['bedroom west',312,104,312,377],
  ['bedroom to hall',311,377,521,377],
  ['portico west',40,704,40,1112], ['portico south',40,1112,528,1112], ['portico east',528,704,528,1112],
]
const first: Wall[] = [
  ['suite west partition',197,110,197,198], ['suite to common toilet',197,246,197,377],
  ['ensuite to wardrobe',50,195,197,195], ['wardrobe to common toilet',50,279,197,279],
  ['suite to hall',47,377,521,377], ['bedrooms shared partition',290,703,290,1171],
  ['southwest bathroom east',218,703,218,785], ['southwest bathroom south',50,782,218,782],
  ['southeast bathroom west',360,703,360,785], ['southeast bathroom south',360,782,521,782],
  ['southwest facade',47,701,47,1105], ['southeast facade',521,701,521,1105],
  ['bedrooms to balconies',47,1105,521,1105], ['west balcony edge',40,1105,40,1171],
  ['south balcony rail',40,1171,528,1171], ['east balcony edge',528,1105,528,1171],
]
const groundRooms: Room[] = [
  ['Utility','25′ × 5′',284,70], ['Kitchen','Open to dining',138,287],
  ['Ensuite','7′7½″ × 4′0″',270,172], ['Bedroom','11′0″ × 13′4½″',404,317],
  ['Dining','Seats four',114,460], ['Living hall','',235,555], ['Sit-out','',128,749], ['Bikes','',95,1042], ['Portico','25′0″ × 20′0″',321,751],
]
const firstRooms: Room[] = [
  ['Attached toilet','6′6″ × 4′0″',121,158], ['Walk-in wardrobe','6′6″ × 4′0″',123,222],
  ['Common toilet','6′6″ × 4′7½″',122,337], ['Main bedroom','16′0″ × 13′4½″',353,159],
  ['Hall','18′0″ × 16′0″',165,517], ['Toilet','8′4½″ × 4′0″',129,748],
  ['Toilet','8′4½″ × 4′0″',445,748], ['Bedroom','11′9″ × 16′0″',165,1016],
  ['Bedroom','11′0″ × 16′0″',407,1016], ['Balcony','12′6″ × 3′0″',166,1141],
  ['Balcony','11′9″ × 3′0″',416,1141],
]
const doors: Opening[][] = [
  [['utility entry',57,104,55,0],['ensuite from bedroom',312,198,44,90],['bedroom entry',312,370,53,-90],['front entry',94,700,78,0]],
  [['attached toilet',190,195,44,180],['common toilet',55,377,44,0],['suite entry',202,377,53,0],['west bedroom entry',277,700,53,180],['east bedroom entry',305,700,53,0],['west bath',215,782,44,180],['east bath',365,782,44,0],['west balcony',278,1105,53,180],['east balcony',305,1105,53,0]],
]
const windows: Opening[][] = [
  [['kitchen north',136,104,78,0],['bedroom east',521,112,78,90],['kitchen west',47,282,78,90],['hall west',47,407,117,90],['hall south',201,700,78,0]],
  [['suite bath north',110,104,78,0],['suite north',235,104,78,0],['suite east',521,200,117,90],['hall northwest',47,398,78,90],['hall southwest',47,596,78,90],['west bedroom',47,825,78,90],['east bedroom',521,825,78,90],['ensuite vent',47,114,39,90],['common vent',47,308,39,90],['west bath vent',47,705,39,90],['east bath vent',521,705,39,90]],
]

function Bed({x,y,turn=0}:{x:number;y:number;turn?:number}) {
  return <g transform={`translate(${x} ${y}) rotate(${turn})`}>
    <rect width="96" height="140" rx="5" fill="#fbf6eb"/>
    <rect y="38" width="96" height="100" rx="4" fill="url(#linen)"/>
    <path d="M1 48h94M1 117h94" stroke="#e0e7dd" strokeWidth="3"/>
    <rect x="5" y="6" width="40" height="22" rx="7"/><rect x="51" y="6" width="40" height="22" rx="7"/>
  </g>
}
function Furniture({upper}:{upper:boolean}) {
  return <g stroke="#a69a7f" strokeWidth="1.6" fill="#faf6ec">
    <g aria-label="Hall seating"><rect x="195" y="432" width="122" height="43" rx="7"/><path d="M202 440h108v27H202z M256 440v27"/><rect x="322" y="477" width="40" height="120" rx="7"/><path d="M330 485h24v104h-24z M330 536h24"/><rect x="252" y="505" width="40" height="53"/>{[196,261].map(x=><rect key={x} x={x} y="597" width="48" height="42" rx="6"/>)}</g>
    {upper ? <><Bed x={416} y={372} turn={180}/><Bed x={56} y={970} turn={-90}/><Bed x={515} y={872} turn={90}/></> :
    <><Bed x={509} y={197} turn={90}/><path d="M116 113h108V315h-35V151h-73z" fill="#d8c5ac"/><rect x="124" y="118" width="48" height="24" rx="5"/><circle cx="206" cy="181" r="9"/><circle cx="206" cy="210" r="9"/>
    <g aria-label="Dining handwash basin" transform="translate(244 250)">
      <rect width="53" height="31" rx="4" fill="#d6c7af"/>
      <ellipse cx="26.5" cy="17" rx="20" ry="10" fill="#fafbf7" stroke="#91a59c"/>
      <circle cx="26.5" cy="18" r="1.5" fill="#859790"/>
      <path d="M26.5 3v8" stroke="#687c76" strokeWidth="3" strokeLinecap="round"/>
      <text x="26.5" y="48" textAnchor="middle" stroke="none" fill="#263e34" fontSize="13">Handwash</text>
    </g>
    {[83,132].map(x=><g key={x}><rect x={x} y="350" width="30" height="23" rx="5"/><rect x={x} y="419" width="30" height="23" rx="5"/></g>)}
    <rect x="73" y="368" width="99" height="57" rx="9" fill="url(#oak)"/>
    {['Dishwasher','Washer','Wash stone','Fire stove'].map((name,i)=><g key={name} transform={`translate(${117+i*78} 12)`}><rect width="66" height="40" rx="3" fill={i===2?'#acada4':'#e3e8e4'}/>{i===1||i===3?<circle cx="33" cy="13" r="9" fill={i===1?'#97b9c0':'#605449'}/>:<path d="M8 9h50m-50 6h50"/>}<text x="33" y="34" textAnchor="middle" stroke="none" fill="#243b34" fontSize="11">{name}</text></g>)}
    <g aria-label="Kerala-style sit-out with timber bench and posts">
      <rect x="44" y="706" width="145" height="88" fill="#b46d50"/>
      <rect x="52" y="712" width="30" height="71" rx="3" fill="url(#oak)" stroke="#695039"/>
      <path d="M58 716v61m7-61v61m7-61v61" stroke="#87694c"/>
      {[52,174].map(x=><rect key={x} x={x} y="782" width="10" height="10" fill="#624632"/>)}
      <path d="M99 798h86m-86 5h86" stroke="#98745c"/>
    </g>
    {[71,113].map(x=><g key={x} transform={`translate(${x} 876)`} aria-label="Motorbike">
      <path d="M0 5v110" stroke="#374844" strokeWidth="12" strokeLinecap="round"/>
      <rect x="-12" y="18" width="24" height="78" rx="12" fill="#76908a"/>
      <rect x="-10" y="50" width="20" height="42" rx="8" fill="#404a49"/>
      <path d="M-16 21l6-5h20l6 5" fill="none" stroke="#374844" strokeWidth="4"/>
    </g>)}
    {[204,379].map(x=><g key={x} transform={`translate(${x} 788)`}><rect width="96" height="242" rx="25"/><rect x="9" y="39" width="78" height="148" rx="17"/><path d="M11 65q36 -18 74 0l-9 35H20z M16 176h64l6 20q-36 12 -75 0z"/></g>)}</>}
    {(upper?[[124,118],[109,284],[125,706],[446,706]]:[[271,116]]).map(([x,y])=><g key={y+x} transform={`translate(${x} ${y})`}><rect width="22" height="9" rx="2"/><ellipse cx="11" cy="18" rx="9" ry="13"/></g>)}
  </g>
}
export default function Plan({upper}:{upper:boolean}) {
  const index=Number(upper)
  return <svg viewBox="-48 -102 690 1310" role="img" aria-label={upper?'First floor plan':'Ground floor plan'}>
    <rect width="586" height="1171" fill="#fff" stroke="#959e94" strokeWidth="2"/>
    <Finishes upper={upper}/>
    <g className="furnishings"><Furniture upper={upper}/></g>
    <Stairs upper={upper}/>
    {[...shell,...(upper?first:ground)].map(([name,x1,y1,x2,y2])=><line key={name} data-wall={name} {...{x1,y1,x2,y2}} stroke="#354941" strokeWidth={shell.some(w=>w[0]===name)?10:5}/>)}
    {windows[index].map(([id,x,y,w,r])=><g key={id} data-window={id} transform={`translate(${x} ${y}) rotate(${r})`}><rect y="-5" width={w} height="10" fill="#dceff1" stroke="#54848a"/><path d={`M0 0h${w}`} stroke="#54848a"/></g>)}
    {doors[index].map(([id,x,y,w,r])=><g key={id} data-door={id} transform={`translate(${x} ${y}) rotate(${r})`}><path d={`M0 0h${w}`} stroke="white" strokeWidth="12"/><g transform={id==='utility entry'||id==='east bedroom entry'||id==='hall double right'||id==='attached toilet'||id==='west bath'||id==='west balcony'?'scale(1 -1)':undefined}><path d={`M0 0v-${w} A${w} ${w} 0 0 1 ${w} 0`} stroke="#64907b" fill="none" strokeWidth="2"/></g></g>)}
    {(upper?firstRooms:groundRooms).map(([name,size,x,y])=><g key={x+'-'+y} data-room={name} textAnchor="middle" fill="#213a30" stroke="white" strokeWidth="4" paintOrder="stroke"><text x={x} y={y} fontSize={name==='Walk-in wardrobe'?13:17} fontWeight="600">{name}</text><text x={x} y={y+19} fontSize="15">{size}</text></g>)}
    <g stroke="#829189" fill="none"><path d="M0 -72h586 M0 -78v12 M586 -78v12 M40 -34h488 M40 -40v12 M528 -40v12 M611 0v1171 M605 0h12 M605 1171h12"/></g>
    <g textAnchor="middle" fill="#475f51" fontSize="17"><text x="293" y="-77">30′</text><text x="284" y="-40">25′</text><text transform="translate(633 585) rotate(90)">60′</text><text x="293" y="1195">South · Street entrance</text></g>
  </svg>
}
