import assert from 'node:assert/strict'
import { test } from 'node:test'
import { doorAngle, stairTreads } from '../src/modelGeometry.ts'

test('open door tips match the 2D swing direction for all ground-floor orientations', () => {
  for (const rotation of [0, 90, -90, 180]) for (const out of [false, true]) {
    const r = rotation * Math.PI / 180
    const sign = out ? -1 : 1
    const theta = doorAngle(rotation, out)
    assert.ok(Math.abs(Math.cos(theta) - sign * Math.sin(r)) < 1e-10)
    assert.ok(Math.abs(-Math.sin(theta) + sign * Math.cos(r)) < 1e-10)
  }
})

test('stairs reach the assumed floor height with equal rises inside the traced footprint', () => {
  const treads = stairTreads()
  assert.equal(treads.length, 19)
  assert.equal(treads.at(-1).height, 10)
  let previous = 0
  for (const tread of treads) {
    assert.ok(Math.abs(tread.height - previous - 10 / 19) < 1e-10)
    assert.ok(tread.x >= 405 - 1e-10 && tread.x + tread.width <= 513 + 1e-10)
    assert.ok(tread.z >= 435 && tread.z + tread.depth <= 749)
    previous = tread.height
  }
  assert.equal(treads[0].x, 405)
  assert.equal(treads[0].z, 435)
  assert.equal(treads.at(-1).z, 689)
})
