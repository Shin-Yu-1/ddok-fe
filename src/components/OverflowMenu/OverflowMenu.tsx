import { forwardRef } from 'react';

import styles from './OverflowMenu.module.scss';

interface OverflowMenuItem {
  icon?: React.ReactNode;
  name: string;
  onClick?: () => void;
}

interface menuProps {
  position?: { top?: number; bottom?: number; right?: number; left?: number };
  menuItems?: OverflowMenuItem[];
}

const OverflowMenu = forwardRef<HTMLDivElement, menuProps>(
  ({ position = { top: 0, left: 0 }, menuItems }, ref) => {
    return (
      <div ref={ref} className={styles.overflowMenuWrapper} style={position}>
        <ul className={styles.menuList}>
          {menuItems?.map(item => (
            <li
              key={item.name}
              className={`${styles.itemWrapper} ${!item.onClick ? styles.disabled : ''}`}
              onClick={item.onClick}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.name}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default OverflowMenu;
