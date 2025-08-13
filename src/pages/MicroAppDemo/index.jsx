import React, { useState, useEffect } from 'react';
import MicroAppContainer from '../../components/MicroAppContainer';
import microAppManager from '../../micro-apps/CustomMicroAppManager';
import { MicroAppWrapper } from '../../micro-apps/module-federation';
import styles from './index.module.scss';

const MicroAppDemo = () => {
  const [activeTab, setActiveTab] = useState('qiankun');
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState([]);

  // 初始化微应用管理器
  useEffect(() => {
    // 注册微应用示例
    microAppManager.registerApps([
      {
        name: 'music-player',
        entry: 'http://localhost:3000',
        container: '#music-container',
        activeRule: '/music',
        props: { theme: 'dark' }
      },
      {
        name: 'user-center',
        entry: 'http://localhost:3000',
        container: '#user-container',
        activeRule: '/user',
        props: { theme: 'light' }
      }
    ]);

    setApps(microAppManager.getApps());
  }, []);

  const handleLoadApp = async (appName) => {
    setLoading(true);
    try {
      await microAppManager.mountApp(appName);
      console.log(`${appName} 加载成功`);
    } catch (error) {
      console.error(`${appName} 加载失败:`, error);
    } finally {
      setLoading(false);
    }
  };

  const renderQiankunDemo = () => (
    <div className={styles.demoSection}>
      <h3>qiankun 微应用示例</h3>
      <div className={styles.appGrid}>
        <MicroAppContainer
          name="music-player"
          entry="http://localhost:3000"
          loading={loading}
          props={{ theme: 'dark', user: { id: 1, name: 'Test User' } }}
          onLoad={() => console.log('音乐应用开始加载')}
          onMount={() => console.log('音乐应用挂载完成')}
        />
      </div>
    </div>
  );

  const renderModuleFederationDemo = () => (
    <div className={styles.demoSection}>
      <h3>Module Federation 微应用示例</h3>
      <div className={styles.appGrid}>
        <div className={styles.appCard}>
          <h4>音乐播放器</h4>
          <MicroAppWrapper
            appName="musicApp"
            componentName="MusicPlayer"
            fallback={<div className={styles.loading}>加载中...</div>}
            theme="dark"
          />
        </div>
        <div className={styles.appCard}>
          <h4>用户设置</h4>
          <MicroAppWrapper
            appName="userApp"
            componentName="UserSettings"
            fallback={<div className={styles.loading}>加载中...</div>}
            theme="light"
          />
        </div>
      </div>
    </div>
  );

  const renderCustomManagerDemo = () => (
    <div className={styles.demoSection}>
      <h3>自定义管理器微应用示例</h3>
      <div className={styles.controls}>
        {apps.map(app => (
          <button
            key={app.name}
            onClick={() => handleLoadApp(app.name)}
            className={styles.loadButton}
            disabled={loading}
          >
            {loading ? '加载中...' : `加载 ${app.name}`}
          </button>
        ))}
      </div>
      <div className={styles.containers}>
        <div id="music-container" className={styles.appContainer}>
          <p>音乐应用容器</p>
        </div>
        <div id="user-container" className={styles.appContainer}>
          <p>用户应用容器</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.microAppDemo}>
      <div className={styles.header}>
        <h1>微前端应用示例</h1>
        <p>展示不同微前端框架的集成方式</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'qiankun' ? styles.active : ''}`}
          onClick={() => setActiveTab('qiankun')}
        >
          qiankun
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'module-federation' ? styles.active : ''}`}
          onClick={() => setActiveTab('module-federation')}
        >
          Module Federation
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'custom' ? styles.active : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          自定义管理器
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'qiankun' && renderQiankunDemo()}
        {activeTab === 'module-federation' && renderModuleFederationDemo()}
        {activeTab === 'custom' && renderCustomManagerDemo()}
      </div>

      <div className={styles.info}>
        <h3>微前端架构优势</h3>
        <ul>
          <li>🔧 <strong>技术栈无关</strong>：不同团队可以使用不同的技术栈</li>
          <li>🚀 <strong>独立开发部署</strong>：各个微应用可以独立开发和部署</li>
          <li>📦 <strong>按需加载</strong>：只加载当前需要的微应用，减少首屏加载时间</li>
          <li>🛡️ <strong>故障隔离</strong>：一个微应用的错误不会影响整个系统</li>
          <li>👥 <strong>团队协作</strong>：支持多团队并行开发，提高开发效率</li>
        </ul>
      </div>
    </div>
  );
};

export default MicroAppDemo;
