import React from 'react'
import {useState, useEffect} from 'react' 
import styles from './index.module.scss'
import 'boxicons/css/boxicons.min.css'
// 自定义hooks处理登录逻辑
// import {useLogin} from '../../hooks/useLogin'

const LoginPage = () => {
    // const {login} = useLogin()

    return (
        <div className={styles.container}>

            {/* 一体化表单 */}
            <div className={styles.Form}>

                {/* 登录表单 */}
                <div className={styles.LoginFormBox}>
                <h1>Login</h1>
                <form className={styles.form}>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder="用户名" />
                        <i class="bx bxs-user"></i>
                    </div>
                    <div className={styles.inputBox}>
                        <input type="password" placeholder="密码" />
                        <i class="bx bxs-lock-alt"></i>
                    </div>
                    <button className={styles.btn} type="submit">Login</button>
                </form>
                </div>

                {/* 注册表单 */}
                {/* <div className={styles.RegisterFormBox}>
                    <h2>注册</h2>
                    <form className={styles.form}>
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="用户名" />
                            <i class="bx bxs-user"></i>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="password" placeholder="密码" />
                        </div>
                        <button type="submit">注册</button>
                    </form>
                </div>  */}

                {/* 动画模组 */}
                <div className={styles.toggleBox}>
                    {/* 登录 */}
                    <div className={`${styles.togglePanel} ${styles.left}`}>
                        <h1>Welcome Back!</h1>
                        <p>Don't have an account?</p>
                        <button className={`${styles.btn} ${styles.registerBtn}`}>Register</button>
                    </div>
                    {/* 注册 */}
                    <div className={`${styles.togglePanel} ${styles.right}`}>
                        <h1>Hello, Welcome!</h1>
                        <p>Already have an account?</p>
                        <button className={`${styles.btn} ${styles.loginBtn}`}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage