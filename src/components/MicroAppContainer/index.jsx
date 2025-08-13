import React, { useEffect, useRef } from 'react';
import { loadMicroApp } from 'qiankun';
import styles from './index.module.scss';

/**
 * 微应用容器组件
 * @param {string} name - 微应用名称
 * @param {string} entry - 微应用入口地址
 * @param {object} props - 传递给微应用的参数
 */
const MicroAppContainer = ({ 
  name, 
  entry, 
  props = {}, 
  loading = false,
  onLoad = () => {},
  onMount = () => {},
  onUnmount = () => {}
}) => {
  const containerRef = useRef(null);
  const microAppRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 加载微应用
    const loadApp = async () => {
      try {
        onLoad();
        
        microAppRef.current = loadMicroApp({
          name,
          entry,
          container: containerRef.current,
          props: {
            ...props,
            // 传递一些通用的属性
            basename: `/${name}`,
            theme: 'default'
          }
        }, {
          sandbox: {
            strictStyleIsolation: true,
            experimentalStyleIsolation: true
          }
        });

        // 监听微应用生命周期
        microAppRef.current.mountPromise.then(() => {
          onMount();
        });

      } catch (error) {
        console.error(`加载微应用 ${name} 失败:`, error);
      }
    };

    loadApp();

    // 清理函数
    return () => {
      if (microAppRef.current) {
        microAppRef.current.unmount();
        onUnmount();
      }
    };
  }, [name, entry, props, onLoad, onMount, onUnmount]);

  return (
    <div className={styles.microAppContainer}>
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>正在加载 {name}...</p>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={styles.microAppContent}
        id={`micro-app-${name}`}
      />
    </div>
  );
};

export default MicroAppContainer;
