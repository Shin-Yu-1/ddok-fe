import clsx from 'clsx';

import styles from './MainSection.module.scss';

interface MainSectionProps {
  title?: React.ReactNode;
  titleAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  readonly?: boolean;
}

const MainSection = ({
  title,
  titleAction,
  children,
  className,
  readonly = false,
}: MainSectionProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      {(title || titleAction) && (
        <div className={styles.titleArea}>
          {title && <div className={styles.title}>{title}</div>}
          {titleAction && <div className={styles.titleAction}>{titleAction}</div>}
        </div>
      )}
      <div className={clsx(styles.content, readonly && styles.readonly)}>{children}</div>
    </div>
  );
};

export default MainSection;
