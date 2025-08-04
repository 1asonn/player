import Matter from 'matter-js'

class SingerPhysicsRenderer {
    constructor(canvas, engine, singers) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.engine = engine
        this.singers = singers
        this.singerImages = new Map()
        this.particleSystems = new Map()
        
        // 加载歌手头像图片
        this.loadSingerImages()
        
        // 创建粒子系统
        this.initParticleSystems()
    }

    loadSingerImages() {
        this.singers.forEach(singer => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
                this.singerImages.set(singer.id, img)
            }
            // 使用默认头像或者创建文字头像
            img.src = this.createTextAvatar(singer.name, singer.color)
        })
    }

    createTextAvatar(name, color) {
        const size = 160
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        
        // 创建渐变背景
        const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
        gradient.addColorStop(0, color)
        gradient.addColorStop(0.7, this.darkenColor(color, 20))
        gradient.addColorStop(1, this.darkenColor(color, 40))
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
        
        // 添加光晕效果
        ctx.shadowColor = color
        ctx.shadowBlur = 20
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(0, 0, size, size)
        ctx.shadowBlur = 0
        
        // 绘制文字
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 60px "Noto Sans SC", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 5
        ctx.fillText(name.charAt(0), size/2, size/2)
        
        // 添加装饰边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(size/2, size/2, size/2 - 5, 0, Math.PI * 2)
        ctx.stroke()
        
        return canvas.toDataURL()
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) - amt
        const G = (num >> 8 & 0x00FF) - amt
        const B = (num & 0x0000FF) - amt
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
    }

    initParticleSystems() {
        this.singers.forEach(singer => {
            this.particleSystems.set(singer.id, {
                particles: [],
                trailPositions: []
            })
        })
    }

    addParticle(singerId, x, y, color) {
        const system = this.particleSystems.get(singerId)
        if (system) {
            system.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                color,
                size: Math.random() * 3 + 2
            })
        }
    }

    updateParticles() {
        this.particleSystems.forEach((system, singerId) => {
            system.particles = system.particles.filter(particle => {
                particle.x += particle.vx
                particle.y += particle.vy
                particle.vy += 0.1 // 重力
                particle.life -= 0.02
                particle.size *= 0.98
                return particle.life > 0
            })
        })
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        // 更新粒子
        this.updateParticles()
        
        // 获取所有物理体
        const bodies = Matter.Composite.allBodies(this.engine.world)
        
        bodies.forEach(body => {
            if (body.singerId) {
                this.renderSinger(body)
            } else if (!body.isStatic) {
                this.renderPhysicsBody(body)
            }
        })
        
        // 渲染粒子系统
        this.renderParticles()
    }

    renderSinger(body) {
        const singer = this.singers.find(s => s.id === body.singerId)
        if (!singer) return
        
        const { x, y } = body.position
        const angle = body.angle
        const radius = 40
        
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(angle)
        
        // 绘制光晕效果
        const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius + 20)
        glowGradient.addColorStop(0, singer.color + '40')
        glowGradient.addColorStop(0.5, singer.color + '20')
        glowGradient.addColorStop(1, singer.color + '00')
        
        this.ctx.fillStyle = glowGradient
        this.ctx.beginPath()
        this.ctx.arc(0, 0, radius + 20, 0, Math.PI * 2)
        this.ctx.fill()
        
        // 绘制头像
        const img = this.singerImages.get(singer.id)
        if (img) {
            this.ctx.beginPath()
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2)
            this.ctx.clip()
            
            this.ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2)
        } else {
            // 备用渲染
            this.ctx.fillStyle = singer.color
            this.ctx.beginPath()
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2)
            this.ctx.fill()
            
            this.ctx.fillStyle = '#ffffff'
            this.ctx.font = 'bold 24px "Noto Sans SC"'
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillText(singer.name.charAt(0), 0, 0)
        }
        
        // 绘制边框
        this.ctx.strokeStyle = '#ffffff'
        this.ctx.lineWidth = 3
        this.ctx.beginPath()
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2)
        this.ctx.stroke()
        
        // 添加音符装饰
        if (Math.random() < 0.05) {
            this.addParticle(singer.id, x, y, singer.color)
        }
        
        this.ctx.restore()
        
        // 绘制歌手名字
        this.ctx.save()
        this.ctx.fillStyle = '#ffffff'
        this.ctx.font = 'bold 14px "Noto Sans SC"'
        this.ctx.textAlign = 'center'
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        this.ctx.shadowBlur = 3
        this.ctx.fillText(singer.name, x, y + radius + 20)
        this.ctx.restore()
    }

    renderPhysicsBody(body) {
        const { x, y } = body.position
        const angle = body.angle
        
        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(angle)
        
        if (body.circleRadius) {
            // 圆形
            this.ctx.fillStyle = body.render.fillStyle
            this.ctx.strokeStyle = body.render.strokeStyle
            this.ctx.lineWidth = body.render.lineWidth
            
            this.ctx.beginPath()
            this.ctx.arc(0, 0, body.circleRadius, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.stroke()
        } else {
            // 多边形
            const vertices = body.vertices
            this.ctx.fillStyle = body.render.fillStyle
            this.ctx.strokeStyle = body.render.strokeStyle
            this.ctx.lineWidth = body.render.lineWidth
            
            this.ctx.beginPath()
            this.ctx.moveTo(vertices[0].x - x, vertices[0].y - y)
            
            for (let i = 1; i < vertices.length; i++) {
                this.ctx.lineTo(vertices[i].x - x, vertices[i].y - y)
            }
            
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.stroke()
        }
        
        this.ctx.restore()
    }

    renderParticles() {
        this.particleSystems.forEach(system => {
            system.particles.forEach(particle => {
                this.ctx.save()
                this.ctx.globalAlpha = particle.life
                this.ctx.fillStyle = particle.color
                this.ctx.beginPath()
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                this.ctx.fill()
                this.ctx.restore()
            })
        })
    }

    createSoundWave(x, y, color) {
        // 创建音波效果
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const wave = document.createElement('div')
                wave.style.position = 'absolute'
                wave.style.left = `${x}px`
                wave.style.top = `${y}px`
                wave.style.width = '0px'
                wave.style.height = '0px'
                wave.style.border = `2px solid ${color}`
                wave.style.borderRadius = '50%'
                wave.style.transform = 'translate(-50%, -50%)'
                wave.style.pointerEvents = 'none'
                wave.style.zIndex = '20'
                
                document.body.appendChild(wave)
                
                // 动画扩散
                wave.animate([
                    { width: '0px', height: '0px', opacity: 1 },
                    { width: '200px', height: '200px', opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    document.body.removeChild(wave)
                }
            }, i * 100)
        }
    }
}

export default SingerPhysicsRenderer 