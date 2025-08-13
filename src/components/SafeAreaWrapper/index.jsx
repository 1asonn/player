import React from 'react';
import { useSafeArea, isSafariMobile } from '../../utils/hooks/useSafeArea';
import styles from './index.module.scss';

const SafeAreaWrapper = ({ children, className = '', bottomOffset = 0 }) => {
  const safeArea = useSafeArea();
  const isSafari = isSafariMobile();
  console.log("children",children)
  const wrapperStyle = {
    paddingBottom: Math.max(safeArea.bottom, bottomOffset) + 'px',
  };

  return (
    <div 
    >
      {children}
    </div>
  );
};

export default SafeAreaWrapper; 