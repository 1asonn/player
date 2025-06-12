import styles from './index.module.scss'
import { useState, useEffect, useRef } from 'react'

const Banner = ({images =[], animationDuration = 1000, autoPlay = true}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const bannerRef = useRef(null)

    useEffect(() => {
        const bannerElement = bannerRef.current
        if(!bannerElement) return
        bannerElement.style.setProperty('--animation-duration', `${animationDuration/1000}s`)
    }, [animationDuration])

    //转变至下一张图片
    const handleNextImage = (imagesArray) => {
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrentIndex(prevIndex => {
                if(prevIndex === imagesArray.length - 1) return 0;
                else return prevIndex + 1;
            });
            setTimeout(() => {
                setIsTransitioning(false)
            }, animationDuration)
        }, animationDuration)
    }

    // 后退至上一张图片
    const handlePrevImage = (imagesArray) => {
        // 淡出
        setIsTransitioning(true)
        setTimeout(() => {
            // 切换为上一张图片
            if(currentIndex === 0) setCurrentIndex(imagesArray.length - 1)
            else setCurrentIndex(currentIndex - 1)
            // 淡入
            setTimeout(() => {
                setIsTransitioning(false)
            }, animationDuration)
        }, animationDuration)
 
    }

    useEffect(() => {
        if(autoPlay) {
            const interval = setInterval(() => {
                handleNextImage(images)
            },4*animationDuration)
            return () => clearInterval(interval)
        }
    }, [])

    return (
        <div className={styles.bannerContainer} ref={bannerRef}>
            <button onClick={() => handlePrevImage(images)}>上一张</button>
            <button onClick={() => handleNextImage(images)}>下一张</button>
            <div className={styles.bannerSlider}>
                {
                    images.length && <img className={`${styles.bannerImage} ${isTransitioning ? styles.fadeTransition :''}`} key={currentIndex} src={images[currentIndex]} alt="" />
                }
            </div>
        </div>
    )
}

export default Banner