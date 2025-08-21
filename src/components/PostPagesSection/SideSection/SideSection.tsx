import clsx from 'clsx';

import styles from './SideSection.module.scss';

interface SideSectionProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  readonly?: boolean;
}

const SideSection = ({ title, children, className, readonly = false }: SideSectionProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.titleArea}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={clsx(styles.content, readonly && styles.readonly)}>{children}</div>
      </div>
    </div>
  );
};

export default SideSection;
