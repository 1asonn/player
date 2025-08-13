import React from 'react';
import styles from './index.module.scss';

/**
 * 子组件 - 接收并展示 children
 */
const ChildComponent = ({ title, children, className = '' }) => {
  return (
    <div className={`${styles.childComponent} ${className}`}>
      <h3>{title}</h3>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

/**
 * 演示不同的 children 传递方式
 */
const ChildrenPassingDemo = () => {
  // 用于演示的内容
  const sampleContent = (
    <div>
      <p>🎯 这是动态内容</p>
      <button>点击按钮</button>
    </div>
  );

  return (
    <div className={styles.demo}>
      <h1>React Children 传递方式对比</h1>

      {/* ===== 方式一：标签内传递（推荐） ===== */}
      <section className={styles.section}>
        <h2>✅ 方式一：标签内传递（推荐标准方式）</h2>
        <div className={styles.description}>
          <p>在组件的开始和结束标签之间直接写内容，这是最常用和推荐的方式</p>
        </div>

        {/* 1.1 直接写内容 */}
        <div className={styles.example}>
          <h4>1.1 直接写内容</h4>
          <ChildComponent title="直接内容示例">
            <p>🚀 这是直接写在标签内的内容</p>
            <div>可以包含任何JSX元素</div>
            <button>我是按钮</button>
          </ChildComponent>
        </div>

        {/* 1.2 写变量 */}
        <div className={styles.example}>
          <h4>1.2 写变量</h4>
          <ChildComponent title="变量内容示例">
            {sampleContent}
          </ChildComponent>
        </div>

        {/* 1.3 写表达式 */}
        <div className={styles.example}>
          <h4>1.3 写表达式</h4>
          <ChildComponent title="表达式示例">
            {['苹果', '香蕉', '橙子'].map((fruit, index) => (
              <div key={index} className={styles.fruit}>
                🍎 {fruit}
              </div>
            ))}
          </ChildComponent>
        </div>

        {/* 1.4 混合内容 */}
        <div className={styles.example}>
          <h4>1.4 混合内容</h4>
          <ChildComponent title="混合内容示例">
            <h5>标题</h5>
            <p>段落文本</p>
            {sampleContent}
            <ul>
              <li>列表项 1</li>
              <li>列表项 2</li>
            </ul>
          </ChildComponent>
        </div>
      </section>

      {/* ===== 方式二：作为 props 明确传递 ===== */}
      <section className={styles.section}>
        <h2>⚠️ 方式二：作为 props 明确传递（不常用）</h2>
        <div className={styles.description}>
          <p>显式地将内容作为 children prop 传递，语法较繁琐，通常不推荐</p>
        </div>

        {/* 2.1 明确传递 children prop */}
        <div className={styles.example}>
          <h4>2.1 明确传递 children prop</h4>
          <ChildComponent 
            title="明确传递示例"
            children={
              <div>
                <p>📝 这是通过 children prop 明确传递的内容</p>
                <span>语法比较繁琐</span>
              </div>
            }
          />
        </div>

        {/* 2.2 自闭合标签 + children prop */}
        <div className={styles.example}>
          <h4>2.2 自闭合标签 + children prop</h4>
          <ChildComponent 
            title="自闭合标签示例"
            children={<p>🔒 使用自闭合标签传递 children</p>}
          />
        </div>
      </section>

      {/* ===== 对比分析 ===== */}
      <section className={styles.comparison}>
        <h2>📊 两种方式对比</h2>
        
        <div className={styles.comparisonGrid}>
          <div className={styles.comparisonItem}>
            <h3>✅ 标签内传递</h3>
            <div className={styles.pros}>
              <h4>优点：</h4>
              <ul>
                <li>🎯 语法简洁直观</li>
                <li>📖 可读性强</li>
                <li>🏆 React 官方推荐</li>
                <li>🔄 支持多个子元素</li>
                <li>💡 IDE 支持更好</li>
              </ul>
            </div>
            <div className={styles.code}>
              <pre>{`<Component>
  <p>内容</p>
</Component>`}</pre>
            </div>
          </div>

          <div className={styles.comparisonItem}>
            <h3>⚠️ 明确传递 prop</h3>
            <div className={styles.cons}>
              <h4>缺点：</h4>
              <ul>
                <li>📝 语法繁琐</li>
                <li>🔍 可读性差</li>
                <li>🚫 不符合 JSX 设计理念</li>
                <li>⚡ 性能无差异</li>
                <li>🛠️ 维护成本高</li>
              </ul>
            </div>
            <div className={styles.code}>
              <pre>{`<Component 
  children={<p>内容</p>} 
/>`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 特殊情况 ===== */}
      <section className={styles.section}>
        <h2>🎪 特殊情况和高级用法</h2>

        {/* 3.1 条件渲染 children */}
        <div className={styles.example}>
          <h4>3.1 条件渲染 children</h4>
          <ChildComponent title="条件渲染示例">
            {Math.random() > 0.5 ? (
              <p>🎲 随机显示：幸运数字！</p>
            ) : (
              <p>🎲 随机显示：再试一次</p>
            )}
          </ChildComponent>
        </div>

        {/* 3.2 函数作为 children */}
        <div className={styles.example}>
          <h4>3.2 函数作为 children (Render Props)</h4>
          <DataProvider>
            {(data) => (
              <div>
                <p>📊 接收到数据：{data.message}</p>
                <p>🕐 时间：{data.timestamp}</p>
              </div>
            )}
          </DataProvider>
        </div>

        {/* 3.3 多个 children */}
        <div className={styles.example}>
          <h4>3.3 多个 children</h4>
          <ChildComponent title="多个子元素">
            <div>第一个子元素</div>
            <div>第二个子元素</div>
            <div>第三个子元素</div>
            {/* React 会自动将多个子元素包装成数组 */}
          </ChildComponent>
        </div>
      </section>

      {/* ===== 最佳实践 ===== */}
      <section className={styles.bestPractices}>
        <h2>🏆 最佳实践建议</h2>
        <div className={styles.practiceGrid}>
          <div className={styles.practice}>
            <h3>✅ 推荐做法</h3>
            <ul>
              <li>🎯 优先使用标签内传递</li>
              <li>📖 保持代码简洁易读</li>
              <li>🔄 充分利用 JSX 的表达能力</li>
              <li>🛡️ 在子组件中检查 children 存在性</li>
            </ul>
          </div>
          <div className={styles.practice}>
            <h3>❌ 避免做法</h3>
            <ul>
              <li>🚫 不必要的 children prop 传递</li>
              <li>📝 过度复杂的嵌套结构</li>
              <li>⚠️ 忘记处理空 children 情况</li>
              <li>🔍 混淆 children 和普通 props</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * 演示 Render Props 的数据提供者组件
 */
const DataProvider = ({ children }) => {
  const data = {
    message: "Hello from DataProvider",
    timestamp: new Date().toLocaleTimeString()
  };

  return (
    <div className={styles.dataProvider}>
      {typeof children === 'function' ? children(data) : children}
    </div>
  );
};

export default ChildrenPassingDemo;
