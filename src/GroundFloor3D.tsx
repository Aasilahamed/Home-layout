import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { doorAngle, stairTreads } from './modelGeometry'
import { surfaceTexture } from './modelMaterials'
import { shell, ground, doors, windows } from './Plan'

// Reuse the 2D drawing coordinates; vertical dimensions are illustrative feet.
const scale = 19.52
const px = (x:number) => (x + 18.6) / scale - 15
const pz = (z:number) => z / scale - 30

export default function GroundFloor3D() {
  const host = useRef<HTMLDivElement>(null)
  const cameraActions = useRef<(view:string)=>void>(()=>{})
  const savedCamera = useRef<{position:THREE.Vector3;target:THREE.Vector3}|null>(null)
  const [lowWalls,setLowWalls] = useState(true)
  const [error,setError] = useState(false)
  useEffect(() => {
    const container=host.current!
    let renderer:THREE.WebGLRenderer
    try { renderer=new THREE.WebGLRenderer({antialias:true}) } catch {setError(true);return}
    setError(false)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
    renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    renderer.setClearColor('#e9eee8')
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.12
    renderer.domElement.setAttribute('aria-label','Interactive ground-floor model. Drag to rotate; scroll or pinch to zoom. Use the view buttons for keyboard navigation.')
    container.appendChild(renderer.domElement)
    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(40,1,.1,400)
    const controls=new OrbitControls(camera,renderer.domElement)
    controls.maxPolarAngle=Math.PI/2-.04
    controls.minDistance=14;controls.maxDistance=190
    const render=()=>renderer.render(scene,camera)
    controls.addEventListener('change',render)
    cameraActions.current=(view)=>{
      if(view==='Zoom in'||view==='Zoom out'){
        const distance=camera.position.distanceTo(controls.target)
        const next=THREE.MathUtils.clamp(distance*(view==='Zoom in'?.8:1.25),controls.minDistance,controls.maxDistance)
        camera.position.sub(controls.target).multiplyScalar(next/distance).add(controls.target);controls.update();render();return
      }
      controls.target.set(0,0,view==='Interior'?-5:0)
      if(view==='Top')camera.position.set(0,110,.01)
      else if(view==='Interior')camera.position.set(27,30,25)
      else camera.position.set(46,58,72)
      camera.position.sub(controls.target).multiplyScalar(Math.max(1,.95/camera.aspect)).add(controls.target)
      controls.update();render()
    }
    scene.add(new THREE.HemisphereLight('#fff9e9','#68766b',2.0))
    const sun=new THREE.DirectionalLight('#fff3dc',2.2)
    sun.position.set(-25,55,20);sun.castShadow=true
    Object.assign(sun.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:140})
    sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0005;sun.shadow.normalBias=.035;sun.shadow.radius=3;scene.add(sun)
    const textures={wood:surfaceTexture('wood'),stone:surfaceTexture('stone'),fabric:surfaceTexture('fabric')}
    const woodColors=new Set(['#caa77b','#aa8963','#b9986e','#b89362','#c2a17b','#b59062','#d1ad7e','#d4bb92'])
    const fabricColors=new Set(['#8da99a','#759283','#8eac9b','#f3eee1','#fff9ed','#bba58c'])
    const materials=new Map<string,THREE.MeshStandardMaterial>()
    const material=(color:string,opacity=1)=>{
      const key=color+opacity
      if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.7,transparent:opacity<1,opacity,depthWrite:opacity===1}))
      const mat=materials.get(key)!
      mat.map=woodColors.has(color)?textures.wood:fabricColors.has(color)?textures.fabric:['#e9e3d6','#e2ddcf','#cbc7ba'].includes(color)?textures.stone:null
      mat.roughness=fabricColors.has(color)?.95:color==='#e2ddcf'?.3:.65
      return mat
    }
    const box=(x:number,z:number,w:number,d:number,h:number,color:string,bottom=0,opacity=1)=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w/scale,h,d/scale),material(color,opacity))
      m.position.set(px(x+w/2),bottom+h/2,pz(z+d/2));m.castShadow=opacity===1;m.receiveShadow=true;scene.add(m);return m
    }
    const rounded=(x:number,z:number,w:number,d:number,h:number,color:string,bottom=0,radius=.12)=>{
      const m=box(x,z,w,d,h,color,bottom)
      m.geometry.dispose();m.geometry=new RoundedBoxGeometry(w/scale,h,d/scale,3,Math.min(radius,h/2,w/scale/2,d/scale/2))
      return m
    }
    const rod=(from:THREE.Vector3,to:THREE.Vector3,radius:number,color:string)=>{
      const direction=to.clone().sub(from)
      const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,direction.length(),12),material(color))
      m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());m.castShadow=true;scene.add(m);return m
    }
    const ball=(x:number,z:number,rx:number,rz:number,h:number,color:string,bottom=0)=>{
      const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),material(color))
      m.scale.set(rx/scale,h/2,rz/scale);m.position.set(px(x),bottom+h/2,pz(z));m.castShadow=true;scene.add(m);return m
    }
    const label=(text:string,x:number,z:number,y=.15)=>{
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=80
      const ctx=canvas.getContext('2d')!;ctx.fillStyle='rgba(249,250,245,.92)';ctx.fillRect(0,0,512,80)
      ctx.fillStyle='#254b3d';ctx.font='600 30px system-ui';ctx.textAlign='center';ctx.fillText(text,256,51)
      const texture=new THREE.CanvasTexture(canvas)
      const m=new THREE.Mesh(new THREE.PlaneGeometry(7,1.1),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,toneMapped:false}))
      m.rotation.x=-Math.PI/2;m.position.set(px(x),y,pz(z));scene.add(m)
    }
    box(-18.6,0,586,1171,.35,'#abb6a6',-.45)
    box(40,6,488,98,.12,'#b7d1c7')
    box(47,104,474,596,.12,'#e9e3d6')
    box(312,104,209,273,.14,'#d1ad7e')
    box(229,104,83,142,.15,'#aac9c2')
    box(-18.6,6,154.6,60,.15,'#b8cfc4')
    box(40,704,488,408,.12,'#cbc7ba')
    // Tile joints follow each surface, remaining visible at oblique angles.
    for(let x=47;x<521;x+=47)box(x,104,.7,596,.005,'#d2cbbd',.125)
    for(let z=104;z<700;z+=47)box(47,z,474,.7,.005,'#d2cbbd',.126)
    for(let z=704;z<1112;z+=32)box(40,z,488,1,.01,'#b8b5aa',.13)
    for(let z=110;z<377;z+=12)box(313,z,207,.6,.01,'#bb956b',.15)
    // Split each wall at its actual doors/windows rather than drawing solid walls over them.
    const openings=[...doors[0].map(o=>({o,window:false})),...windows[0].map(o=>({o,window:true})),{o:['utility gate',40,70,30,90] as [string,number,number,number,number],window:false}]
    for(const [name,x1,z1,x2,z2] of [...shell,...ground]){
      const horizontal=z1===z2
      const start=horizontal?Math.min(x1,x2):Math.min(z1,z2)
      const end=horizontal?Math.max(x1,x2):Math.max(z1,z2)
      const height=name.startsWith('portico')?.45:lowWalls?3.1:10
      const cuts=openings.flatMap(({o:[id,x,z,w,r],window})=>{
        const isHorizontal=r===0||r===180
        if(horizontal!==isHorizontal || Math.abs((horizontal?z:x)-(horizontal?z1:x1))>1)return []
        const a=horizontal?x:z, b=a+(r===180||r===-90?-w:w)
        const lo=Math.max(start,Math.min(a,b)),hi=Math.min(end,Math.max(a,b))
        return hi>lo?[{lo,hi,window,id}]:[]
      }).sort((a,b)=>a.lo-b.lo)
      const thickness=shell.some(w=>w[0]===name)?10:5
      const segment=(a:number,b:number,h:number,base=0)=>{
        if(b<=a||h<=0)return
        box(horizontal?a:x1-thickness/2,horizontal?z1-thickness/2:a,horizontal?b-a:thickness,horizontal?thickness:b-a,h,'#eee9dc',base)
        if(lowWalls&&h===height)box(horizontal?a:x1-thickness/2,horizontal?z1-thickness/2:a,horizontal?b-a:thickness,horizontal?thickness:b-a,.045,'#8a998a',base+h)
      }
      let cursor=start
      for(const cut of cuts){
        segment(cursor,cut.lo,height)
        if(cut.window){segment(cut.lo,cut.hi,Math.min(height,cut.id.includes('double-height')?.6:3));if(!cut.id.includes('double-height'))segment(cut.lo,cut.hi,height-8,8)}
        else segment(cut.lo,cut.hi,height-7,7)
        cursor=Math.max(cursor,cut.hi)
      }
      segment(cursor,end,height)
    }
    // Glass and dark frames; the left hall window continues through two storeys.
    for(const [id,x,z,w,r] of windows[0]){
      const tall=id==='double-height hall window',vertical=r===90
      const sill=tall?.6:3,height=tall?19:5
      box(x-1,z-1,vertical?2:w,vertical?w:2,height,'#9bcbd2',sill,.25)
      for(const t of [0,.5,1])box(vertical?x-2:x+w*t-1,vertical?z+w*t-1:z-2,vertical?4:2,vertical?2:4,height,'#496a65',sill)
      for(const y of [sill,sill+height/2,sill+height])box(x-2,z-2,vertical?4:w,vertical?w:4,.09,'#496a65',y)
    }
    if(!lowWalls){
      box(44,466,6,14,20,'#eee9dc')
      box(44,608,6,14,20,'#eee9dc')
      box(44,480,6,128,.4,'#eee9dc',19.6)
    }
    // Open timber leaves give entrances a readable direction of travel.
    for(const [id,x,z,w,r] of doors[0]){
      const pivot=new THREE.Group();pivot.position.set(px(x),.12,pz(z))
      pivot.rotation.y=doorAngle(r,id==='utility entry')
      const leaf=new THREE.Mesh(new THREE.BoxGeometry(w/scale,7,.10),material('#b89362'))
      leaf.position.set(w/scale/2,3.5,0);leaf.castShadow=true;pivot.add(leaf)
      for(const y of [1.8,4.8]){
        const panel=new THREE.Mesh(new THREE.BoxGeometry(w/scale-.28,2.2,.025),material('#caa77b'))
        panel.position.set(w/scale/2,y,.065);pivot.add(panel)
      }
      const handle=new THREE.Mesh(new THREE.BoxGeometry(.22,.055,.14),material('#57645a'))
      handle.position.set(w/scale-.25,3.3,.13);pivot.add(handle);scene.add(pivot)
    }
    for(let x=40;x<=70;x+=5)box(x,70,1.4,2,5,'#4d6358')
    box(40,70,31,2,.15,'#4d6358',5)
    // Living room, dining and west-wall kitchen.
    box(211,466,137,144,.04,'#bba58c',.15)
    const sofa=(x:number,z:number,w:number,d:number,east=false,chair=false)=>{
      for(const dx of [5,w-9])for(const dz of [5,d-9])box(x+dx,z+dz,4,4,.35,'#745e45',.15)
      rounded(x,z,w,d,.65,'#759283',.5)
      if(east){
        rounded(x+w-8,z,8,d,1.8,'#759283',1)
        for(let i=0;i<3;i++)rounded(x+3,z+8+i*(d-16)/3,w-13,(d-18)/3,.55,'#8da99a',1.15)
        for(const dz of [0,d-7])rounded(x,z+dz,w,7,1.4,'#759283',.8)
      }else{
        const back=chair?z+d-8:z
        rounded(x,back,w,8,1.8,'#759283',1)
        const n=chair?1:3
        for(let i=0;i<n;i++)rounded(x+8+i*(w-16)/n,z+(chair?3:10),(w-18)/n,d-13,.55,'#8da99a',1.15)
        for(const dx of [0,w-7])rounded(x+dx,z,7,d,1.4,'#759283',.8)
      }
    }
    sofa(195,432,122,43);sofa(322,477,40,120,true)
    for(const x of [196,261])sofa(x,597,48,42,false,true)
    rounded(252,505,40,53,.2,'#caa77b',1.25)
    for(const x of [254,285])for(const z of [507,550])box(x,z,4,4,1.1,'#77583e',.15)
    rounded(73,368,99,57,.18,'#caa77b',2.45)
    for(const x of [79,163])for(const z of [374,415])box(x,z,4,4,2.3,'#886a4b',.15)
    for(const x of [83,132])for(const z of [350,419]){
      rounded(x,z,30,23,.22,'#fff9ed',1.5)
      rounded(x,z===350?z:z+19,30,4,1.5,'#b89362',1.5)
      for(const dx of [3,24])for(const dz of [3,18])box(x+dx,z+dz,3,3,1.35,'#886a4b',.15)
    }
    box(55,113,51,210,2.8,'#c2a17b',.15);rounded(53,111,55,214,.16,'#e2ddcf',2.95)
    for(let z=118;z<315;z+=34){
      box(106,z,1,31,2.4,'#b89362',.35)
      box(107,z+13,1.5,10,.07,'#596a60',2.4)
    }
    rod(new THREE.Vector3(px(60),3.15,pz(139)),new THREE.Vector3(px(60),4.05,pz(139)),.045,'#768a85')
    rod(new THREE.Vector3(px(60),4.05,pz(139)),new THREE.Vector3(px(72),4.05,pz(139)),.045,'#768a85')
    box(61,125,39,31,.04,'#718e8d',3.12);ball(80,140,16,11,.07,'#c1d4d1',3.15)
    box(61,236,39,55,.08,'#364b47',3.12)
    for(const z of [250,276])ball(80,z,9,9,.04,'#9da59d',3.2)
    box(244,250,53,31,2.5,'#c8b498',.15);ball(270,267,20,10,.2,'#f4f4eb',2.7)
    // Bedroom and wet areas.
    box(370,197,139,96,1.1,'#aa8963',.15);rounded(372,199,135,92,.75,'#f3eee1',1.25)
    rounded(372,199,96,92,.2,'#8eac9b',2);box(494,197,12,96,3.2,'#b9986e',.15)
    for(const z of [204,249])rounded(472,z,27,36,.3,'#fff9ed',2)
    for(const [x,z] of [[270,125],[66,28]]){ball(x,z,11,16,1.3,'#fafaf1',.15);ball(x,z+3,7,10,.1,'#aebfb8',1.46);box(x-10,z-17,20,9,2.2,'#fafaf1',.15)}
    box(103,14,24,17,2.4,'#f6f6ed',.15)
    for(let i=0;i<4;i++){
      const x=150+i*86
      rounded(x,12,66,40,2.8,i===2?'#969f95':'#dddeda',.15)
      if(i===1){
        const ring=new THREE.Mesh(new THREE.TorusGeometry(.66,.12,12,32),material('#6c7977'))
        ring.position.set(px(x+33),1.55,pz(52)+.025);scene.add(ring)
        const glass=new THREE.Mesh(new THREE.CircleGeometry(.57,32),material('#4f7278'))
        glass.position.set(px(x+33),1.55,pz(52)+.03);scene.add(glass)
        box(x+5,52,56,1,.28,'#b7bfba',2.55)
        ball(x+53,52,3,2,.15,'#394b45',2.59)
      }else if(i===0){
        box(x+4,52,58,1,2.2,'#bdc6c0',.3)
        box(x+16,53,34,2,.08,'#53685d',2.55)
      }else if(i===2){
        box(x+6,18,54,28,.08,'#718278',2.96)
        for(let z=20;z<44;z+=4)box(x+8,z,50,.6,.03,'#a1aaa0',3.05)
      }else{
        box(x+5,17,56,30,.08,'#716253',2.96)
        ball(x+33,32,12,12,.08,'#332c26',3.04)
        box(x+20,52,26,1,.8,'#4b4033',.5)
      }
    }
    rod(new THREE.Vector3(px(270),2.9,pz(252)),new THREE.Vector3(px(270),3.6,pz(252)),.04,'#768a85')
    rod(new THREE.Vector3(px(270),3.6,pz(252)),new THREE.Vector3(px(270),3.6,pz(261)),.04,'#768a85')
    box(240,221,7,7,.025,'#71847b',.16)
    // Equal risers end exactly at the assumed first-floor level.
    const treads=stairTreads()
    for(const t of treads){
      box(t.x,t.z,t.width,t.depth,t.height,'#d4bb92',.15)
      box(t.x,t.z,t.width,t.depth,.06,'#caa77b',t.height+.15)
    }
    const railPoints:THREE.Vector3[]=[]
    for(const t of treads.slice(3,15)){
      const foot=new THREE.Vector3(px(454),t.height+.21,pz(t.z+t.depth/2))
      const top=foot.clone().add(new THREE.Vector3(0,3,0))
      rod(foot,top,.045,'#55695d');railPoints.push(top)
    }
    for(let i=1;i<railPoints.length;i++)rod(railPoints[i-1],railPoints[i],.07,'#55695d')
    // Sit-out and two cars / two bikes.
    box(44,706,145,88,.35,'#b67f60',.15);box(52,712,30,71,.2,'#b59062',1.5);box(52,712,4,71,2.3,'#b59062',.5)
    for(const z of [716,772])for(const x of [56,75])box(x,z,4,5,1,'#765d43',.5)
    for(let z=715;z<780;z+=7)box(57,z,24,.6,.025,'#8d704d',1.71)
    const wheel=(x:number,z:number,y:number,radius:number,width:number)=>{
      const tyre=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,width,24),material('#303b35'))
      tyre.rotation.z=Math.PI/2;tyre.position.set(px(x),y,pz(z));tyre.castShadow=true;scene.add(tyre)
      for(const sign of [-1,1]){
        const hub=new THREE.Mesh(new THREE.CylinderGeometry(radius*.57,radius*.57,.025,16),material('#a5afaa'))
        hub.rotation.z=Math.PI/2;hub.position.copy(tyre.position);hub.position.x+=sign*width/2;scene.add(hub)
      }
    }
    for(const [i,x] of [204,379].entries()){
      const paint=i===0?'#ece9df':'#a9b6b3'
      rounded(x,788,96,240,1.35,paint,.85,.45)
      rounded(x+5,796,86,225,.45,paint,2,.2)
      rounded(x+10,840,76,119,1.7,'#59747a',2.3,.35)
      rounded(x+12,849,72,98,.18,paint,3.95,.08)
      for(const z of [844,895,951])box(x+8,z,80,3,1.5,paint,2.4)
      for(const dx of [-2,98])for(const z of [832,978])wheel(x+dx,z,.9,.78,.35)
      for(const dx of [8,67]){
        rounded(x+dx,788,20,3,.28,'#f5f0cd',1.6)
        rounded(x+dx,1026,20,3,.25,'#a14d3e',1.6)
      }
      box(x+29,787,38,2,.35,'#354a43',1)
      for(const dx of [-5,94])rounded(x+dx,851,7,10,.18,paint,2.65)
    }
    for(const x of [71,113]){
      for(const z of [888,985])wheel(x,z,.85,.7,.22)
      rod(new THREE.Vector3(px(x),.85,pz(888)),new THREE.Vector3(px(x),2.4,pz(906)),.09,'#546b5f')
      rod(new THREE.Vector3(px(x),.85,pz(985)),new THREE.Vector3(px(x),1.8,pz(941)),.09,'#546b5f')
      rounded(x-10,900,20,72,1.2,'#64897d',1.2,.2)
      rounded(x-9,928,18,40,.28,'#35473e',2.4,.12)
      rod(new THREE.Vector3(px(x-16),2.8,pz(904)),new THREE.Vector3(px(x+16),2.8,pz(904)),.055,'#39443e')
      ball(x,900,7,4,.4,'#eee8c9',2.1)
    }
    label('LIVING HALL',269,663);label('KITCHEN',164,310);label('BEDROOM',411,350)
    label('UTILITY',347,82);label('2 CARS + 2 BIKES',286,1060);label('SOUTH · STREET',277,1145)
    label('COMMON WC',64,53,.2);label('HIGH CEILING',130,555,.2)
    camera.aspect=container.clientWidth/container.clientHeight
    if(savedCamera.current){camera.position.copy(savedCamera.current.position);controls.target.copy(savedCamera.current.target);controls.update()}else cameraActions.current('Reset')
    const resize=()=>{camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();renderer.setSize(container.clientWidth,container.clientHeight);render()}
    const observer=new ResizeObserver(resize);observer.observe(container);resize()
    const lost=(event:Event)=>{event.preventDefault();setError(true)}
    renderer.domElement.addEventListener('webglcontextlost',lost)
    return ()=>{savedCamera.current={position:camera.position.clone(),target:controls.target.clone()};observer.disconnect();controls.dispose();renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.map)m.map.dispose();m.dispose()}}});for(const texture of Object.values(textures))texture.dispose();sun.shadow.dispose();renderer.dispose();renderer.domElement.remove();cameraActions.current=()=>{}}
  },[lowWalls])
  return <section className="model-panel" aria-label="Ground floor 3D model">
    <div className="model-toolbar"><div><h2>Ground floor in 3D</h2><p>Drag to rotate · scroll / pinch to zoom · right-drag to pan</p></div><div className="model-buttons">{['Reset','Top','Interior','Zoom in','Zoom out'].map(view=><button key={view} onClick={()=>cameraActions.current(view)}>{view==='Reset'?'Reset view':view==='Top'?'Top view':view==='Interior'?'Closer view':view}</button>)}<button onClick={()=>setLowWalls(v=>!v)}>{lowWalls?'Show full walls':'Show low walls'}</button></div></div>
    <div className="model-canvas" ref={host}/>
    {error&&<p role="alert">3D graphics are unavailable in this browser. You can continue using the 2D plan or try a browser with WebGL enabled.</p>}
    <p className="model-note">Ground-floor cutaway · Left-side two-storey window · Roof omitted for visibility. Illustrative heights: 10 ft per floor and 20 ft at the high ceiling. Room footprints follow the current 2D drawing, which is not a measured construction model. Wall thicknesses follow its drawn lines; heights, stair geometry and structure require confirmation.</p>
  </section>
}
