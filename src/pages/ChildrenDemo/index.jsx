import React, { useState } from 'react';
import {
  CorrectComponent,
  IncorrectComponent,
  ConditionalComponent,
  DefaultSlotComponent,
  CheckChildrenComponent,
  MultiSlotComponent,
  RenderPropsComponent,
  EnhancedComponent,
  CloneElementComponent
} from '../../components/ChildrenDemo';
import styles from './index.module.scss';

const ChildrenDemoPage = () => {
  const [showChildren, setShowChildren] = useState(true);
  const [userData] = useState({ name: '张三', age: 25, role: '开发者' });

  return (
    <div className={styles.demoPage}>
      <div className={styles.header}>
        <h1>React Children 机制演示</h1>
        <p>展示为什么子组件需要使用 props.children 来显示插槽内容</p>
      </div>

      <div className={styles.section}>
        <h2>🟢 1. 正确使用 children</h2>
        <p className={styles.description}>
          组件内部使用 `{'{children}'}` 来渲染插槽内容
        </p>
        
        <CorrectComponent title="正确示例">
          <p>✅ 这段内容会正常显示，因为组件使用了 children</p>
          <button>我是插槽中的按钮</button>
        </CorrectComponent>
      </div>

      <div className={styles.section}>
        <h2>🔴 2. 不使用 children</h2>
        <p className={styles.description}>
          组件内部没有使用 `{'{children}'}` - 插槽内容不会显示
        </p>
        
        <IncorrectComponent title="错误示例">
          <p>❌ 这段内容不会显示，因为组件没有使用 children</p>
          <button>我是看不见的按钮</button>
        </IncorrectComponent>
      </div>

      <div className={styles.section}>
        <h2>🟡 3. 条件渲染 children</h2>
        <p className={styles.description}>
          根据条件决定是否显示插槽内容
        </p>
        
        <div className={styles.controls}>
          <label>
            <input
              type="checkbox"
              checked={showChildren}
              onChange={(e) => setShowChildren(e.target.checked)}
            />
            显示插槽内容
          </label>
        </div>
        
        <ConditionalComponent title="条件渲染示例" showChildren={showChildren}>
          <p>🔄 这段内容的显示取决于上面的复选框状态</p>
          <div>当前状态：{showChildren ? '显示' : '隐藏'}</div>
        </ConditionalComponent>
      </div>

      <div className={styles.section}>
        <h2>🟦 4. 默认插槽内容</h2>
        <p className={styles.description}>
          当没有传递 children 时，显示默认内容
        </p>
        
        <div className={styles.examples}>
          <DefaultSlotComponent title="有内容的插槽">
            <p>🎯 这是自定义的插槽内容</p>
          </DefaultSlotComponent>
          
          <DefaultSlotComponent title="空插槽（显示默认内容）">
            {/* 没有传递任何内容 */}
          </DefaultSlotComponent>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🔍 5. 检查 children 是否存在</h2>
        <p className={styles.description}>
          使用 React.Children.count() 检测插槽内容
        </p>
        
        <div className={styles.examples}>
          <CheckChildrenComponent title="有内容的检查">
            <p>📝 这里有内容</p>
            <span>还有更多内容</span>
          </CheckChildrenComponent>
          
          <CheckChildrenComponent title="空内容的检查">
            {/* 空的 */}
          </CheckChildrenComponent>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🎭 6. 多个插槽</h2>
        <p className={styles.description}>
          除了默认插槽 children，还可以有具名插槽
        </p>
        
        <MultiSlotComponent 
          title="多插槽示例"
          header={<div>🎯 这是头部插槽内容</div>}
          footer={<div>🎯 这是底部插槽内容</div>}
        >
          <p>🎯 这是默认插槽（children）的内容</p>
          <p>可以看到三个不同的插槽区域</p>
        </MultiSlotComponent>
      </div>

      <div className={styles.section}>
        <h2>🚀 7. 函数式插槽 (Render Props)</h2>
        <p className={styles.description}>
          children 作为函数，可以接收父组件传递的数据
        </p>
        
        <RenderPropsComponent title="Render Props 示例" data={userData}>
          {(data) => (
            <div>
              <p>📊 接收到的数据：</p>
              <ul>
                <li>姓名：{data.name}</li>
                <li>年龄：{data.age}</li>
                <li>职位：{data.role}</li>
              </ul>
            </div>
          )}
        </RenderPropsComponent>
      </div>

      <div className={styles.section}>
        <h2>🔧 8. 高阶组件处理插槽</h2>
        <p className={styles.description}>
          高阶组件可以在包装层处理 children，被包装的组件看起来没有使用 children
        </p>
        
        <EnhancedComponent title="被高阶组件包装的组件">
          <p>🎁 这段内容由高阶组件处理</p>
          <p>被包装的组件本身没有使用 children</p>
        </EnhancedComponent>
      </div>

      <div className={styles.section}>
        <h2>🎨 9. 克隆子元素</h2>
        <p className={styles.description}>
          使用 React.cloneElement 给子元素添加额外的 props
        </p>
        
        <CloneElementComponent 
          title="克隆元素示例" 
          extraProps={{ 'data-enhanced': true }}
        >
          <div>第一个子元素</div>
          <span>第二个子元素</span>
          <button>第三个子元素</button>
        </CloneElementComponent>
      </div>

      <div className={styles.summary}>
        <h2>📚 总结</h2>
        <div className={styles.summaryContent}>
          <h3>核心原理：</h3>
          <ul>
            <li>✅ <strong>必须使用 children</strong>：组件内部必须渲染 `{'{children}'}` 才能显示插槽内容</li>
            <li>🔄 <strong>children 是 prop</strong>：`children` 就是一个特殊的 prop，包含组件标签之间的内容</li>
            <li>🎯 <strong>JSX 转换</strong>：`&lt;Component&gt;content&lt;/Component&gt;` 会转换为 `React.createElement(Component, null, content)`</li>
          </ul>
          
          <h3>常见误解：</h3>
          <ul>
            <li>❌ 认为插槽内容会"自动显示"</li>
            <li>❌ 混淆了高阶组件的包装效果</li>
            <li>❌ 不理解 children 的传递机制</li>
          </ul>
          
          <h3>最佳实践：</h3>
          <ul>
            <li>🎯 总是在需要插槽的地方显式使用 `{'{children}'}`</li>
            <li>🛡️ 检查 children 是否存在再渲染</li>
            <li>🎨 为空插槽提供默认内容</li>
            <li>🔧 使用 React.Children API 处理复杂情况</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChildrenDemoPage;
