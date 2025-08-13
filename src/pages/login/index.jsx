import React from 'react'
import {useState, useEffect, useRef} from 'react' 
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import 'boxicons/css/boxicons.min.css'
import { AddSafeBottom } from '../../utils/hooks/useSafeArea'
// 自定义hooks处理登录逻辑
// import {useLogin} from '../../hooks/useLogin'


const LoginPage = () => {
    // const {login} = useLogin()
    const containerRef = useRef(null)
    const FormRef = useRef(null)
    const navigate = useNavigate()
    
    // 应用安全底部样式
    useEffect(() => {
        if (containerRef.current) {
            const cleanup = AddSafeBottom(FormRef.current, 65); // 65px是底部偏移量
            return cleanup; // 组件卸载时清理
        }
    }, []);

    const handleLogin = (e)=> {
        e.preventDefault()
        console.log("登录")
        // 跳转到
        navigate('/language-demo')
    }

    const ToRegisterForm = ()=> {
        if(containerRef.current){
            console.log("切换到注册表单", containerRef.current.classList)
            // 使用dataset属性来存储状态，避免CSS Modules类名问题
            containerRef.current.classList.add('active')
            containerRef.current.dataset.isActive = 'true'
        }
    }

    const ToLoginForm = ()=> {
        if(containerRef.current){
            console.log("切换到登录表单", containerRef.current)
            containerRef.current.classList.remove('active')
            containerRef.current.dataset.isActive = 'false'
        }
    }

    return (
        <div className={styles.container} ref={containerRef}>
                {/* 一体化表单 */}
                <div className={styles.Form} ref={FormRef}>

                    {/* 登录表单 */}
                    <div className={styles.LoginFormBox}>
                    <h1>Login</h1>
                    <form className={styles.form} onSubmit={handleLogin}>
                        <div className={styles.inputBox}>
                            <input type="text" placeholder="Username" />
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className={styles.inputBox}>
                            <input type="password" placeholder="Password" />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        <button type="submit" className={styles.btn}>Login</button>
                    </form>
                    </div>

                    {/* 注册表单 */}
                    <div className={styles.RegisterFormBox}>
                        <h2>Register</h2>
                        <form className={styles.form}>
                            <div className={styles.inputBox}>
                                <input type="text" placeholder="Username" />
                                <i className="bx bxs-user"></i>
                            </div>
                            <div className={styles.inputBox}>
                                <input type="password" placeholder="Password" />
                            </div>
                            <button type="submit" className={styles.btn}>Register</button>
                        </form>
                    </div> 

                    {/* 动画模组 （幕布动画）*/} 
                    <div className={styles.toggleBox}> 
                        {/* 登录 */}
                        <div className={`${styles.togglePanel} ${styles.left}`}>
                            <h1>Welcome Back!</h1>
                            <p>Don't have an account?</p>
                            <button className={`${styles.btn} ${styles.registerBtn}`} onClick={ToRegisterForm}>Register</button>
                        </div>
                        {/* 注册 */}
                        <div className={`${styles.togglePanel} ${styles.right}`}>
                            <h1>Hello, Welcome!</h1>
                            <p>Already have an account?</p>
                            <button className={`${styles.btn} ${styles.loginBtn}`} onClick={ToLoginForm}>Login</button>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default LoginPage



