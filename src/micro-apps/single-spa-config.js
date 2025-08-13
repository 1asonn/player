import { registerApplication, start, navigateToUrl } from 'single-spa';

/**
 * Single-SPA 微应用配置
 */

// 微应用配置列表
const microApps = [
  {
    name: 'music-player',
    app: () => System.import('http://localhost:3001/js/app.js'),
    activeWhen: (location) => location.pathname.startsWith('/music'),
    customProps: {
      theme: 'dark',
      apiBase: '/api/music'
    }
  },
  {
    name: 'user-center',
    app: () => System.import('http://localhost:3002/js/app.js'),
    activeWhen: '/user',
    customProps: {
      theme: 'light',
      apiBase: '/api/user'
    }
  },
  {
    name: 'admin-panel',
    app: () => System.import('http://localhost:3003/js/app.js'),
    activeWhen: (location) => location.pathname.startsWith('/admin'),
    customProps: {
      permissions: ['admin'],
      apiBase: '/api/admin'
    }
  }
];

/**
 * 注册所有微应用
 */
export const registerMicroApps = () => {
  microApps.forEach(({ name, app, activeWhen, customProps }) => {
    registerApplication({
      name,
      app,
      activeWhen,
      customProps: {
        ...customProps,
        // 通用属性
        domElement: document.getElementById('single-spa-application:' + name),
        singleSpa: true
      }
    });
  });
};

/**
 * 启动 Single-SPA
 */
export const startSingleSpa = () => {
  start({
    urlRerouteOnly: true, // 只有URL变化时才重新路由
  });
};

/**
 * 程序化导航到微应用
 */
export const navigateToMicroApp = (appPath) => {
  navigateToUrl(appPath);
};

/**
 * 获取当前活跃的微应用
 */
export const getActiveApps = () => {
  return window.singleSpa.getAppNames().filter(name => 
    window.singleSpa.getAppStatus(name) === 'MOUNTED'
  );
};

/**
 * 卸载指定微应用
 */
export const unloadMicroApp = (appName) => {
  return window.singleSpa.unloadApplication(appName);
};

/**
 * 微应用生命周期钩子
 */
export const setupLifecycleHooks = () => {
  // 全局事件监听
  window.addEventListener('single-spa:before-routing-event', (event) => {
    console.log('路由事件开始:', event.detail);
  });

  window.addEventListener('single-spa:routing-event', (event) => {
    console.log('路由事件完成:', event.detail);
  });

  window.addEventListener('single-spa:app-change', (event) => {
    console.log('应用状态变化:', event.detail);
    
    // 可以在这里处理应用切换时的逻辑
    const { appsByNewStatus } = event.detail;
    
    // 处理新挂载的应用
    if (appsByNewStatus.MOUNTED) {
      appsByNewStatus.MOUNTED.forEach(app => {
        console.log(`微应用 ${app} 已挂载`);
      });
    }
    
    // 处理卸载的应用
    if (appsByNewStatus.NOT_MOUNTED) {
      appsByNewStatus.NOT_MOUNTED.forEach(app => {
        console.log(`微应用 ${app} 已卸载`);
      });
    }
  });
};
