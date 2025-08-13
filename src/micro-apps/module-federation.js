/**
 * Webpack Module Federation 微应用配置
 * 
 * 主应用 webpack.config.js 配置示例：
 * 
 * const ModuleFederationPlugin = require('@module-federation/webpack');
 * 
 * module.exports = {
 *   plugins: [
 *     new ModuleFederationPlugin({
 *       name: 'shell', // 主应用名称
 *       remotes: {
 *         musicApp: 'musicApp@http://localhost:3001/remoteEntry.js',
 *         userApp: 'userApp@http://localhost:3002/remoteEntry.js',
 *         adminApp: 'adminApp@http://localhost:3003/remoteEntry.js',
 *       },
 *       shared: {
 *         react: { singleton: true },
 *         'react-dom': { singleton: true },
 *         'react-router-dom': { singleton: true }
 *       }
 *     })
 *   ]
 * };
 */

import React, { Suspense, lazy } from 'react';

/**
 * 动态导入微应用组件
 */
const loadRemoteComponent = (remoteName, componentName) => {
  return lazy(() => 
    import(/* webpackChunkName: "[request]" */ `${remoteName}/${componentName}`)
      .catch(() => {
        // 降级处理：如果微应用加载失败，显示错误组件
        return {
          default: () => (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#f56565' 
            }}>
              <h3>微应用加载失败</h3>
              <p>无法加载 {remoteName} 应用，请检查网络连接或联系管理员</p>
            </div>
          )
        };
      })
  );
};

/**
 * 微应用组件映射
 */
export const MicroApps = {
  // 音乐播放器应用
  MusicPlayer: loadRemoteComponent('musicApp', 'MusicPlayer'),
  MusicList: loadRemoteComponent('musicApp', 'MusicList'),
  
  // 用户中心应用
  UserProfile: loadRemoteComponent('userApp', 'UserProfile'),
  UserSettings: loadRemoteComponent('userApp', 'UserSettings'),
  
  // 管理后台应用
  AdminDashboard: loadRemoteComponent('adminApp', 'AdminDashboard'),
  UserManagement: loadRemoteComponent('adminApp', 'UserManagement'),
};

/**
 * 微应用包装组件
 */
export const MicroAppWrapper = ({ 
  appName, 
  componentName, 
  fallback = <div>加载中...</div>,
  errorBoundary = true,
  ...props 
}) => {
  const Component = MicroApps[componentName];
  
  if (!Component) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>未找到微应用组件: {componentName}</p>
      </div>
    );
  }

  const content = (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );

  // 可选：添加错误边界
  if (errorBoundary) {
    return (
      <ErrorBoundary appName={appName}>
        {content}
      </ErrorBoundary>
    );
  }

  return content;
};

/**
 * 错误边界组件
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`微应用 ${this.props.appName} 发生错误:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          border: '1px solid #f56565',
          borderRadius: '8px',
          backgroundColor: '#fed7d7'
        }}>
          <h3>微应用运行错误</h3>
          <p>{this.props.appName} 应用发生了未预期的错误</p>
          <details style={{ marginTop: '10px', textAlign: 'left' }}>
            <summary>错误详情</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px',
              backgroundColor: '#7494ec',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
