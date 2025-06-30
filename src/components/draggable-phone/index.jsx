import React, { useState, useRef, useCallback, useEffect } from 'react'
import styles from './index.module.scss'

const DraggablePhone = () => {
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
    const phoneRef = useRef(null)
    const animationRef = useRef(null)
    
    // 防抖函数
    const debounce = useCallback((func, wait) => {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            console.log("is dragging")
        }
    }, [])

    // 滚动到顶部的函数
    const scrollToTop = useCallback(() => {
        const scrollStep = -window.scrollY / (500 / 15) // 500ms动画时长
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep)
            } else {
                clearInterval(scrollInterval)
            }
        }, 15)
    }, [])

    // 处理拖拽开始
    const handleDragStart = useCallback((e) => {
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY
        
        setIsDragging(true)
        setStartPosition({ x: clientX, y: clientY })
        
        // 阻止默认行为
        e.preventDefault()
    }, [])

    // 处理拖拽移动
    const handleDragMove = useCallback((e) => {
        if (!isDragging) return
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
        
        const deltaX = clientX - startPosition.x
        const deltaY = clientY - startPosition.y
        
        // 只允许向下拖拽
        if (deltaY > 0) {
            setPosition({ x: deltaX, y: deltaY })
        }
        
        e.preventDefault()
    }, [isDragging, startPosition])

    // 处理拖拽结束
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return
        
        setIsDragging(false)
        
        // 如果向下拖拽超过100px，则滚动到顶部
        if (position.y > 100) {
            scrollToTop()
        }
        
        // 重置位置
        setPosition({ x: 0, y: 0 })
        setStartPosition({ x: 0, y: 0 })
    }, [isDragging, position.y, scrollToTop])

    // 防抖的拖拽处理函数
    const debouncedDragMove = debounce(handleDragMove, 16) // 约60fps

    // 添加事件监听器
    useEffect(() => {
        const handleMouseMove = (e) => debouncedDragMove(e)
        const handleMouseUp = () => handleDragEnd()
        const handleTouchMove = (e) => debouncedDragMove(e)
        const handleTouchEnd = () => handleDragEnd()

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('touchmove', handleTouchMove, { passive: false })
            document.addEventListener('touchend', handleTouchEnd)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isDragging, debouncedDragMove, handleDragEnd])

    // 清理动画帧
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return (
        <div 
            ref={phoneRef}
            className={`${styles.draggablePhone} ${isDragging ? styles.dragging : ''}`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                opacity: position.y > 100 ? 0.7 : 1
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
        >
            <div className={styles.phoneIcon}>
                📞
            </div>
            <div className={styles.hint}>
                {position.y > 100 ? '松开回到顶部' : '向下拖拽'}
            </div>
        </div>
    )
}

export default DraggablePhone
