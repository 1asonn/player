import React from 'react';
import styles from './BasicSlot.module.scss';

/**
 * 基础插槽组件 - 使用 children
 */
const BasicSlot = ({ 
  title, 
  children, 
  className = '', 
  showBorder = true,
  theme = 'default' 
}) => {
  return (
    <div className={`${styles.basicSlot} ${styles[theme]} ${className} ${showBorder ? styles.bordered : ''}`}>
      {title && (
        <div className={styles.header}>
          <h3>{title}</h3>
        </div>
      )}
      
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

/**
 * 卡片插槽组件
 */
export const Card = ({ children, title, actions, ...props }) => {
  return (
    <div className={styles.card} {...props}>
      {title && (
        <div className={styles.cardHeader}>
          <h4>{title}</h4>
          {actions && <div className={styles.cardActions}>{actions}</div>}
        </div>
      )}
      <div className={styles.cardBody}>
        {children}
      </div>
    </div>
  );
};

/**
 * 模态框插槽组件
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium' 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modal} ${styles[size]}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicSlot;
