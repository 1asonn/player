/**
 * 自定义微应用管理器
 * 适用于简单的微前端需求，不依赖第三方框架
 */

class MicroAppManager {
  constructor() {
    this.apps = new Map();
    this.currentApp = null;
    this.container = null;
  }

  /**
   * 注册微应用
   */
  register(config) {
    const {
      name,
      entry,
      container,
      activeRule,
      props = {},
      beforeLoad = () => Promise.resolve(),
      afterMount = () => Promise.resolve(),
      beforeUnmount = () => Promise.resolve()
    } = config;

    this.apps.set(name, {
      name,
      entry,
      container,
      activeRule,
      props,
      beforeLoad,
      afterMount,
      beforeUnmount,
      loaded: false,
      mounted: false,
      instance: null
    });

    console.log(`微应用 ${name} 注册成功`);
  }

  /**
   * 批量注册微应用
   */
  registerApps(configs) {
    configs.forEach(config => this.register(config));
  }

  /**
   * 加载微应用
   */
  async loadApp(name) {
    const app = this.apps.get(name);
    if (!app) {
      throw new Error(`微应用 ${name} 未注册`);
    }

    if (app.loaded) {
      return app.instance;
    }

    try {
      // 执行加载前钩子
      await app.beforeLoad();

      // 动态创建script标签加载微应用
      const script = document.createElement('script');
      script.src = `${app.entry}/static/js/main.js`;
      script.async = true;

      // 创建微应用容器
      const container = document.querySelector(app.container) || 
                       document.getElementById(app.container);
      
      if (!container) {
        throw new Error(`找不到容器: ${app.container}`);
      }

      // 等待脚本加载完成
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // 获取微应用的导出函数
      const appInstance = window[`microApp_${name}`];
      if (!appInstance) {
        throw new Error(`微应用 ${name} 未正确导出`);
      }

      app.instance = appInstance;
      app.loaded = true;
      app.container = container;

      console.log(`微应用 ${name} 加载成功`);
      return appInstance;

    } catch (error) {
      console.error(`微应用 ${name} 加载失败:`, error);
      throw error;
    }
  }

  /**
   * 挂载微应用
   */
  async mountApp(name, props = {}) {
    const app = this.apps.get(name);
    if (!app) {
      throw new Error(`微应用 ${name} 未注册`);
    }

    // 卸载当前应用
    if (this.currentApp && this.currentApp !== name) {
      await this.unmountApp(this.currentApp);
    }

    // 如果未加载，先加载
    if (!app.loaded) {
      await this.loadApp(name);
    }

    // 如果已挂载，直接返回
    if (app.mounted) {
      return;
    }

    try {
      // 清空容器
      app.container.innerHTML = '';

      // 挂载微应用
      if (app.instance && typeof app.instance.mount === 'function') {
        await app.instance.mount(app.container, {
          ...app.props,
          ...props
        });
      }

      app.mounted = true;
      this.currentApp = name;

      // 执行挂载后钩子
      await app.afterMount();

      console.log(`微应用 ${name} 挂载成功`);

    } catch (error) {
      console.error(`微应用 ${name} 挂载失败:`, error);
      throw error;
    }
  }

  /**
   * 卸载微应用
   */
  async unmountApp(name) {
    const app = this.apps.get(name);
    if (!app || !app.mounted) {
      return;
    }

    try {
      // 执行卸载前钩子
      await app.beforeUnmount();

      // 卸载微应用
      if (app.instance && typeof app.instance.unmount === 'function') {
        await app.instance.unmount();
      }

      // 清空容器
      if (app.container) {
        app.container.innerHTML = '';
      }

      app.mounted = false;
      
      if (this.currentApp === name) {
        this.currentApp = null;
      }

      console.log(`微应用 ${name} 卸载成功`);

    } catch (error) {
      console.error(`微应用 ${name} 卸载失败:`, error);
      throw error;
    }
  }

  /**
   * 根据路由规则自动切换微应用
   */
  autoRouteApp(pathname) {
    for (const [name, app] of this.apps) {
      const isActive = typeof app.activeRule === 'function' 
        ? app.activeRule(pathname)
        : pathname.startsWith(app.activeRule);

      if (isActive) {
        this.mountApp(name);
        return;
      }
    }

    // 如果没有匹配的微应用，卸载当前应用
    if (this.currentApp) {
      this.unmountApp(this.currentApp);
    }
  }

  /**
   * 启动自动路由监听
   */
  startAutoRoute() {
    // 监听路由变化
    const handleRouteChange = () => {
      this.autoRouteApp(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    // 初始化时执行一次
    handleRouteChange();

    // 拦截pushState和replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };
  }

  /**
   * 获取所有已注册的微应用
   */
  getApps() {
    return Array.from(this.apps.values());
  }

  /**
   * 获取当前活跃的微应用
   */
  getCurrentApp() {
    return this.currentApp ? this.apps.get(this.currentApp) : null;
  }
}

// 创建全局实例
const microAppManager = new MicroAppManager();

export default microAppManager;

// 便捷方法导出
export const {
  register,
  registerApps,
  loadApp,
  mountApp,
  unmountApp,
  autoRouteApp,
  startAutoRoute,
  getApps,
  getCurrentApp
} = microAppManager;
