import React from 'react';
import { useThemeColor } from '../../utils/hooks/useThemeColor';

/**
 * 主题管理器组件
 * 必须在Router内部使用，因为使用了useLocation Hook
 */
const ThemeManager = ({ autoByRoute = true, defaultColor = null }) => {
  // 在Router内部使用useLocation是安全的
  useThemeColor(defaultColor, autoByRoute);
  
  // 这个组件不渲染任何UI，只负责主题管理
  return null;
};

export default ThemeManager; 