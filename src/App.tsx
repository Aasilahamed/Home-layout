import { lazy, Suspense, useState } from 'react'
import Plan from './Plan'
import Stairs from './Stairs'

const GroundFloor3D = lazy(() => import('./GroundFloor3D'))

export default function App() {
  const [model, setModel] = useState(false)
  const [upper, setUpper] = useState(false)
  const floor = upper ? 'First floor' : 'Ground floor'
  return <main>
    <header><div><p>COIMBATORE · SOUTH FACING</p><h1>Our home plan</h1></div>
    </header>
    <nav aria-label="Choose floor">{['Ground floor','First floor'].map((name,i)=>
      <button key={name} aria-pressed={name===floor} onClick={()=>setUpper(i===1)}>{name}</button>)}</nav>
    {!upper && <nav aria-label="Choose ground-floor view"><button aria-pressed={!model} onClick={()=>setModel(false)}>2D plan</button><button aria-pressed={model} onClick={()=>setModel(true)}>3D model</button></nav>}
    {model && !upper ? <Suspense fallback={<p role="status">Loading the ground-floor model…</p>}><GroundFloor3D/></Suspense> : <section className="viewer">
      <figure><figcaption><h2>{floor}</h2><small>↑ North</small></figcaption><Plan upper={upper}/></figure>
      <aside><p className="label">FLOOR GUIDE</p><h2>{floor}</h2>
        <p>{upper ? 'The two equal master bedrooms occupy the north end. An open hallway continues south to the balcony. The rectangular guest room occupies the southeast corner, with its own door from the hallway and an attached bathroom.' : 'From the south road, the two bikes park on the left and the two cars alongside them. A small Kerala-style sit-out with a timber bench leads directly into the hall. The bedroom has its own bathroom entrance.'}</p>
        <dl><dt>{upper?'Rear suite facilities':'Rear utility'}</dt><dd>25′ × 5′</dd><dt>Plot dimensions</dt><dd>30 × 60 ft</dd></dl>
        {!upper && <><h3>Kitchen & utility</h3><p>Follow the 3 ft left passage straight to the common restroom door. Turn right at its entrance to pass through the utility gate. The kitchen counter remains along the west wall, with a separate door into the utility. The right clearance is 2 ft.</p><small>The bathroom outline follows your marked location; its dimensions need confirmation. It extends across the end of the left passage and into the rear utility strip.</small></>}
        <h3>Double-height hall</h3><p>{upper ? 'The opening sits against the left exterior wall, overlooking the ground-floor hall. Railings protect its three open edges, and the hallway passes on the right. A tall window spans both floors along the left wall.' : 'The dashed outline marks the high-ceiling area on the left side of the hall. One tall window on the left exterior wall extends through both floors.'}</p><small>Proposed opening: approximately 8 × 8 ft. Final opening size, roof height and structural support need your engineer’s confirmation.</small>
        <svg viewBox="0 0 280 230" role="img" aria-label="Illustrative interior elevation of the left hall wall: one tall window spans both floors" style={{width:'100%', marginTop:16}}>
          <rect x="35" y="20" width="210" height="170" fill="#ece6dc" stroke="#8b998f" strokeWidth="3"/>
          <rect x="95" y="33" width="90" height="145" fill="#dceff1" stroke="#54848a" strokeWidth="4"/>
          <path d="M125 33v145 M155 33v145 M95 80h90 M95 130h90" stroke="#78a4aa" fill="none"/>
          <path d="M35 105h60m90 0h60" stroke="#8b998f" strokeDasharray="4 4"/>
          <g fill="#475f51" fontSize="10" textAnchor="middle"><text x="64" y="70">First floor</text><text x="64" y="155">Ground</text><text x="64" y="168">floor</text><text x="140" y="210">Left wall · continuous tall window</text><text x="140" y="226">Illustrative elevation · not to scale</text></g>
        </svg>
        <h3>Stair detail</h3><div className="detail"><svg viewBox="399 372 122 330" role="img" aria-label="Enlarged staircase"><Stairs upper={upper}/></svg><div><strong>{upper?'Down to ground floor':'Up to first floor'}</strong><p>The stairs run along the east wall of the hall. Follow the green line around the two turns.</p></div></div>
        <small>The stair detail illustrates the route. Use the printed dimensions on the engineer’s NTS sheet for measurements.</small>
      </aside>
    </section>}
  </main>
}
