import { registerMicroApps, start } from 'qiankun';

/**
 * 注册微应用配置
 */
const microApps = [
  {
    name: 'music-player', // 微应用名称
    entry: '//localhost:3001', // 微应用入口地址
    container: '#micro-app-container', // 微应用挂载的容器
    activeRule: '/music', // 激活路由规则
    props: {
      // 传递给微应用的参数
      theme: 'dark',
      userInfo: { id: 1, name: 'User' }
    }
  },
  {
    name: 'user-center',
    entry: '//localhost:3002',
    container: '#micro-app-container',
    activeRule: '/user',
    props: {
      theme: 'light'
    }
  },
  {
    name: 'admin-panel',
    entry: '//localhost:3003',
    container: '#micro-app-container',
    activeRule: '/admin',
    props: {
      permissions: ['read', 'write']
    }
  }
];

/**
 * 注册微应用
 */
export const initMicroApps = () => {
  // 注册微应用
  registerMicroApps(microApps, {
    // 微应用挂载前
    beforeLoad: (app) => {
      console.log('微应用加载前:', app.name);
      // 可以在这里做一些准备工作，比如显示loading
      return Promise.resolve();
    },
    
    // 微应用挂载后
    beforeMount: (app) => {
      console.log('微应用挂载前:', app.name);
      return Promise.resolve();
    },
    
    // 微应用挂载完成
    afterMount: (app) => {
      console.log('微应用挂载完成:', app.name);
      // 隐藏loading，微应用已经渲染完成
      return Promise.resolve();
    },
    
    // 微应用卸载后
    afterUnmount: (app) => {
      console.log('微应用卸载完成:', app.name);
      return Promise.resolve();
    }
  });

  // 启动 qiankun
  start({
    prefetch: true, // 预加载微应用
    sandbox: {
      strictStyleIsolation: true, // 严格样式隔离
      experimentalStyleIsolation: true // 实验性样式隔离
    },
    singular: false // 是否为单例模式，默认为 true
  });
};

/**
 * 手动加载微应用
 */
export const loadMicroApp = (appConfig) => {
  return import('qiankun').then(({ loadMicroApp }) => {
    return loadMicroApp(appConfig);
  });
};
