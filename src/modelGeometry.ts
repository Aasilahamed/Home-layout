// SVG positive rotation points towards +z; Three's positive Y rotation points towards -z.
export function doorAngle(rotation: number, opensOut: boolean) {
  return (-rotation + (opensOut ? -90 : 90)) * Math.PI / 180
}

// Keep the traced three-part stair footprint; vertical dimensions remain proposed.
export function stairTreads(floorHeight = 10) {
  const footprints: [number, number, number, number][] = []
  for (let i = 0; i < 3; i++) footprints.push([405 + i * 50 / 3, 634, 50 / 3, 60])
  for (let i = 0; i < 12; i++) footprints.push([455, 439 + (11 - i) * 16.25, 58, 16.25])
  footprints.push([455, 380, 58, 59])
  for (let i = 0; i < 3; i++) footprints.push([455 - (i + 1) * 50 / 3, 380, 50 / 3, 59])
  return footprints.reverse().map(([x, z, width, depth], i) => ({ x, z: z + 55, width, depth, height: (i + 1) * floorHeight / footprints.length }))
}
