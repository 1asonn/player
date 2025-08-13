import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 导入页面组件
import Home from './pages/home';
import Login from './pages/login';
import MusicGalaxy from './pages/MusicGalaxy';
import LanguageDemo from './pages/LanguageDemo';
import Portal from './pages/portal';
import MatterDemo from './pages/matter/demo';
import Navigation from './components/Navigation';
import MicroAppDemo from './pages/MicroAppDemo';
// import ThemeManager from './components/ThemeManager';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 主题管理器 - 根据路由自动设置主题色 */}
        <Routes>
          {/* 默认路由重定向到首页 */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* 各个页面路由 */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/music-galaxy" element={<MusicGalaxy />} />
          <Route path="/language-demo" element={<LanguageDemo />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/matter-demo" element={<MatterDemo />} />
          <Route path="/micro-app-demo" element={<MicroAppDemo />} />


          
          {/* 404页面 - 可选 */}
          <Route path="*" element={<div>页面未找到</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
  

    
    
    
    