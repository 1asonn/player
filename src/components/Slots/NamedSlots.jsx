import React, { Children, cloneElement } from 'react';
import styles from './NamedSlots.module.scss';

/**
 * 具名插槽组件
 */
const NamedSlots = ({ children }) => {
  // 解析具名插槽
  const slots = {};
  
  Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props.slot) {
      const slotName = child.props.slot;
      if (!slots[slotName]) {
        slots[slotName] = [];
      }
      // 移除 slot 属性，避免传递给 DOM
      const { slot, ...otherProps } = child.props;
      slots[slotName].push(cloneElement(child, otherProps));
    }
  });

  return (
    <div className={styles.namedSlots}>
      {/* 头部插槽 */}
      <div className={styles.header}>
        {slots.header || <div className={styles.defaultHeader}>默认头部</div>}
      </div>
      
      {/* 侧边栏插槽 */}
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {slots.sidebar || <div className={styles.defaultSidebar}>默认侧边栏</div>}
        </div>
        
        {/* 主内容插槽 */}
        <div className={styles.main}>
          {slots.main || <div className={styles.defaultMain}>默认主内容</div>}
        </div>
      </div>
      
      {/* 底部插槽 */}
      <div className={styles.footer}>
        {slots.footer || <div className={styles.defaultFooter}>默认底部</div>}
      </div>
    </div>
  );
};

/**
 * 布局组件 - 更高级的具名插槽实现
 */
export const Layout = ({ children }) => {
  const slots = {
    header: null,
    sidebar: null,
    main: null,
    footer: null,
    toolbar: null
  };

  // 收集所有插槽内容
  Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const slotName = child.props.slot;
      if (slotName && slots.hasOwnProperty(slotName)) {
        const { slot, ...props } = child.props;
        slots[slotName] = cloneElement(child, props);
      }
    }
  });

  return (
    <div className={styles.layout}>
      {slots.header && (
        <header className={styles.layoutHeader}>
          {slots.header}
        </header>
      )}
      
      {slots.toolbar && (
        <div className={styles.toolbar}>
          {slots.toolbar}
        </div>
      )}
      
      <div className={styles.layoutBody}>
        {slots.sidebar && (
          <aside className={styles.layoutSidebar}>
            {slots.sidebar}
          </aside>
        )}
        
        <main className={styles.layoutMain}>
          {slots.main || children}
        </main>
      </div>
      
      {slots.footer && (
        <footer className={styles.layoutFooter}>
          {slots.footer}
        </footer>
      )}
    </div>
  );
};

/**
 * 表格插槽组件
 */
export const Table = ({ children, columns = [], data = [] }) => {
  const slots = {};
  
  // 收集插槽内容
  Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props.slot) {
      slots[child.props.slot] = child;
    }
  });

  return (
    <div className={styles.table}>
      {/* 表格工具栏插槽 */}
      {slots.toolbar && (
        <div className={styles.tableToolbar}>
          {slots.toolbar}
        </div>
      )}
      
      <table className={styles.tableElement}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {/* 自定义列插槽 */}
                  {slots[`column-${col.key}`] ? 
                    cloneElement(slots[`column-${col.key}`], { 
                      record: row, 
                      value: row[col.key] 
                    }) : 
                    row[col.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 表格底部插槽 */}
      {slots.footer && (
        <div className={styles.tableFooter}>
          {slots.footer}
        </div>
      )}
    </div>
  );
};

export default NamedSlots;
