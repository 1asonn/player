import React, { useEffect, useRef } from 'react'
import Header from '../../components/header'
import styles from './index.module.scss'
import Banner from '../../components/banner'
import PhysicsPhone from '../../components/draggable-phone'
import Matter from 'matter-js'

const MatterDemo = () => {

    const bannerImages = [
        './images/test.png',
        './images/logo192.png',
        './images/music.jpg',
    ]
    
    const leftRegion = () =>{
        return (
            <div className={styles.logoContainer}>
                <img className={styles.logo} src="/images/music.jpg"/>
                <span className={styles.logoText}>网易云音乐</span>
            </div>
        )
    }

    const middleRegion = () => {
        return (
            <div>
                <input type="text" placeholder="搜索音乐、歌手、歌词、用户" />
            </div>
        )
    }
    
    const rightRegion = () => <span>right</span>
    const canvasRef = useRef(null)
    const engineRef = useRef(null)
    const renderRef = useRef(null)
    const runnerRef = useRef(null)

    useEffect(() => {
        // 模块别名
        const Engine = Matter.Engine
        const Render = Matter.Render
        const Runner = Matter.Runner
        const Bodies = Matter.Bodies
        const Body = Matter.Body
        const Composite = Matter.Composite
        const Constraint = Matter.Constraint
        const Mouse = Matter.Mouse
        const MouseConstraint = Matter.MouseConstraint

        // 创建引擎
        const engine = Engine.create()
        engineRef.current = engine

        // 创建渲染器
        const render = Render.create({
            element: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                wireframes: false,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                showAngleIndicator: true,
                showVelocity: true
            }
        })
        renderRef.current = render

        // 创建固定点（悬挂点）
        const anchor = Bodies.rectangle(400, 50, 20, 20, { 
            isStatic: true,
            render: {
                fillStyle: '#8B4513',
                strokeStyle: '#654321',
                lineWidth: 2
            }
        })

        // 创建电话话筒形状的复合物体
        
        // 1. 电话话筒主体（椭圆形）
        const phoneBody = Bodies.rectangle(400, 300, 40, 120, {
            density: 0.001,
            frictionAir: 0.01,
            chamfer: { radius: 20 }, // 圆角让它更像椭圆
            render: {
                fillStyle: '#2C3E50',
                strokeStyle: '#34495E',
                lineWidth: 2
            }
        })
        
        // 2. 话筒顶部（听筒）
        const phoneTop = Bodies.circle(400, 250, 18, {
            density: 0.0005,
            frictionAir: 0.01,
            render: {
                fillStyle: '#34495E',
                strokeStyle: '#2C3E50',
                lineWidth: 2
            }
        })
        
        // 3. 话筒底部（麦克风）
        const phoneBottom = Bodies.circle(400, 350, 18, {
            density: 0.0005,
            frictionAir: 0.01,
            render: {
                fillStyle: '#34495E',
                strokeStyle: '#2C3E50',
                lineWidth: 2
            }
        })
        
        // 4. 话筒中间的握把装饰
        const phoneGrip = Bodies.rectangle(400, 300, 35, 60, {
            density: 0.0003,
            frictionAir: 0.01,
            chamfer: { radius: 8 },
            render: {
                fillStyle: '#1ABC9C',
                strokeStyle: '#16A085',
                lineWidth: 1
            }
        })
        
        // 将话筒各部分组合成一个复合物体
        const phoneHandset = Body.create({
            parts: [phoneBody, phoneTop, phoneBottom, phoneGrip],
            frictionAir: 0.01,
            render: {
                fillStyle: 'transparent'
            }
        })
        
        // 2. 圆形球体
        const ball = Bodies.circle(450, 250, 30, {
            density: 0.002,
            frictionAir: 0.005,
            restitution: 0.8, // 弹性
            render: {
                fillStyle: '#4ECDC4',
                strokeStyle: '#45B7B8',
                lineWidth: 2
            }
        })
        
        // 3. 多边形（六边形）
        const hexagon = Bodies.polygon(500, 200, 6, 25, {
            density: 0.001,
            frictionAir: 0.01,
            render: {
                fillStyle: '#FFE66D',
                strokeStyle: '#FFD93D',
                lineWidth: 2
            }
        })
        
        // 4. 自定义形状（心形）
        const heartVertices = [
            // Telephone handset outline
            { x: -20, y: 0 },    // Top left of earpiece
            { x: -15, y: -8 },   // Curve to earpiece
            { x: 0, y: -10 },    // Top of earpiece
            { x: 15, y: -8 },    // Curve down from earpiece
            { x: 20, y: 0 },     // Top right of handset
            { x: 20, y: 5 },     // Right side of handset
            { x: 30, y: 15 },    // Flare out for mouthpiece
            { x: 30, y: 20 },    // Bottom of mouthpiece
            { x: 25, y: 25 },    // Curve back in
            { x: 0, y: 15 },     // Bottom center indent
            { x: -25, y: 25 },   // Curve back out
            { x: -30, y: 20 },   // Left side bottom
            { x: -30, y: 15 },   // Flare out for earpiece bottom
            { x: -20, y: 5 }     // Back to start
            
        ]
        const heart = Bodies.fromVertices(350, 200, [heartVertices], {
            density: 0.001,
            frictionAir: 0.01,
            render: {
                fillStyle: '#FF69B4',
                strokeStyle: '#FF1493',
                lineWidth: 2
            }
        })
        
        // 5. 星形
        const star = Bodies.polygon(250, 250, 5, 20, {
            density: 0.001,
            frictionAir: 0.01,
            render: {
                fillStyle: '#9B59B6',
                strokeStyle: '#8E44AD',
                lineWidth: 2
            }
        })

        // 创建电话线连接话筒
        const phoneWire = Constraint.create({
            bodyA: anchor,
            bodyB: phoneHandset,
            length: 200,
            stiffness: 0.8,
            damping: 0.1,
            render: {
                visible: true,
                lineWidth: 6,
                strokeStyle: '#2C3E50',
                type: 'line'
            }
        })
        
        const rope2 = Constraint.create({
            bodyA: anchor,
            bodyB: ball,
            length: 150,
            stiffness: 0.9,
            damping: 0.05,
            render: {
                visible: true,
                lineWidth: 3,
                strokeStyle: '#2ECC71',
                type: 'line'
            }
        })
        
        const rope3 = Constraint.create({
            bodyA: anchor,
            bodyB: hexagon,
            length: 120,
            stiffness: 0.7,
            damping: 0.15,
            render: {
                visible: true,
                lineWidth: 5,
                strokeStyle: '#E67E22',
                type: 'line'
            }
        })
        
        const rope4 = Constraint.create({
            bodyA: anchor,
            bodyB: heart,
            length: 100,
            stiffness: 0.6,
            damping: 0.2,
            render: {
                visible: true,
                lineWidth: 2,
                strokeStyle: '#E91E63',
                type: 'line'
            }
        })
        
        const rope5 = Constraint.create({
            bodyA: anchor,
            bodyB: star,
            length: 160,
            stiffness: 0.8,
            damping: 0.1,
            render: {
                visible: true,
                lineWidth: 3,
                strokeStyle: '#9C27B0',
                type: 'line'
            }
        })

        // 创建地面
        const ground = Bodies.rectangle(400, 580, 800, 40, { 
            isStatic: true,
            render: {
                fillStyle: '#4ECDC4',
                strokeStyle: '#45B7B8',
                lineWidth: 2
            }
        })

        // 创建左右墙壁
        const leftWall = Bodies.rectangle(0, 300, 20, 600, { 
            isStatic: true,
            render: {
                fillStyle: '#4ECDC4',
                strokeStyle: '#45B7B8',
                lineWidth: 2
            }
        })
        const rightWall = Bodies.rectangle(800, 300, 20, 600, { 
            isStatic: true,
            render: {
                fillStyle: '#4ECDC4',
                strokeStyle: '#45B7B8',
                lineWidth: 2
            }
        })

        // 添加鼠标控制
        const mouse = Mouse.create(render.canvas)
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        })

        // 将所有物体添加到世界
        Composite.add(engine.world, [
            anchor,
            phoneHandset,
            ball,
            hexagon,
            heart,
            star,
            phoneWire,
            rope2,
            rope3,
            rope4,
            rope5,
            ground,
            leftWall,
            rightWall,
            mouseConstraint
        ])

        // 运行渲染器
        Render.run(render)

        // 创建运行器
        const runner = Runner.create()
        runnerRef.current = runner

        // 运行引擎
        Runner.run(runner, engine)

        // 清理函数
        return () => {
            if (runnerRef.current) {
                Runner.stop(runnerRef.current)
            }
            if (renderRef.current) {
                Render.stop(renderRef.current)
            }
            if (engineRef.current) {
                Engine.clear(engineRef.current)
            }
        }
    }, [])

    return (
        <div className={styles.container}>
            {/* <div className={styles.header}>
                <Header
                    LeftRegion={leftRegion}
                    MiddleRegion={middleRegion}
                    RightRegion={rightRegion}
                />
            </div>
            <section className={styles.bannerSection}>
                <Banner images={bannerImages} animationDuration={1000}/>
            </section> */}
            
            {/* Matter.js 物理场景 */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                background: '#f0f0f0',
                borderRadius: '10px',
                margin: '20px'
            }}>
                <span ref={canvasRef} style={{
                    border: '2px solid #333',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }} />
            </div>
            
            <div style={{ textAlign: 'center', margin: '20px', color: '#666' }}>
                <h3>📞 电话话筒物理摆动效果</h3>
                <p>📞 电话话筒 | 🔵 球体 | 🔶 六边形 | 💖 心形 | ⭐ 星形</p>
                <p>使用鼠标拖拽电话话筒或其他物体，体验真实的物理摆动</p>
                <small>电话话筒由多个部件组成：听筒、握把、麦克风，具有真实的重量分布</small>
            </div>
            

            {/* <PhysicsPhone /> */}
        </div>
    )
}



export default MatterDemo  