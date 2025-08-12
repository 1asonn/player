import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './index.module.scss';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: '首页' },
    { path: '/music-galaxy', label: '音乐银河' },
    { path: '/language-demo', label: '语言演示' },
    { path: '/portal', label: '传送门' },
    { path: '/matter-demo', label: 'Matter演示' },
    { path: '/login', label: '登录' },
  ];

  return (
    <nav className={styles.navigation}>
      <ul className={styles.navList}>
        {navItems.map(item => (
          <li key={item.path} className={styles.navItem}>
            <Link 
              to={item.path} 
              className={`${styles.navLink} ${
                location.pathname === item.path ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 