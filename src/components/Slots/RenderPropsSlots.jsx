import React, { useState, useEffect } from 'react';
import styles from './RenderPropsSlots.module.scss';

/**
 * 数据提供者组件 - 使用 render props 模式
 */
export const DataProvider = ({ 
  url, 
  children, 
  renderLoading, 
  renderError, 
  renderEmpty 
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = [
          { id: 1, name: '张三', age: 25 },
          { id: 2, name: '李四', age: 30 },
          { id: 3, name: '王五', age: 28 }
        ];
        
        setData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  // 渲染加载状态
  if (loading) {
    return renderLoading ? 
      renderLoading() : 
      <div className={styles.loading}>加载中...</div>;
  }

  // 渲染错误状态
  if (error) {
    return renderError ? 
      renderError(error) : 
      <div className={styles.error}>加载失败: {error}</div>;
  }

  // 渲染空数据状态
  if (!data || data.length === 0) {
    return renderEmpty ? 
      renderEmpty() : 
      <div className={styles.empty}>暂无数据</div>;
  }

  // 渲染数据
  return children(data);
};

/**
 * 列表组件 - 支持多种渲染插槽
 */
export const List = ({ 
  items = [], 
  renderItem, 
  renderHeader, 
  renderFooter, 
  renderEmpty,
  className = '',
  itemKey = 'id' 
}) => {
  return (
    <div className={`${styles.list} ${className}`}>
      {/* 头部插槽 */}
      {renderHeader && (
        <div className={styles.listHeader}>
          {renderHeader(items)}
        </div>
      )}
      
      {/* 列表内容 */}
      <div className={styles.listContent}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={item[itemKey] || index} className={styles.listItem}>
              {renderItem ? renderItem(item, index) : JSON.stringify(item)}
            </div>
          ))
        ) : (
          renderEmpty ? renderEmpty() : <div className={styles.empty}>列表为空</div>
        )}
      </div>
      
      {/* 底部插槽 */}
      {renderFooter && (
        <div className={styles.listFooter}>
          {renderFooter(items)}
        </div>
      )}
    </div>
  );
};

/**
 * 表单组件 - 使用 render props 实现字段插槽
 */
export const Form = ({ 
  initialValues = {}, 
  onSubmit, 
  children,
  renderActions,
  renderError 
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // 清除字段错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // 表单上下文
  const formContext = {
    values,
    errors,
    submitting,
    updateField,
    setErrors
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 全局错误显示 */}
      {errors.submit && (
        <div className={styles.formError}>
          {renderError ? renderError(errors.submit) : errors.submit}
        </div>
      )}
      
      {/* 表单字段 */}
      <div className={styles.formFields}>
        {children(formContext)}
      </div>
      
      {/* 操作按钮 */}
      <div className={styles.formActions}>
        {renderActions ? 
          renderActions(formContext) : 
          <button type="submit" disabled={submitting}>
            {submitting ? '提交中...' : '提交'}
          </button>
        }
      </div>
    </form>
  );
};

/**
 * 虚拟滚动列表 - 高性能渲染插槽
 */
export const VirtualList = ({ 
  items = [], 
  itemHeight = 50, 
  containerHeight = 300,
  renderItem,
  renderPlaceholder 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  // 计算可见范围
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div 
      className={styles.virtualList}
      style={{ height: containerHeight }}
      onScroll={e => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div 
              key={startIndex + index}
              className={styles.virtualListItem}
              style={{ height: itemHeight }}
            >
              {renderItem ? 
                renderItem(item, startIndex + index) : 
                (renderPlaceholder ? renderPlaceholder() : `Item ${startIndex + index}`)
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
