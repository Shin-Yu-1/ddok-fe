import clsx from 'clsx';

import styles from './SideReadonlySection.module.scss';

interface SideReadonlySectionProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SideReadonlySection = ({ title, children, className }: SideReadonlySectionProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.titleArea}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default SideReadonlySection;
