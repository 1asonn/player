import React, { useState, useContext, createContext, Children, cloneElement } from 'react';
import styles from './AdvancedSlots.module.scss';

/**
 * 插槽上下文
 */
const SlotContext = createContext({});

/**
 * 插槽提供者
 */
export const SlotProvider = ({ children, value = {} }) => {
  return (
    <SlotContext.Provider value={value}>
      {children}
    </SlotContext.Provider>
  );
};

/**
 * 插槽消费者
 */
export const SlotConsumer = ({ children }) => {
  const context = useContext(SlotContext);
  return children(context);
};

/**
 * 条件插槽组件
 */
export const ConditionalSlot = ({ 
  condition, 
  children, 
  fallback = null,
  renderWhen,
  renderOtherwise 
}) => {
  if (renderWhen && renderOtherwise) {
    return condition ? renderWhen() : renderOtherwise();
  }
  
  return condition ? children : fallback;
};

/**
 * 动态插槽组件
 */
export const DynamicSlot = ({ 
  slotName, 
  slots = {}, 
  defaultSlot = null,
  context = {} 
}) => {
  const SlotComponent = slots[slotName];
  
  if (!SlotComponent) {
    return defaultSlot;
  }
  
  // 如果是函数组件，传递上下文
  if (typeof SlotComponent === 'function') {
    return <SlotComponent {...context} />;
  }
  
  // 如果是React元素，克隆并传递props
  if (React.isValidElement(SlotComponent)) {
    return cloneElement(SlotComponent, context);
  }
  
  return SlotComponent;
};

/**
 * 标签页插槽组件
 */
export const Tabs = ({ children, defaultActiveKey, onChange }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);
  
  // 解析标签页
  const tabs = [];
  const panes = {};
  
  Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TabPane) {
      const { tabKey, tab, disabled } = child.props;
      tabs.push({ key: tabKey, tab, disabled });
      panes[tabKey] = child;
    }
  });

  const handleTabClick = (key) => {
    if (activeKey !== key) {
      setActiveKey(key);
      onChange?.(key);
    }
  };

  return (
    <div className={styles.tabs}>
      {/* 标签栏 */}
      <div className={styles.tabBar}>
        {tabs.map(({ key, tab, disabled }) => (
          <div
            key={key}
            className={`${styles.tab} ${
              activeKey === key ? styles.active : ''
            } ${disabled ? styles.disabled : ''}`}
            onClick={() => !disabled && handleTabClick(key)}
          >
            {tab}
          </div>
        ))}
      </div>
      
      {/* 内容区域 */}
      <div className={styles.tabContent}>
        {panes[activeKey]}
      </div>
    </div>
  );
};

/**
 * 标签页面板组件
 */
export const TabPane = ({ children, tabKey, tab, disabled }) => {
  return <div className={styles.tabPane}>{children}</div>;
};

/**
 * 折叠面板插槽组件
 */
export const Collapse = ({ children, accordion = false }) => {
  const [activeKeys, setActiveKeys] = useState([]);
  
  const handlePanelChange = (key) => {
    if (accordion) {
      // 手风琴模式：只能展开一个
      setActiveKeys(activeKeys.includes(key) ? [] : [key]);
    } else {
      // 普通模式：可以展开多个
      setActiveKeys(prev => 
        prev.includes(key) 
          ? prev.filter(k => k !== key)
          : [...prev, key]
      );
    }
  };

  return (
    <div className={styles.collapse}>
      {Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === CollapsePanel) {
          const isActive = activeKeys.includes(child.props.panelKey);
          return cloneElement(child, {
            isActive,
            onToggle: () => handlePanelChange(child.props.panelKey)
          });
        }
        return child;
      })}
    </div>
  );
};

/**
 * 折叠面板组件
 */
export const CollapsePanel = ({ 
  children, 
  panelKey, 
  header, 
  isActive, 
  onToggle,
  disabled = false,
  extra 
}) => {
  return (
    <div className={`${styles.collapsePanel} ${isActive ? styles.active : ''}`}>
      <div 
        className={`${styles.collapseHeader} ${disabled ? styles.disabled : ''}`}
        onClick={!disabled ? onToggle : undefined}
      >
        <span className={styles.collapseTitle}>{header}</span>
        {extra && <span className={styles.collapseExtra}>{extra}</span>}
        <span className={`${styles.collapseArrow} ${isActive ? styles.expanded : ''}`}>
          ▼
        </span>
      </div>
      
      <div className={`${styles.collapseContent} ${isActive ? styles.show : ''}`}>
        <div className={styles.collapseBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * 步骤条插槽组件
 */
export const Steps = ({ children, current = 0, direction = 'horizontal' }) => {
  const steps = [];
  
  Children.forEach(children, (child, index) => {
    if (React.isValidElement(child) && child.type === Step) {
      steps.push({
        ...child.props,
        index,
        status: index < current ? 'finished' : 
                index === current ? 'process' : 'wait'
      });
    }
  });

  return (
    <div className={`${styles.steps} ${styles[direction]}`}>
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`${styles.step} ${styles[step.status]}`}
        >
          <div className={styles.stepIcon}>
            {step.icon || (index + 1)}
          </div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>{step.title}</div>
            {step.description && (
              <div className={styles.stepDescription}>{step.description}</div>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={styles.stepConnector}></div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * 步骤组件
 */
export const Step = ({ title, description, icon, status }) => {
  // 这个组件主要用于Steps组件的children解析
  return null;
};
