import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import * as THREE from 'three'
import { gsap } from 'gsap'
import SingerPhysicsRenderer from '../../components/SingerPhysicsRenderer'
import VisualEffects from '../../components/VisualEffects'  
import styles from './index.module.scss'

// 华语歌手数据
const singers = [
        {
            id: 1,
            name: '周杰伦',
            avatar: '/images/singers/jay.jpg',
            color: '#FF6B9D',
            genre: '流行/R&B',
            description: '华语流行音乐天王，创作才子',
            representative: '《青花瓷》《稻香》《告白气球》'
        },
        {
            id: 2,
            name: '邓紫棋',
            avatar: '/images/singers/gem.jpg',
            color: '#4ECDC4',
            genre: '流行/电子',
            description: '铁肺歌后，创作型女歌手',
            representative: '《光年之外》《泡沫》《来自天堂的魔鬼》'
        },
        {
            id: 3,
            name: '林俊杰',
            avatar: '/images/singers/jj.jpg',
            color: '#45B7D1',
            genre: '流行/电子',
            description: '音乐诗人，全才型歌手',
            representative: '《江南》《曹操》《不为谁而作的歌》'
        },
        {
            id: 4,
            name: '蔡依林',
            avatar: '/images/singers/jolin.jpg',
            color: '#96CEB4',
            genre: '流行/舞曲',
            description: '亚洲流行天后，舞台女王',
            representative: '《舞娘》《日不落》《怪美的》'
        },
        {
            id: 5,
            name: '陈奕迅',
            avatar: '/images/singers/eason.jpg',
            color: '#FFEAA7',
            genre: '流行/摇滚',
            description: '歌神级别歌手，情感诠释大师',
            representative: '《十年》《富士山下》《浮夸》'
        },
        {
            id: 6,
            name: '张惠妹',
            avatar: '/images/singers/amit.jpg',
            color: '#DDA0DD',
            genre: '流行/原住民',
            description: '原住民天后，音域宽广',
            representative: '《听海》《姐妹》《三天三夜》'
        }
    ]

