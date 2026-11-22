import * as THREE from 'three'

// Small deterministic textures keep the model self-contained and work offline.
export function surfaceTexture(kind: 'wood' | 'stone' | 'fabric') {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#f2eee6'; ctx.fillRect(0, 0, 256, 256)
  let seed = 37
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  if (kind === 'wood') {
    for (let y = 0; y < 256; y += 2) {
      ctx.strokeStyle = `rgba(101,77,43,${.05 + random() * .12})`
      ctx.beginPath(); ctx.moveTo(0, y)
      ctx.bezierCurveTo(70, y + random() * 12, 165, y - random() * 10, 256, y + 1)
      ctx.stroke()
    }
  } else if (kind === 'stone') {
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(104,108,101,${random() * .09})`
      ctx.fillRect(random() * 256, random() * 256, 1 + random() * 3, 1)
    }
    ctx.strokeStyle = '#d7d8cf'; ctx.lineWidth = .5
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(random() * 256, 0)
      ctx.bezierCurveTo(random() * 256, 90, random() * 256, 150, random() * 256, 256); ctx.stroke()
    }
  } else {
    for (let i = 0; i < 256; i += 3) {
      ctx.strokeStyle = 'rgba(82,99,87,.12)'
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke()
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 4
  return texture
}
