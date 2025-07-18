import React from 'react'
import styles from './index.module.scss'

const Header = ({ LeftRegion, MiddleRegion, RightRegion }) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftRegion}><LeftRegion /></div>
            <div className={styles.middleRegion}><MiddleRegion /></div>
            <div className={styles.rightRegion}><RightRegion /></div>
        </div>
    )
}


export default Header