const MusicGalaxy = () => {
    const canvasRef = useRef(null)
    const threeCanvasRef = useRef(null)
    const engineRef = useRef(null)
    const renderRef = useRef(null)
    const runnerRef = useRef(null)
    const threeSceneRef = useRef(null)
    const [selectedSinger, setSelectedSinger] = useState(null)
    const [showInfo, setShowInfo] = useState(false)

    // 初始化Three.js粒子背景
    useEffect(() => {
        if (!threeCanvasRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ 
            canvas: threeCanvasRef.current,
            alpha: true,
            antialias: true 
        })
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x000011, 1)
        threeSceneRef.current = { scene, camera, renderer }

        // 创建星空粒子系统
        const createStarField = () => {
            const starGeometry = new THREE.BufferGeometry()
            const starCount = 1000
            const starPositions = new Float32Array(starCount * 3)
            const starColors = new Float32Array(starCount * 3)

            for (let i = 0; i < starCount * 3; i += 3) {
                starPositions[i] = (Math.random() - 0.5) * 2000
                starPositions[i + 1] = (Math.random() - 0.5) * 2000
                starPositions[i + 2] = (Math.random() - 0.5) * 2000

                const color = new THREE.Color()
                color.setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.8)
                starColors[i] = color.r
                starColors[i + 1] = color.g
                starColors[i + 2] = color.b
            }

            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
            starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

            const starMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            })

            const stars = new THREE.Points(starGeometry, starMaterial)
            scene.add(stars)
            return stars
        }

        const stars = createStarField()
        camera.position.z = 5

        // 创建音符粒子
        const createMusicNotes = () => {
            const noteGeometry = new THREE.SphereGeometry(0.5, 8, 8)
            const noteMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: 0.6
            })

            const notes = []
            for (let i = 0; i < 20; i++) {
                const note = new THREE.Mesh(noteGeometry, noteMaterial)
                note.position.set(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100
                )
                scene.add(note)
                notes.push(note)
            }
            return notes
        }

        const musicNotes = createMusicNotes()

        // 动画循环
        const animate = () => {
            requestAnimationFrame(animate)
            
            // 旋转星空
            stars.rotation.x += 0.0005
            stars.rotation.y += 0.0005

            // 音符浮动动画
            musicNotes.forEach((note, index) => {
                note.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01
                note.rotation.z += 0.01
            })

            renderer.render(scene, camera)
        }
        animate()

        // 响应式处理
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (threeSceneRef.current) {
                threeSceneRef.current.renderer.dispose()
            }
        }
    }, [])

    // 初始化Matter.js物理世界
    useEffect(() => {
        if (!canvasRef.current) return

        const Engine = Matter.Engine
        const Runner = Matter.Runner
        const Bodies = Matter.Bodies
        const Composite = Matter.Composite
        const Mouse = Matter.Mouse
        const MouseConstraint = Matter.MouseConstraint
        const Events = Matter.Events

        const engine = Engine.create()
        engineRef.current = engine
        engine.world.gravity.y = 0.1

        // 创建自定义canvas渲染器
        const canvas = document.createElement('canvas')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.zIndex = '2'
        canvasRef.current.appendChild(canvas)

        const customRenderer = new SingerPhysicsRenderer(canvas, engine, singers)
        renderRef.current = customRenderer

        // 创建歌手头像物理体
        const singerBodies = singers.map((singer, index) => {
            const x = Math.random() * (window.innerWidth - 200) + 100
            const y = Math.random() * (window.innerHeight - 300) + 150
            
            const body = Bodies.circle(x, y, 40, {
                density: 0.001,
                frictionAir: 0.02,
                restitution: 0.8,
                render: {
                    fillStyle: singer.color,
                    strokeStyle: '#fff',
                    lineWidth: 3
                }
            })
            
            body.singerId = singer.id
            return body
        })

        // 创建边界墙
        const walls = [
            Bodies.rectangle(window.innerWidth / 2, -10, window.innerWidth, 20, { isStatic: true }),
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 10, window.innerWidth, 20, { isStatic: true }),
            Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
            Bodies.rectangle(window.innerWidth + 10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
        ]

        // 添加鼠标交互
        const mouse = Mouse.create(canvas)
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        })

        // 点击事件处理
        Events.on(mouseConstraint, 'mousedown', (event) => {
            const mousePosition = event.mouse.position
            const bodies = Composite.allBodies(engine.world)
            
            for (let body of bodies) {
                if (body.singerId && 
                    mousePosition.x >= body.position.x - 40 &&
                    mousePosition.x <= body.position.x + 40 &&
                    mousePosition.y >= body.position.y - 40 &&
                    mousePosition.y <= body.position.y + 40) {
                    
                    const singer = singers.find(s => s.id === body.singerId)
                    setSelectedSinger(singer)
                    setShowInfo(true)
                    
                    // 音波扩散效果
                    createRippleEffect(body.position.x, body.position.y)
                    customRenderer.createSoundWave(body.position.x, body.position.y, singer.color)
                    break
                }
            }
        })

        Composite.add(engine.world, [...singerBodies, ...walls, mouseConstraint])

        // 自定义渲染循环
        const renderLoop = () => {
            customRenderer.render()
            requestAnimationFrame(renderLoop)
        }
        renderLoop()

        const runner = Runner.create()
        runnerRef.current = runner
        Runner.run(runner, engine)

        return () => {
            if (runnerRef.current) Runner.stop(runnerRef.current)
            if (engineRef.current) Engine.clear(engineRef.current)
            if (canvasRef.current && canvas) {
                canvasRef.current.removeChild(canvas)
            }
        }
    }, [])

    // 创建音波扩散效果
    const createRippleEffect = (x, y) => {
        const ripple = document.createElement('div')
        ripple.className = styles.ripple
        ripple.style.left = `${x}px`
        ripple.style.top = `${y}px`
        document.body.appendChild(ripple)

        gsap.to(ripple, {
            scale: 3,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                document.body.removeChild(ripple)
            }
        })
    }

    return (
        <div className={styles.container}>
            {/* 视觉效果层 */}
            <VisualEffects />
            
            {/* Three.js 星空背景 */}
            <canvas 
                ref={threeCanvasRef} 
                className={styles.starBackground}
            />
            
            {/* Matter.js 物理交互层 */}
            <div 
                ref={canvasRef} 
                className={styles.physicsLayer}
            />

            {/* 标题区域 */}
            <div className={styles.titleSection}>
                <h1 className={styles.mainTitle}>
                    <span className={styles.titleGlow}>华语乐坛</span>
                    <span className={styles.titleSub}>歌手星空馆</span>
                </h1>
                <p className={styles.subtitle}>
                    探索音乐宇宙，感受歌声的力量
                </p>
            </div>

            {/* 交互提示 */}
            <div className={styles.instructions}>
                <div className={styles.instructionItem}>
                    <span className={styles.icon}>🖱️</span>
                    <span>拖拽星球探索</span>
                </div>
                <div className={styles.instructionItem}>
                    <span className={styles.icon}>⭐</span>
                    <span>点击了解歌手</span>
                </div>
                <div className={styles.instructionItem}>
                    <span className={styles.icon}>🎵</span>
                    <span>感受音乐律动</span>
                </div>
            </div>

            {/* 歌手信息弹窗 */}
            {showInfo && selectedSinger && (
                <div className={styles.modal} onClick={() => setShowInfo(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button 
                            className={styles.closeBtn}
                            onClick={() => setShowInfo(false)}
                        >
                            ×
                        </button>
                        <div className={styles.singerInfo}>
                            <div 
                                className={styles.singerAvatar}
                                style={{ backgroundColor: selectedSinger.color }}
                            >
                                <span className={styles.singerInitial}>
                                    {selectedSinger.name.charAt(0)}
                                </span>
                            </div>
                            <h2 className={styles.singerName}>{selectedSinger.name}</h2>
                            <div className={styles.singerGenre}>{selectedSinger.genre}</div>
                            <p className={styles.singerDescription}>{selectedSinger.description}</p>
                            <div className={styles.representative}>
                                <h4>代表作品</h4>
                                <p>{selectedSinger.representative}</p>
                            </div>
                            <button className={styles.exploreBtn}>
                                进入歌手专区 🎵
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 浮动音符装饰 */}
            <div className={styles.floatingNotes}>
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i} 
                        className={styles.note}
                        style={{
                            animationDelay: `${i * 0.5}s`,
                            left: `${Math.random() * 100}%`
                        }}
                    >
                        🎵
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MusicGalaxy 