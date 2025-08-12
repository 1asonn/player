// 路由路径常量
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  MUSIC_GALAXY: '/music-galaxy',
  LANGUAGE_DEMO: '/language-demo',
  PORTAL: '/portal',
  MATTER_DEMO: '/matter-demo'
};

// 页面标题映射
export const PAGE_TITLES = {
  [ROUTES.HOME]: '首页 - 华语乐坛歌手馆',
  [ROUTES.LOGIN]: '登录 - 华语乐坛歌手馆',
  [ROUTES.MUSIC_GALAXY]: '音乐银河 - 华语乐坛歌手馆',
  [ROUTES.LANGUAGE_DEMO]: '语言演示 - 华语乐坛歌手馆',
  [ROUTES.PORTAL]: '传送门 - 华语乐坛歌手馆',
  [ROUTES.MATTER_DEMO]: 'Matter演示 - 华语乐坛歌手馆'
};

// 设置页面标题的函数
export const setPageTitle = (path) => {
  const title = PAGE_TITLES[path] || '华语乐坛歌手馆';
  document.title = title;
};

// 检查是否为受保护的路由（需要登录）
export const isProtectedRoute = (path) => {
  const protectedRoutes = [ROUTES.MUSIC_GALAXY, ROUTES.PORTAL];
  return protectedRoutes.includes(path);
}; 