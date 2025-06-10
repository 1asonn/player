import React from 'react'
import Header from '../../components/header'
import styles from './index.module.scss'

const PortalPage = () => {

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
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header
                    LeftRegion={leftRegion}
                    MiddleRegion={middleRegion}
                    RightRegion={rightRegion}
                />
            </div>
            <section>
                
            </section>
        </div>
    )
}



export default PortalPage