import React, { useState } from 'react';
import InnovativeSwitcher from './InnovativeSwitcher';

/**
 * 创新性语言切换器使用示例
 * 展示如何在实际项目中集成和使用该组件
 */
const InnovativeSwitcherExample = () => {
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [notifications, setNotifications] = useState([]);

  // 处理语言切换
  const handleLanguageChange = (newLanguage) => {
    console.log(`语言从 ${currentLanguage} 切换到 ${newLanguage}`);
    
    // 添加通知
    const notification = {
      id: Date.now(),
      message: `语言已切换到 ${getLanguageName(newLanguage)}`,
      type: 'success'
    };
    
    setNotifications(prev => [...prev, notification]);
    setCurrentLanguage(newLanguage);

    // 模拟API调用或其他业务逻辑
    setTimeout(() => {
      console.log('语言切换完成，更新UI内容');
      // 这里可以添加实际的语言切换逻辑
      // 比如：i18n.changeLanguage(newLanguage);
    }, 300);

    // 3秒后移除通知
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  // 获取语言名称
  const getLanguageName = (langCode) => {
    const names = {
      'en': 'English',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'es': 'Español',
      'fr': 'Français'
    };
    return names[langCode] || langCode;
  };

  // 示例文本内容
  const content = {
    'en': {
      title: 'Innovative Language Switcher',
      description: 'Experience the future of language switching with our 3D interactive button.',
      features: ['3D Flip Animation', 'Smart Color Gradients', 'Gesture Support', 'Voice Recognition']
    },
    'zh': {
      title: '创新性语言切换器',
      description: '体验我们3D交互按钮带来的语言切换未来。',
      features: ['3D翻转动画', '智能颜色渐变', '手势支持', '语音识别']
    },
    'ja': {
      title: '革新的言語スイッチャー',
      description: '3Dインタラクティブボタンで言語切り替えの未来を体験してください。',
      features: ['3Dフリップアニメーション', 'スマートカラーグラデーション', 'ジェスチャーサポート', '音声認識']
    },
    'ko': {
      title: '혁신적인 언어 전환기',
      description: '3D 인터랙티브 버튼으로 언어 전환의 미래를 경험하세요.',
      features: ['3D 플립 애니메이션', '스마트 컬러 그라디언트', '제스처 지원', '음성 인식']
    },
    'es': {
      title: 'Cambiador de Idioma Innovador',
      description: 'Experimenta el futuro del cambio de idioma con nuestro botón interactivo 3D.',
      features: ['Animación de Volteo 3D', 'Gradientes de Color Inteligentes', 'Soporte de Gestos', 'Reconocimiento de Voz']
    },
    'fr': {
      title: 'Commutateur de Langue Innovant',
      description: 'Découvrez l\'avenir du changement de langue avec notre bouton interactif 3D.',
      features: ['Animation de Retournement 3D', 'Dégradés de Couleur Intelligents', 'Support de Gestes', 'Reconnaissance Vocale']
    }
  };

  const currentContent = content[currentLanguage] || content['en'];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 通知系统 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '10px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            ✅ {notification.message}
          </div>
        ))}
      </div>

      {/* 主要内容 */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* 标题 */}
        <h1 style={{
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {currentContent.title}
        </h1>

        {/* 描述 */}
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '1.2rem',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          {currentContent.description}
        </p>

        {/* 语言切换器 */}
        <div style={{
          margin: '60px 0',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <InnovativeSwitcher 
            onLanguageChange={handleLanguageChange}
            currentLanguage={currentLanguage}
          />
        </div>

        {/* 特性列表 */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginTop: '40px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.8rem',
            marginBottom: '30px'
          }}>
            主要特性
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {currentContent.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '10px'
                }}>
                  {['🎭', '🌈', '👆', '🎤'][index]}
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 当前语言状态 */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <strong>当前语言:</strong> {getLanguageName(currentLanguage)} ({currentLanguage})
        </div>
      </div>

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default InnovativeSwitcherExample;