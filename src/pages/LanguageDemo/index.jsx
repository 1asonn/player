import React, { useState } from 'react';
import InnovativeSwitcher from '../../components/LanguageSwitcher/InnovativeSwitcher';
import './index.module.scss';

const LanguageDemo = () => {
  const [currentLanguage, setCurrentLanguage] = useState('zh');

  const handleLanguageChange = (languageId) => {
    setCurrentLanguage(languageId);
    console.log('Language changed to:', languageId);
  };

  const translations = {
    zh: {
      title: '创新性3D语言切换器',
      subtitle: '悬浮式智能语言切换解决方案',
      description: '点击右下角的悬浮按钮体验完整功能',
      currentLang: '当前语言'
    },
    en: {
      title: 'Innovative 3D Language Switcher',
      subtitle: 'Floating Smart Language Switching Solution',
      description: 'Click the floating button in the bottom right corner to experience full functionality',
      currentLang: 'Current Language'
    },
    ja: {
      title: '革新的3D言語スイッチャー',
      subtitle: 'フローティングスマート言語切り替えソリューション',
      description: '右下隅のフローティングボタンをクリックして完全な機能を体験してください',
      currentLang: '現在の言語'
    },
    ko: {
      title: '혁신적인 3D 언어 전환기',
      subtitle: '플로팅 스마트 언어 전환 솔루션',
      description: '오른쪽 하단의 플로팅 버튼을 클릭하여 전체 기능을 경험하세요',
      currentLang: '현재 언어'
    },
    es: {
      title: 'Cambiador de Idioma 3D Innovador',
      subtitle: 'Solución Flotante Inteligente de Cambio de Idioma',
      description: 'Haz clic en el botón flotante en la esquina inferior derecha para experimentar la funcionalidad completa',
      currentLang: 'Idioma Actual'
    },
    fr: {
      title: 'Commutateur de Langue 3D Innovant',
      subtitle: 'Solution Flottante Intelligente de Changement de Langue',
      description: 'Cliquez sur le bouton flottant dans le coin inférieur droit pour découvrir toutes les fonctionnalités',
      currentLang: 'Langue Actuelle'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  return (
    <div className="language-demo">
      {/* 顶部导航栏 */}
      <header className="demo-header">
        <div className="header-content">
          <h1 className="header-title">{t.title}</h1>
          <p className="header-subtitle">{t.subtitle}</p>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="demo-main">
        <div className="demo-container">
          <section className="demo-section">
            <div className="section-content">
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 40px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                borderRadius: '20px',
                color: 'white'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '30px' }}>🚀</div>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: '700' }}>
                  {t.title}
                </h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '30px' }}>
                  {t.description}
                </p>
                <div style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '12px', 
                  padding: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{ margin: '0', fontSize: '1rem' }}>
                    <strong>{t.currentLang}:</strong> {currentLanguage.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 悬浮的创新性语言切换器 */}
      <InnovativeSwitcher 
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default LanguageDemo; 