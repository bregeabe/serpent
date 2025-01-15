import React from 'react';
import pageStyles from './styles/SelectorBox.module.css';

type SelectorBoxProps = {
  items: string[];
};

const SelectorBox: React.FC<SelectorBoxProps> = ({ items }) => {
  return (
    <div className={pageStyles.selectorBox}>
      {items.map((item, index) => (
        <div key={index} className={pageStyles.selector}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default SelectorBox;
