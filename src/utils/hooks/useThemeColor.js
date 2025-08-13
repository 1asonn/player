import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setThemeColor, setThemeColorByRoute, getThemeColor, THEME_COLORS } from '../themeColor';

/**
 * 动态主题色 Hook
 * @param {string} color - 可选的固定颜色
 * @param {boolean} autoByRoute - 是否根据路由自动设置颜色
 * @returns {object} 包含设置主题色方法的对象
 */
export const useThemeColor = (color = null, autoByRoute = false) => {
  const location = useLocation();

  useEffect(() => {
    if (color) {
      // 如果指定了颜色，直接设置
      setThemeColor(color);
    } else if (autoByRoute) {
      // 如果启用了自动路由模式，根据当前路径设置
      setThemeColorByRoute(location.pathname);
    }
  }, [color, autoByRoute, location.pathname]);

  // 返回控制方法
  return {
    setColor: setThemeColor,
    getCurrentColor: getThemeColor,
    setByRoute: setThemeColorByRoute,
    colors: THEME_COLORS
  };
};

/**
 * 页面级主题色 Hook - 在页面组件中使用
 * 会在组件挂载时设置主题色，卸载时恢复默认色
 * @param {string} color - 页面的主题色
 * @param {string} defaultColor - 默认颜色（可选）
 */
export const usePageThemeColor = (color, defaultColor = THEME_COLORS.PRIMARY) => {
  useEffect(() => {
    // 组件挂载时设置页面主题色
    setThemeColor(color);

    // 组件卸载时恢复默认主题色
    return () => {
      setThemeColor(defaultColor);
    };
  }, [color, defaultColor]);
}; 