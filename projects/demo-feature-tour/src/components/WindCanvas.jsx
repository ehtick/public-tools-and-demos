import { useEffect, useRef } from 'react'

export default function WindCanvas({ visible }) {
  const canvasRef = useRef()
  const animRef = useRef()

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const NUM = 350
    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * (canvas.width || 1600),
      y: Math.random() * (canvas.height || 900),
      age: Math.random() * 200,
      maxAge: 100 + Math.random() * 140,
      vx: 1.0 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      width: 0.6 + Math.random() * 1.0
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 8, 24, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        const px = p.x
        const py = p.y
        const wave = Math.sin(p.phase + p.x * 0.0035 + p.y * 0.0015) * 0.9
        p.x += p.vx
        p.y += wave
        p.age++

        const life = p.age / p.maxAge
        const alpha = Math.sin(life * Math.PI) * 0.5

        if (
          p.age >= p.maxAge ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height
        ) {
          p.x = Math.random() * 60 - 30
          p.y = Math.random() * canvas.height
          p.age = 0
          p.maxAge = 100 + Math.random() * 140
          p.vx = 1.0 + Math.random() * 2.2
          p.phase = Math.random() * Math.PI * 2
        }

        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = `rgba(110, 195, 255, ${alpha})`
        ctx.lineWidth = p.width
        ctx.stroke()
      }
      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [visible])

  if (!visible) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        mixBlendMode: 'screen',
        opacity: 0.75
      }}
    />
  )
}
