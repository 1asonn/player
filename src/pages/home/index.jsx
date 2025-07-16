import useToggle from "../../utils/hooks/useToggle"
import React,{ useState,useRef,useEffect } from "react"
import useBoolean from "../../utils/hooks/useBoolean"
import Matter from 'matter-js'


const HomePage = () => {
    const [state, actions] = useBoolean();
    
    const engineRef = useRef(null)
    const canvasRef = useRef(null)
    const runnerRef = useRef(null)
    const renderRef = useRef(null)

    useEffect(() => {
      const Engine = Matter.Engine
      const Render = Matter.Render
      const Runner = Matter.Runner
      const Bodies = Matter.Bodies
      const Body = Matter.Body
      const Composite = Matter.Composite
      const Constraint = Matter.Constraint
      const Mouse = Matter.Mouse
      const MouseConstraint = Matter.MouseConstraint
      const Events = Matter.Events

      
      // 容器尺寸
      const containerWidth = 800;
      const containerHeight = 600;
      const anchorSize = 10; // 锚点大小

      // 创建引擎
      const engine = Engine.create();
      engineRef.current = engine;

      // 创建渲染器
      const render = Render.create({
        element: canvasRef.current,
        engine: engine,
        options: {
          width: containerWidth,
          height: containerHeight,
          wireframes: false,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          showAngleIndicator: true,
          showVelocity: true
        }
      });
      renderRef.current = render;

      // 创建固定点 - 放在画布底部正中间
      const anchorX = containerWidth / 2;      // 水平居中
      const anchorY = containerHeight - (anchorSize / 2); // 紧贴底部

      const anchor = Bodies.rectangle(anchorX, anchorY, anchorSize, anchorSize, {
        isStatic: true,
        render: {
          fillStyle: '#8B4513',
          strokeStyle: '#654321',
          lineWidth: 2
        }
      });

      // 圆形球体 - 放在固定点上方
      const ballRadius = 30;
      const ball = Bodies.circle(anchorX, 800, ballRadius, {
        density: 0.002,
        frictionAir: 0.005,
        restitution: 0.8,
        render: {
          fillStyle: '#4ECDC4',
          strokeStyle: '#45B7B8',
          lineWidth: 2
        }
      });

      // 创建锚点
      const anchorPoint = Bodies.circle(anchorX, anchorY, 5, {
        isStatic: true,
        render: { visible: false }
      });

      // 创建多个小段约束来模拟麻花效果
      const segments = 8; // 麻花的段数
      const segmentLength = ballRadius * 0.8; // 每段长度
      let prevBody = anchorPoint; // 第一个连接点

      // 创建所有段
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 4; // 4个完整旋转
        const twistX = Math.sin(angle) * 15 * (1 - i/segments); // 扭曲的X偏移
        
        const segment = Bodies.circle(
          anchorX + twistX, 
          anchorY - (i + 1) * segmentLength, 
          3, // 小圆点半径
          {
            collisionFilter: { group: Body.nextGroup(true) },
            density: 0.0001,
            frictionAir: 0.05,
            render: { visible: false } // 隐藏小圆点
          }
        );
        
        // 创建连接
        const constraint = Constraint.create({
          bodyA: prevBody,
          bodyB: segment,
          length: segmentLength,
          stiffness: 0.6,
          damping: 0.1,
          render: { visible: false }
        });
        
        // 添加到最后一个小球的约束
        if (i === segments - 1) {
          const finalConstraint = Constraint.create({
            bodyA: segment,
            bodyB: ball,
            length: segmentLength,
            stiffness: 0.6,
            damping: 0.1,
            render: { visible: false }
          });
          Composite.add(engine.world, finalConstraint);
        }
        
        Composite.add(engine.world, [segment, constraint]);
        prevBody = segment;
      }

      // 自定义渲染麻花效果
      const renderTwist = function() {
        const ctx = render.context;
        const bodies = Composite.allBodies(engine.world);
        
        // 找出所有小段和球体
        const segments = bodies
          .filter(body => body.circleRadius === 3) // 小圆点
          .sort((a, b) => a.position.y - b.position.y); // 按Y坐标排序
        
        if (segments.length === 0) return;
        
        // 添加锚点到数组开头
        const points = [{ x: anchorX, y: anchorY }, ...segments.map(s => s.position)];
        // 添加球体位置到数组末尾
        points.push(ball.position);
        
        // 绘制麻花
        ctx.save();
        
        // 绘制两条交错的线来模拟麻花
        for (let i = 0; i < 2; i++) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          
          // 绘制曲线
          for (let j = 1; j < points.length; j++) {
            const angle = (j / points.length) * Math.PI * 4 + (i * Math.PI);
            const offset = Math.sin(angle) * 5 * (1 - j/points.length);
            
            if (j < points.length - 1) {
              const xc = (points[j].x + points[j + 1].x) / 2;
              const yc = (points[j].y + points[j + 1].y) / 2;
              
              ctx.quadraticCurveTo(
                points[j].x + (i === 0 ? -offset : offset), 
                points[j].y, 
                xc + (i === 0 ? -offset : offset), 
                yc
              );
            } else {
              ctx.lineTo(points[j].x, points[j].y);
            }
          }
          
          ctx.lineWidth = 2;
          ctx.strokeStyle = i === 0 ? '#4ECDC4' : '#45B7B8';
          ctx.stroke();
        }
        
        ctx.restore();
      };

      // 添加渲染事件
      Events.on(render, 'afterRender', renderTwist);

      // 鼠标控制
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.7,
          render: {
            visible: false
          }
        }
      });

      // 将所有物体添加到世界
      Composite.add(engine.world, [anchorPoint, ball]);

      // 运行渲染器
      Render.run(render);

      // 创建并启动运行器
      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engine);

      // 清理函数
      return () => {
        // 移除事件监听
        Events.off(render, 'afterRender');
        
        if (engineRef.current) {
          Engine.clear(engineRef.current);
        }
        if (renderRef.current) {
          Render.stop(renderRef.current);
          renderRef.current.canvas.remove();
          renderRef.current.canvas = null;
          renderRef.current.context = null;
          renderRef.current.textures = {};
        }
      };
    }, [])

    return (
      <>
      <StaticWrapper
        actions={actions}
      />
      <span>{state.toString()}</span>

      <div style={{ 
        width: '800px', 
        height: '600px',
        margin: '20px auto',
        position: 'relative',
        border: '1px solid #ccc'
      }}>
        <div ref={canvasRef} style={{ width: '100%', height: '100%' }}></div>
      </div>
      <div style={{width:'100%',height:'100%'}}>123</div>
      </>
    );
  }
  
  const StaticWrapper = React.memo(({ actions }) => {
    console.log('Wrapper rendered');
    return <button onClick={actions.toggle}>Toggle</button>;
  });


export default HomePage