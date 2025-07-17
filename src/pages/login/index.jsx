import React from 'react'
import {useState, useEffect} from 'react' 
import styles from './index.module.scss'
import 'boxicons/css/boxicons.min.css'


const LoginPage = () => {
    

    return (
        <div className={styles.container}>
            <div className={styles.LoginForm}>
                <h2>登录</h2>
                <form className={styles.form}>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder="用户名" />
                        <i class="bx bxs-user"></i>
                    </div>
                    <div className={styles.inputBox}>
                        <input type="password" placeholder="密码" />
                    </div>
                    <button type="submit">登录</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage