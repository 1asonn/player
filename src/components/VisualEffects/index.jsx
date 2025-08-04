import React, { useEffect, useRef } from 'react'
import styles from './index.module.scss'

const VisualEffects = () => {
    const meteorContainerRef = useRef(null)
    const particleContainerRef = useRef(null)

    useEffect(() => {
        // 创建流星雨效果
        const createMeteor = () => {
            if (!meteorContainerRef.current) return

            const meteor = document.createElement('div')
            meteor.className = styles.meteor
            
            // 随机位置和样式
            const startX = Math.random() * window.innerWidth
            const startY = -50
            const endX = startX + Math.random() * 300 - 150
            const endY = window.innerHeight + 50
            const duration = Math.random() * 3000 + 2000
            const size = Math.random() * 3 + 1
            
            meteor.style.left = `${startX}px`
            meteor.style.top = `${startY}px`
            meteor.style.width = `${size}px`
            meteor.style.height = `${size * 20}px`
            
            // 随机颜色
            const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd']
            const color = colors[Math.floor(Math.random() * colors.length)]
            meteor.style.background = `linear-gradient(to bottom, ${color}, transparent)`
            meteor.style.boxShadow = `0 0 10px ${color}`
            
            meteorContainerRef.current.appendChild(meteor)
            
            // 动画
            meteor.animate([
                { 
                    transform: 'translate(0, 0) rotate(45deg)',
                    opacity: 0 
                },
                { 
                    transform: 'translate(0, 100px) rotate(45deg)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(45deg)`,
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'linear'
            }).onfinish = () => {
                if (meteorContainerRef.current && meteor.parentNode) {
                    meteorContainerRef.current.removeChild(meteor)
                }
            }
        }

        // 创建光粒子效果
        const createLightParticle = () => {
            if (!particleContainerRef.current) return

            const particle = document.createElement('div')
            particle.className = styles.lightParticle
            
            const x = Math.random() * window.innerWidth
            const y = Math.random() * window.innerHeight
            const size = Math.random() * 4 + 2
            const duration = Math.random() * 4000 + 3000
            
            particle.style.left = `${x}px`
            particle.style.top = `${y}px`
            particle.style.width = `${size}px`
            particle.style.height = `${size}px`
            
            // 随机光芒颜色
            const glowColors = ['#ffffff', '#ff6b9d', '#4ecdc4', '#ffd700', '#c0c0ff']
            const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)]
            particle.style.background = glowColor
            particle.style.boxShadow = `0 0 20px ${glowColor}`
            
            particleContainerRef.current.appendChild(particle)
            
            // 闪烁动画
            particle.animate([
                { opacity: 0, transform: 'scale(0.5)' },
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0.3, transform: 'scale(1.2)' },
                { opacity: 0, transform: 'scale(0.5)' }
            ], {
                duration: duration,
                easing: 'ease-in-out'
            }).onfinish = () => {
                if (particleContainerRef.current && particle.parentNode) {
                    particleContainerRef.current.removeChild(particle)
                }
            }
        }

        // 创建音乐波纹效果
        const createMusicWave = () => {
            const waveContainer = document.createElement('div')
            waveContainer.className = styles.musicWave
            
            const x = Math.random() * window.innerWidth
            const y = Math.random() * window.innerHeight
            
            waveContainer.style.left = `${x}px`
            waveContainer.style.top = `${y}px`
            
            document.body.appendChild(waveContainer)
            
            // 创建多层波纹
            for (let i = 0; i < 3; i++) {
                const wave = document.createElement('div')
                wave.className = styles.waveRing
                wave.style.animationDelay = `${i * 0.3}s`
                waveContainer.appendChild(wave)
            }
            
            setTimeout(() => {
                if (waveContainer.parentNode) {
                    waveContainer.parentNode.removeChild(waveContainer)
                }
            }, 3000)
        }

        // 定时创建效果
        const meteorInterval = setInterval(createMeteor, 800)
        const particleInterval = setInterval(createLightParticle, 500)
        const waveInterval = setInterval(createMusicWave, 2000)

        return () => {
            clearInterval(meteorInterval)
            clearInterval(particleInterval)
            clearInterval(waveInterval)
        }
    }, [])

    return (
        <div className={styles.effectsContainer}>
            {/* 流星容器 */}
            <div ref={meteorContainerRef} className={styles.meteorContainer} />
            
            {/* 光粒子容器 */}
            <div ref={particleContainerRef} className={styles.particleContainer} />
            
            {/* 背景网格效果 */}
            <div className={styles.gridBackground}>
                {[...Array(20)].map((_, i) => (
                    <div key={`h-${i}`} className={styles.gridLineHorizontal} style={{ top: `${i * 5}%` }} />
                ))}
                {[...Array(20)].map((_, i) => (
                    <div key={`v-${i}`} className={styles.gridLineVertical} style={{ left: `${i * 5}%` }} />
                ))}
            </div>
            
            {/* 脉冲光环 */}
            <div className={styles.pulseRings}>
                {[...Array(3)].map((_, i) => (
                    <div 
                        key={i} 
                        className={styles.pulseRing}
                        style={{ animationDelay: `${i * 1}s` }}
                    />
                ))}
            </div>
        </div>
    )
}

export default VisualEffects 