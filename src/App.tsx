import { useState } from 'react'
import Plan from './Plan'
import Stairs from './Stairs'

export default function App() {
  const [upper, setUpper] = useState(false)
  const floor = upper ? 'First floor' : 'Ground floor'
  return <main>
    <header><div><p>COIMBATORE · SOUTH FACING</p><h1>Our home plan</h1></div>
    </header>
    <nav aria-label="Choose floor">{['Ground floor','First floor'].map((name,i)=>
      <button key={name} aria-pressed={name===floor} onClick={()=>setUpper(i===1)}>{name}</button>)}</nav>
    <section className="viewer">
      <figure><figcaption><h2>{floor}</h2><small>↑ North</small></figcaption><Plan upper={upper}/></figure>
      <aside><p className="label">FLOOR GUIDE</p><h2>{floor}</h2>
        <p>{upper ? 'The two equal master bedrooms occupy the north end. An open hallway continues south to the balcony. The rectangular guest room occupies the southeast corner, with its own door from the hallway and an attached bathroom.' : 'From the south road, the two bikes park on the left and the two cars alongside them. A small Kerala-style sit-out with a timber bench leads directly into the hall. The bedroom has its own bathroom entrance.'}</p>
        <dl><dt>{upper?'Rear suite facilities':'Rear utility'}</dt><dd>25′ × 5′</dd><dt>Plot dimensions</dt><dd>30 × 60 ft</dd></dl>
        {!upper && <><h3>Kitchen & utility</h3><p>A handwash basin opens toward the dining table in the recess beside the kitchen counter. The full-width rear utility holds the dishwasher, washing machine, washing stone and fire stove.</p></>}
        <h3>Stair detail</h3><div className="detail"><svg viewBox="399 372 122 330" role="img" aria-label="Enlarged staircase"><Stairs upper={upper}/></svg><div><strong>{upper?'Down to ground floor':'Up to first floor'}</strong><p>The stairs run along the east wall of the hall. Follow the green line around the two turns.</p></div></div>
        <small>The stair detail illustrates the route. Use the printed dimensions on the engineer’s NTS sheet for measurements.</small>
      </aside>
    </section>
  </main>
}
