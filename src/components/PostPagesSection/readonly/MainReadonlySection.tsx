import clsx from 'clsx';

import styles from './MainReadonlySection.module.scss';

interface MainReadonlySectionProps {
  title?: React.ReactNode;
  titleAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const MainReadonlySection = ({
  title,
  titleAction,
  children,
  className,
}: MainReadonlySectionProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      {(title || titleAction) && (
        <div className={styles.titleArea}>
          {title && <div className={styles.title}>{title}</div>}
          {titleAction && <div className={styles.titleAction}>{titleAction}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default MainReadonlySection;
