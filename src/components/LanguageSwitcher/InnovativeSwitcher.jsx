import React, { useState, useEffect, useRef } from 'react';
import styles from './InnovativeSwitcher.module.scss';

const InnovativeSwitcher = ({ onLanguageChange, currentLanguage = 'en' }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  // 语言配置
  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
    { id: 'zh', name: '中文', flag: '🇨🇳', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' },
    { id: 'ja', name: '日本語', flag: '🇯🇵', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { id: 'ko', name: '한국어', flag: '🇰🇷', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
    { id: 'es', name: 'Español', flag: '🇪🇸', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { id: 'fr', name: 'Français', flag: '🇫🇷', color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' }
  ];

  const currentLang = languages.find(lang => lang.id === currentLanguage) || languages[0];
  const nextLang = languages[(languages.findIndex(lang => lang.id === currentLanguage) + 1) % languages.length];

  // 提示文字多语言
  const hintTexts = {
    'en': 'Click to switch language',
    'zh': '点击切换语言',
    'ja': 'クリックして言語を切り替え',
    'ko': '클릭하여 언어 전환',
    'es': 'Haz clic para cambiar idioma',
    'fr': 'Cliquer pour changer de langue'
  };

  const hintText = hintTexts[currentLanguage] || hintTexts['zh'];

  // 处理按钮点击 - 打开弹窗
  const handleButtonClick = () => {
    if (isFlipping) return;
    
    setShowTooltip(false);
    setShowModal(true);
    setSelectedLanguage(currentLanguage);
  };

  // 处理语言选择
  const handleLanguageSelect = (languageId) => {
    if (languageId === currentLanguage) {
      setShowModal(false);
      return;
    }

    setIsFlipping(true);
    setSelectedLanguage(languageId);
    
    // 模拟语音识别激活
    setVoiceActive(true);
    
    setTimeout(() => {
      onLanguageChange(languageId);
      setVoiceActive(false);
      setShowModal(false);
    }, 300);
    
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLanguage(currentLanguage);
  };

  // 触摸事件处理
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe || isRightSwipe) {
      handleButtonClick();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        handleButtonClick();
      }
      // ESC键关闭弹窗
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showModal]);

  // 工具提示定位
  useEffect(() => {
    if (showTooltip && tooltipRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      
      tooltip.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
      tooltip.style.top = `${buttonRect.top - 60}px`;
    }
  }, [showTooltip]);

  return (
    <div className={styles['innovative-switcher-container']}>
      {/* 主按钮 */}
      <button
        ref={buttonRef}
        className={`${styles['innovative-switcher']} ${isFlipping ? styles.flipping : ''} ${isHovered ? styles.hovered : ''} ${isPressed ? styles.pressed : ''} ${voiceActive ? styles['voice-active'] : ''}`}
        onClick={handleButtonClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          '--current-gradient': currentLang.gradient,
          '--next-gradient': nextLang.gradient,
          '--current-color': currentLang.color
        }}
        aria-label={`切换到 ${nextLang.name}`}
      >
        {/* 正面 */}
        <div className={styles['button-front']}>
          <div className={styles['flag-container']}>
            <span className={styles.flag}>{currentLang.flag}</span>
            {voiceActive && <div className={styles['voice-indicator']} />}
          </div>
          <div className={styles['language-code']}>{currentLang.id.toUpperCase()}</div>
          <div className={styles['switch-indicator']}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* 背面 */}
        <div className={styles['button-back']}>
          <div className={styles['flag-container']}>
            <span className={styles.flag}>{nextLang.flag}</span>
          </div>
          <div className={styles['language-code']}>{nextLang.id.toUpperCase()}</div>
          <div className={styles['language-name']}>{nextLang.name}</div>
        </div>
        
        {/* 光晕效果 */}
        <div className={styles['glow-effect']} />
        
        {/* 粒子效果 */}
        <div className={styles.particles}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={styles.particle} 
              style={{ 
                '--delay': `${i * 0.1}s`,
                '--random-x': `${(Math.random() - 0.5) * 40}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }} 
            />
          ))}
        </div>
      </button>

      {/* 工具提示 */}
      {showTooltip && (
        <div ref={tooltipRef} className={styles.tooltip}>
          <div className={styles['tooltip-content']}>
            <div className={styles['tooltip-title']}>语言切换器</div>
            <div className={styles['tooltip-description']}>
              点击打开语言选择器 • 滑动打开 • Ctrl+L 快捷键
            </div>
            <div className={styles['tooltip-languages']}>
              {languages.map(lang => (
                <span 
                  key={lang.id} 
                  className={`${styles['tooltip-lang']} ${lang.id === currentLanguage ? styles.active : ''}`}
                >
                  {lang.flag} {lang.name}
                </span>
              ))}
            </div>
          </div>
          <div className={styles['tooltip-arrow']} />
        </div>
      )}

      {/* 提示文字 */}
      <div className={styles['hint-text']}>
        {hintText}
      </div>

      {/* 状态指示器 */}
      <div className={styles['status-indicator']}>
        <div className={styles['status-item']}>
          <span className={styles['status-icon']}>🌐</span>
          <span className={styles['status-text']}>{currentLang.name}</span>
        </div>
        {voiceActive && (
          <div className={`${styles['status-item']} ${styles['voice-status']}`}>
            <span className={styles['status-icon']}>🎤</span>
            <span className={styles['status-text']}>语音识别中...</span>
          </div>
        )}
      </div>

      {/* 语言选择弹窗 */}
      {showModal && (
        <div className={styles['modal-overlay']} onClick={handleCloseModal}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <div className={styles['modal-header']}>
              <h3 className={styles['modal-title']}>选择语言</h3>
              <button 
                className={styles['modal-close']}
                onClick={handleCloseModal}
                aria-label="关闭弹窗"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* 语言列表 */}
            <div className={styles['language-grid']}>
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  className={`${styles['language-item']} ${lang.id === selectedLanguage ? styles.selected : ''} ${lang.id === currentLanguage ? styles.current : ''}`}
                  onClick={() => handleLanguageSelect(lang.id)}
                  style={{
                    '--item-gradient': lang.gradient,
                    '--item-color': lang.color
                  }}
                >
                  <div className={styles['language-flag']}>
                    {lang.flag}
                  </div>
                  <div className={styles['language-info']}>
                    <div className={styles['language-name']}>{lang.name}</div>
                    <div className={styles['language-code']}>{lang.id.toUpperCase()}</div>
                  </div>
                  {lang.id === currentLanguage && (
                    <div className={styles['current-indicator']}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {voiceActive && lang.id === selectedLanguage && (
                    <div className={styles['loading-indicator']}>
                      <div className={styles['spinner']}></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 弹窗底部 */}
            <div className={styles['modal-footer']}>
              <div className={styles['modal-tips']}>
                <span className={styles['tip-item']}>
                  <kbd>Ctrl</kbd> + <kbd>L</kbd> 打开选择器
                </span>
                <span className={styles['tip-item']}>
                  <kbd>ESC</kbd> 关闭弹窗
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovativeSwitcher; 