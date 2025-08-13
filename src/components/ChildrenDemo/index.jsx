import React from 'react';
import styles from './index.module.scss';

/**
 * 1. 正确使用 children 的组件
 */
export const CorrectComponent = ({ children, title }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      {/* ✅ 正确：使用 children 展示插槽内容 */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

/**
 * 2. 不使用 children 的组件 - 插槽内容不会显示
 */
export const IncorrectComponent = ({ title }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      {/* ❌ 错误：没有使用 children，插槽内容不会显示 */}
      <div className={styles.content}>
        <p>这里只会显示固定内容，不会显示插槽内容</p>
      </div>
    </div>
  );
};

/**
 * 3. 条件渲染 children
 */
export const ConditionalComponent = ({ children, title, showChildren = true }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.content}>
        {showChildren ? children : <p>插槽内容被隐藏了</p>}
      </div>
    </div>
  );
};

/**
 * 4. 默认插槽内容
 */
export const DefaultSlotComponent = ({ children, title }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.content}>
        {/* ✅ 如果没有传递 children，显示默认内容 */}
        {children || <p className={styles.defaultContent}>默认插槽内容</p>}
      </div>
    </div>
  );
};

/**
 * 5. 检查 children 是否存在
 */
export const CheckChildrenComponent = ({ children, title }) => {
  const hasChildren = React.Children.count(children) > 0;
  
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.content}>
        {hasChildren ? (
          <>
            <p className={styles.info}>检测到插槽内容：</p>
            {children}
          </>
        ) : (
          <p className={styles.warning}>没有检测到插槽内容</p>
        )}
      </div>
    </div>
  );
};

/**
 * 6. 多个插槽的组件
 */
export const MultiSlotComponent = ({ children, header, footer, title }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      
      {/* 具名插槽：header */}
      {header && (
        <div className={styles.header}>
          {header}
        </div>
      )}
      
      {/* 默认插槽：children */}
      <div className={styles.content}>
        {children}
      </div>
      
      {/* 具名插槽：footer */}
      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * 7. 函数式插槽（Render Props）
 */
export const RenderPropsComponent = ({ children, title, data }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.content}>
        {/* ✅ children 作为函数调用，传递数据 */}
        {typeof children === 'function' ? children(data) : children}
      </div>
    </div>
  );
};

/**
 * 8. 高阶组件包装（可能造成误解的情况）
 */
export const HOCWrappedComponent = ({ title }) => {
  // 这个组件看起来没有使用 children
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.content}>
        <p>这是高阶组件的内容</p>
      </div>
    </div>
  );
};

// 高阶组件包装器
export const withSlotContent = (WrappedComponent) => {
  return ({ children, ...props }) => {
    return (
      <div>
        <WrappedComponent {...props} />
        {/* ✅ 高阶组件在这里处理 children */}
        <div className={styles.hocSlot}>
          <p>高阶组件添加的插槽：</p>
          {children}
        </div>
      </div>
    );
  };
};

// 包装后的组件
export const EnhancedComponent = withSlotContent(HOCWrappedComponent);

/**
 * 9. 使用 React.cloneElement 的情况
 */
export const CloneElementComponent = ({ children, title, extraProps = {} }) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <div className={styles.content}>
        {React.Children.map(children, (child, index) => {
          // ✅ 克隆子元素并传递额外的 props
          return React.isValidElement(child) 
            ? React.cloneElement(child, { 
                key: index, 
                ...extraProps,
                className: `${child.props.className || ''} ${styles.clonedChild}`.trim()
              })
            : child;
        })}
      </div>
    </div>
  );
};
