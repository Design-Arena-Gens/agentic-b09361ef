'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasElement = canvas
    const context = ctx

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrame: number
    let time = 0

    // Fog particles
    const fogParticles: Array<{x: number, y: number, size: number, speed: number, opacity: number}> = []
    for (let i = 0; i < 80; i++) {
      fogParticles.push({
        x: Math.random() * canvasElement.width,
        y: Math.random() * canvasElement.height,
        size: Math.random() * 100 + 50,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1
      })
    }

    // Rickshaw position
    let rickshawX = -200
    const rickshawY = canvasElement.height * 0.65

    function drawSky(ctx: CanvasRenderingContext2D, canvasEl: HTMLCanvasElement) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasEl.height)
      gradient.addColorStop(0, '#4a5568')
      gradient.addColorStop(0.5, '#718096')
      gradient.addColorStop(1, '#a0aec0')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
    }

    function drawRoad(ctx: CanvasRenderingContext2D, canvasEl: HTMLCanvasElement) {
      // Road
      ctx.fillStyle = '#2d3748'
      ctx.fillRect(0, canvasEl.height * 0.7, canvasEl.width, canvasEl.height * 0.3)

      // Road markings
      ctx.strokeStyle = '#cbd5e0'
      ctx.lineWidth = 3
      ctx.setLineDash([20, 15])
      ctx.beginPath()
      ctx.moveTo(0, canvasEl.height * 0.75)
      ctx.lineTo(canvasEl.width, canvasEl.height * 0.75)
      ctx.stroke()
      ctx.setLineDash([])
    }

    function drawBuildings(ctx: CanvasRenderingContext2D, canvasEl: HTMLCanvasElement) {
      const buildings = [
        { x: 50, w: 120, h: 200 },
        { x: 200, w: 100, h: 250 },
        { x: 330, w: 140, h: 180 },
        { x: 500, w: 90, h: 220 },
        { x: 620, w: 130, h: 190 },
        { x: 780, w: 110, h: 240 }
      ]

      buildings.forEach(building => {
        ctx.fillStyle = '#1a202c'
        ctx.globalAlpha = 0.7
        const buildingY = canvasEl.height * 0.7 - building.h
        ctx.fillRect(building.x, buildingY, building.w, building.h)

        // Windows
        ctx.fillStyle = '#fbbf24'
        for (let y = buildingY + 20; y < buildingY + building.h - 20; y += 30) {
          for (let x = building.x + 15; x < building.x + building.w - 15; x += 25) {
            if (Math.random() > 0.3) {
              ctx.fillRect(x, y, 8, 12)
            }
          }
        }
        ctx.globalAlpha = 1
      })
    }

    function drawRickshaw(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.save()
      ctx.translate(x, y)

      // Rickshaw body (colorful)
      const bodyGradient = ctx.createLinearGradient(-40, -60, 40, -20)
      bodyGradient.addColorStop(0, '#ef4444')
      bodyGradient.addColorStop(0.5, '#f59e0b')
      bodyGradient.addColorStop(1, '#10b981')
      ctx.fillStyle = bodyGradient
      ctx.fillRect(-40, -60, 80, 40)

      // Decorative patterns
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(-20, -40, 8, 0, Math.PI * 2)
      ctx.arc(20, -40, 8, 0, Math.PI * 2)
      ctx.stroke()

      // Canopy
      ctx.fillStyle = '#7c3aed'
      ctx.beginPath()
      ctx.moveTo(-50, -60)
      ctx.lineTo(50, -60)
      ctx.lineTo(40, -80)
      ctx.lineTo(-40, -80)
      ctx.closePath()
      ctx.fill()

      // Wheels
      ctx.fillStyle = '#1f2937'
      ctx.beginPath()
      ctx.arc(-25, 0, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(25, 0, 15, 0, Math.PI * 2)
      ctx.fill()

      // Wheel spokes
      ctx.strokeStyle = '#9ca3af'
      ctx.lineWidth = 2
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + time * 0.1
        ctx.beginPath()
        ctx.moveTo(-25, 0)
        ctx.lineTo(-25 + Math.cos(angle) * 12, Math.sin(angle) * 12)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(25, 0)
        ctx.lineTo(25 + Math.cos(angle) * 12, Math.sin(angle) * 12)
        ctx.stroke()
      }

      ctx.restore()

      // Rickshaw puller
      drawRickshawPuller(ctx, x - 60, y)
    }

    function drawRickshawPuller(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.save()
      ctx.translate(x, y)

      const legAngle = Math.sin(time * 0.15) * 0.3

      // Legs with lungi
      ctx.fillStyle = '#8b4513'
      ctx.fillRect(-8, -30, 6, 20)
      ctx.fillRect(2, -30, 6, 20)

      // Lungi (checkered pattern)
      const lungiGradient = ctx.createLinearGradient(-10, -30, 10, -10)
      lungiGradient.addColorStop(0, '#d97706')
      lungiGradient.addColorStop(0.5, '#dc2626')
      lungiGradient.addColorStop(1, '#d97706')
      ctx.fillStyle = lungiGradient
      ctx.fillRect(-12, -30, 24, 18)

      // Lungi pattern
      ctx.strokeStyle = '#991b1b'
      ctx.lineWidth = 1
      for (let i = -12; i < 12; i += 6) {
        ctx.beginPath()
        ctx.moveTo(i, -30)
        ctx.lineTo(i, -12)
        ctx.stroke()
      }

      // Feet
      ctx.fillStyle = '#8b4513'
      ctx.fillRect(-10, -10, 8, 4)
      ctx.fillRect(2, -10, 8, 4)

      // Body with jacket
      ctx.fillStyle = '#1e40af'
      ctx.fillRect(-15, -60, 30, 30)

      // Jacket details
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -60)
      ctx.lineTo(0, -30)
      ctx.stroke()

      // Arms
      ctx.fillStyle = '#1e40af'
      ctx.save()
      ctx.rotate(-0.5)
      ctx.fillRect(-30, -55, 20, 8)
      ctx.restore()

      ctx.save()
      ctx.rotate(0.5)
      ctx.fillRect(10, -55, 20, 8)
      ctx.restore()

      // Hands
      ctx.fillStyle = '#8b4513'
      ctx.beginPath()
      ctx.arc(-30, -50, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(30, -50, 5, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.fillStyle = '#d2691e'
      ctx.beginPath()
      ctx.arc(0, -70, 12, 0, Math.PI * 2)
      ctx.fill()

      // Face details
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(-4, -72, 2, 0, Math.PI * 2)
      ctx.arc(4, -72, 2, 0, Math.PI * 2)
      ctx.fill()

      // Mouth
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, -66, 4, 0, Math.PI)
      ctx.stroke()

      // Hair
      ctx.fillStyle = '#000'
      ctx.fillRect(-10, -82, 20, 8)

      ctx.restore()
    }

    function drawFog(ctx: CanvasRenderingContext2D, canvasEl: HTMLCanvasElement) {
      fogParticles.forEach(particle => {
        particle.x -= particle.speed
        if (particle.x < -particle.size) {
          particle.x = canvasEl.width + particle.size
          particle.y = Math.random() * canvasEl.height
        }

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        )
        gradient.addColorStop(0, `rgba(230, 230, 240, ${particle.opacity})`)
        gradient.addColorStop(1, 'rgba(230, 230, 240, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(
          particle.x - particle.size,
          particle.y - particle.size,
          particle.size * 2,
          particle.size * 2
        )
      })
    }

    function animate() {
      context.clearRect(0, 0, canvasElement.width, canvasElement.height)

      drawSky(context, canvasElement)
      drawBuildings(context, canvasElement)
      drawRoad(context, canvasElement)

      // Move rickshaw
      rickshawX += 1.2
      if (rickshawX > canvasElement.width + 100) {
        rickshawX = -200
      }

      drawRickshaw(context, rickshawX, rickshawY)
      drawFog(context, canvasElement)

      // Title overlay
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      context.fillRect(0, 0, canvasElement.width, 80)

      context.fillStyle = '#fff'
      context.font = 'bold 28px Arial'
      context.textAlign = 'center'
      context.fillText('Dhaka Winter Morning', canvasElement.width / 2, 35)

      context.font = '18px Arial'
      context.fillText('A rickshaw puller in the foggy streets', canvasElement.width / 2, 60)

      time += 1
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvasElement.width = window.innerWidth
      canvasElement.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <main>
      <canvas ref={canvasRef} />
    </main>
  )
}
