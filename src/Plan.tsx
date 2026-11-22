import Finishes from './Finishes'
import Stairs from './Stairs'

// Coordinates trace the NTS sheet in drawing units. Printed room sizes are independent.
type Wall = [name: string, x1: number, y1: number, x2: number, y2: number]
type Room = [name: string, size: string, x: number, y: number]
type Opening = [id: string, x: number, y: number, width: number, rotation: number]
export const shell: Wall[] = [
  ['west facade', 47,104,47,700], ['north facade',47,104,521,104],
  ['east facade',521,104,521,700], ['hall south',47,700,521,700],
]
const upperShell: Wall[] = [
  ...shell.filter(([name]) => name !== 'north facade' && name !== 'hall south'),
  ['north facade',40,6,528,6], ['rear west facade',40,6,40,104],
  ['rear east facade',528,6,528,104], ['west corner',40,104,47,104],
  ['east corner',521,104,528,104],
]
export const ground: Wall[] = [
  ['utility west',40,66,40,104], ['utility north',40,6,528,6], ['utility east',528,6,528,104],
  ['rear common bath north',-18.6,6,40,6], ['rear common bath west',-18.6,6,-18.6,66],
  ['rear common bath east',136,6,136,66], ['rear common bath south',-18.6,66,136,66],
  ['kitchen to toilet',229,110,229,315],
  ['toilet south',229,246,312,246], ['bedroom west',312,104,312,377],
  ['bedroom to hall',311,377,521,377],
  ['portico west',40,704,40,1112], ['portico south',40,1112,528,1112], ['portico east',528,704,528,1112],
]
const first: Wall[] = [
  ['master suite divider',284,6,284,377],
  ['west ensuite side',177,6,177,104], ['west ensuite front',40,104,177,104],
  ['east ensuite side',391,6,391,104], ['east ensuite front',391,104,528,104],
  ['suite to hall',47,377,521,377],
  ['guest bath north',331,700,521,700], ['guest suite west',331,700,331,1105],
  ['balcony divider',331,1105,331,1171],
  ['guest bathroom partition',331,782,521,782],
  ['southwest facade',47,701,47,1105], ['southeast facade',521,701,521,1105],
  ['bedrooms to balconies',47,1105,521,1105], ['west balcony edge',40,1105,40,1171],
  ['south balcony rail',40,1171,528,1171], ['east balcony edge',528,1105,528,1171],
]
const groundRooms: Room[] = [
  ['Utility','25′ × 5′ rear strip',345,75], ['Kitchen','Open to dining',163,287],
  ['Common bath','',58,53],
  ['Ensuite','7′7½″ × 4′0″',270,172], ['Bedroom','11′0″ × 13′4½″',404,317],
  ['Dining','Seats four',114,460], ['Living hall','',235,555], ['Sit-out','',128,749], ['Bikes','',95,1042], ['Portico','25′0″ × 20′0″',321,751],
]
const firstRooms: Room[] = [
  ['Master bedroom 1','≈ 12′ × 14′',165,303], ['Master bedroom 2','≈ 12′ × 14′',403,303],
  ['Ensuite','≈ 7′ × 5′',107,82], ['Ensuite','≈ 7′ × 5′',461,82],
  ['Dressing','',231,79], ['Dressing','',337,79],
  ['Hallway','',307,535],
  ['Guest bath','Ensuite',426,751], ['Open hallway','',184,958],
  ['Guest room','Single bed + ensuite',423,1060],
  ['Balcony','',186,1141], ['Balcony','',428,1141],
]
export const doors: Opening[][] = [
  [['utility entry',162,104,51,0],['rear common bath door',-10,66,44,0],['ensuite from bedroom',312,198,44,90],['bedroom entry',312,370,53,-90],['front entry',94,700,78,0]],
  [['west ensuite',123,104,44,0],['east ensuite',403,104,44,0],['west master door',202,377,53,0],['east master door',305,377,53,0],['guest room entry',331,825,53,90],['east bath',365,782,44,0],['west balcony',278,1105,53,180],['east balcony',348,1105,53,0]],
]
export const windows: Opening[][] = [
  [['kitchen north',116,104,34,0],['bedroom east',521,112,78,90],['kitchen west',47,282,78,90],['double-height hall window',47,480,128,90],['hall south',201,700,78,0]],
  [['west master window',47,200,117,90],['suite east',521,200,117,90],['double-height hall window',47,480,128,90],['west bedroom',47,825,78,90],['east bedroom',521,825,78,90],['west ensuite vent',71,6,39,0],['east ensuite vent',458,6,39,0],['east bath vent',521,705,39,90]],
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
    {!upper && <g aria-label="Hall seating"><rect x="195" y="432" width="122" height="43" rx="7"/><path d="M202 440h108v27H202z M256 440v27"/><rect x="322" y="477" width="40" height="120" rx="7"/><path d="M330 485h24v104h-24z M330 536h24"/><rect x="252" y="505" width="40" height="53"/>{[196,261].map(x=><rect key={x} x={x} y="597" width="48" height="42" rx="6"/>)}</g>}
    {upper ? <><Bed x={93} y={142}/><Bed x={379} y={142}/>
      {[185,292].map(x=><g key={x} aria-label="Fitted wardrobe"><rect x={x} y="12" width="91" height="33" fill="url(#oak)"/><path d={`M${x+45} 12v33`}/></g>)}
      <g aria-label="Guest single bed"><rect x="451" y="902" width="61" height="133" rx="5"/><rect x="456" y="909" width="51" height="22" rx="6"/><rect x="451" y="938" width="61" height="96" rx="4" fill="url(#linen)"/></g>
      <rect aria-label="Linen cupboard" x="488" y="795" width="28" height="88" fill="url(#oak)"/></> :
    <><Bed x={509} y={197} turn={90}/>
    <g aria-label="Kitchen counter along the west wall">
      <rect x="55" y="113" width="51" height="210" fill="#d8c5ac"/>
      <rect x="61" y="125" width="39" height="31" rx="5" fill="#edf2ed"/>
      <rect x="61" y="236" width="39" height="55" rx="3" fill="#61645b"/>
      <circle cx="80" cy="250" r="9" fill="none" stroke="#d4d7c8"/>
      <circle cx="80" cy="276" r="9" fill="none" stroke="#d4d7c8"/>
    </g>
    <g aria-label="Rear common bathroom">
      <rect x="103" y="14" width="24" height="17" rx="4" fill="#f9fcf8"/>
      <rect x="56" y="12" width="20" height="8" rx="2" fill="#fff"/>
      <ellipse cx="66" cy="28" rx="9" ry="12" fill="#fff"/>
    </g>
    <g aria-label="Dining handwash basin" transform="translate(244 250)">
      <rect width="53" height="31" rx="4" fill="#d6c7af"/>
      <ellipse cx="26.5" cy="17" rx="20" ry="10" fill="#fafbf7" stroke="#91a59c"/>
      <circle cx="26.5" cy="18" r="1.5" fill="#859790"/>
      <path d="M26.5 3v8" stroke="#687c76" strokeWidth="3" strokeLinecap="round"/>
      <text x="26.5" y="48" textAnchor="middle" stroke="none" fill="#263e34" fontSize="13">Handwash</text>
    </g>
    {[83,132].map(x=><g key={x}><rect x={x} y="350" width="30" height="23" rx="5"/><rect x={x} y="419" width="30" height="23" rx="5"/></g>)}
    <rect x="73" y="368" width="99" height="57" rx="9" fill="url(#oak)"/>
    {['Dishwasher','Washer','Wash stone','Fire stove'].map((name,i)=><g key={name} transform={`translate(${150+i*86} 12)`}><rect width="66" height="40" rx="3" fill={i===2?'#acada4':'#e3e8e4'}/>{i===1||i===3?<circle cx="33" cy="13" r="9" fill={i===1?'#97b9c0':'#605449'}/>:<path d="M8 9h50m-50 6h50"/>}<text x="33" y="34" textAnchor="middle" stroke="none" fill="#243b34" fontSize="11">{name}</text></g>)}
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
    {(upper?[[54,16],[493,16],[446,706]]:[[271,116]]).map(([x,y])=><g key={y+x} transform={`translate(${x} ${y})`}><rect width="22" height="9" rx="2"/><ellipse cx="11" cy="18" rx="9" ry="13"/></g>)}
  </g>
}
export default function Plan({upper}:{upper:boolean}) {
  const facade = upper ? upperShell : shell
  const index=Number(upper)
  return <svg viewBox="-48 -102 690 1310" role="img" aria-label={upper?'First floor plan':'Ground floor plan'}>
    <rect width="586" height="1171" fill="#fff" stroke="#959e94" strokeWidth="2"/>
    <g transform="translate(18.6 0)">
    <Finishes upper={upper}/>
    <g className="furnishings"><Furniture upper={upper}/></g>
    <g aria-label={upper ? 'Left-side double-height void overlooking the living hall' : 'Double-height ceiling on the left side of the hall'}>
      {upper ? <>
        <rect x="52" y="466" width="156" height="156" fill="url(#stone)"/>
        <rect x="52" y="466" width="156" height="156" fill="#46665b" fillOpacity=".15"/>
        <path d="M52 466H208V622H52" fill="none" stroke="#637c72" strokeWidth="5"/>
        <path d="M52 461H213V627H52" fill="none" stroke="#9bb2a8" strokeWidth="2"/>
        {[52,91,130,169,208].map(x => <g key={x} fill="#354941"><circle cx={x} cy="466" r="3"/><circle cx={x} cy="622" r="3"/></g>)}
        {[505,544,583].map(y => <circle key={y} cx="208" cy={y} r="3" fill="#354941"/>)}
        <g textAnchor="middle" fill="#213a30" stroke="#f6f4ed" strokeWidth="4" paintOrder="stroke">
          <text x="130" y="521" fontSize="16" fontWeight="600">Open to below</text>
          <text x="130" y="544" fontSize="12">Living hall below</text>
          <text x="130" y="566" fontSize="12">≈ 8′ × 8′ proposed</text>
        </g>
      </> : <>
        <path d="M52 466H208V622H52" fill="none" stroke="#607e71" strokeWidth="1.5" strokeDasharray="6 4"/>
        <g textAnchor="middle" fill="#475f51" stroke="white" strokeWidth="3" paintOrder="stroke" fontSize="13">
          <text x="130" y="535">Double-height</text><text x="130" y="555">ceiling above</text>
        </g>
      </>}
    </g>
    <Stairs upper={upper}/>
    {[...facade,...(upper?first:ground)].map(([name,x1,y1,x2,y2])=><line key={name} data-wall={name} {...{x1,y1,x2,y2}} stroke="#354941" strokeWidth={facade.some(w=>w[0]===name)?10:5}/>)}
    {windows[index].map(([id,x,y,w,r])=><g key={id} data-window={id} transform={`translate(${x} ${y}) rotate(${r})`}><rect y="-5" width={w} height="10" fill="#dceff1" stroke="#54848a"/><path d={`M0 0h${w}`} stroke="#54848a"/></g>)}
    <g aria-label="Tall left-wall window spanning ground and first floors" stroke="#54848a" fill="#dceff1">
      <rect x="42" y="480" width="10" height="128"/>
      <path d="M47 480v128 M42 512h10 M42 544h10 M42 576h10"/>
      <text transform="translate(30 544) rotate(-90)" textAnchor="middle" fill="#475f51" stroke="white" strokeWidth="3" paintOrder="stroke" fontSize="11">Two-storey window</text>
    </g>
    {doors[index].map(([id,x,y,w,r])=><g key={id} data-door={id} transform={`translate(${x} ${y}) rotate(${r})`}><path d={`M0 0h${w}`} stroke="white" strokeWidth="12"/><g transform={id==='utility entry'||id==='east bedroom entry'||id==='hall double right'||id==='attached toilet'||id==='west balcony'?'scale(1 -1)':undefined}><path d={`M0 0v-${w} A${w} ${w} 0 0 1 ${w} 0`} stroke="#64907b" fill="none" strokeWidth="2"/></g></g>)}
    {!upper && <g data-door="Side passage utility gate" aria-label="Gate to utility, turn right from the left passage">
      <path d="M40 70v30" stroke="white" strokeWidth="12"/>
      <path d="M40 70h30 M40 74h30 M46 70v4 M52 70v4 M58 70v4 M64 70v4 M70 70v4" fill="none" stroke="#79674c" strokeWidth="2"/>
      <path d="M70 70A30 30 0 0 1 40 100" fill="none" stroke="#79674c" strokeWidth="1" strokeDasharray="3 2"/>
    </g>}
    {(upper?firstRooms:groundRooms).map(([name,size,x,y])=><g key={x+'-'+y} data-room={name} textAnchor="middle" fill="#213a30" stroke="white" strokeWidth="4" paintOrder="stroke"><text x={x} y={y} fontSize={name==='Walk-in wardrobe'?13:17} fontWeight="600">{name}</text><text x={x} y={y+19} fontSize="15">{size}</text></g>)}
    </g>
    <g stroke="#829189" fill="none"><path d="M0 -72h586 M0 -78v12 M586 -78v12 M58.6 -34h488 M58.6 -40v12 M546.6 -40v12 M611 0v1171 M605 0h12 M605 1171h12"/></g>
    <g textAnchor="middle" fill="#475f51" fontSize="17"><text x="293" y="-77">30′</text><text x="302.6" y="-40">25′</text><text transform="translate(633 585) rotate(90)">60′</text><text x="293" y="1195">South · Street entrance</text></g>
    <g aria-label="Side clearances" stroke="#829189" fill="none">
      <path d="M0 680h58.6 M0 674v12 M58.6 674v12 M546.6 680h39.4 M546.6 674v12 M586 674v12"/>
    </g>
    <g fontSize="15" textAnchor="middle" fill="#475f51"><text x="29.3" y="667">3′</text><text x="566.3" y="667">2′</text></g>
  </svg>
}
