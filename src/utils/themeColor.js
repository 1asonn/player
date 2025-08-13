/**
 * 动态设置浏览器主题色（theme-color）
 * @param {string} color - 十六进制颜色值，如 '#7494ec'
 */
export const setThemeColor = (color) => {
  // 查找现有的 theme-color meta 标签
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  
  if (themeColorMeta) {
    // 如果存在，更新颜色
    themeColorMeta.setAttribute('content', color);
  } else {
    // 如果不存在，创建新的 meta 标签
    themeColorMeta = document.createElement('meta');
    themeColorMeta.setAttribute('name', 'theme-color');
    themeColorMeta.setAttribute('content', color);
    document.head.appendChild(themeColorMeta);
  }
  
  console.log(`Theme color updated to: ${color}`);
};

/**
 * 获取当前的主题色
 * @returns {string} 当前的主题色值
 */
export const getThemeColor = () => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  return themeColorMeta ? themeColorMeta.getAttribute('content') : '#000000';
};

/**
 * 根据页面路径自动设置主题色
 * @param {string} pathname - 当前页面路径
 */
export const setThemeColorByRoute = (pathname) => {
  const routeColors = {
    '/login': '#7494ec',
    '/home': '#4CAF50',
    '/music-galaxy': '#9C27B0',
    '/language-demo': '#FF9800',
    '/portal': '#2196F3',
    '/matter-demo': '#795548'
  };
  
  const color = routeColors[pathname] || '#7494ec'; // 默认颜色
  setThemeColor(color);
};

/**
 * 预定义的颜色常量
 */
export const THEME_COLORS = {
  PRIMARY: '#7494ec',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  DANGER: '#f44336',
  INFO: '#2196F3',
  PURPLE: '#9C27B0',
  BROWN: '#795548'
}; 