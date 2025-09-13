import { forwardRef, useEffect } from 'react';

import { XIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';

import styles from './BaseModal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;
  hideCloseButton?: boolean;
}

const BaseModal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      subtitle,
      children,
      footer,
      disableBackdropClose = false,
      disableEscapeClose = false,
      hideCloseButton = false,
    },
    ref
  ) => {
    useEffect(() => {
      if (!isOpen || disableEscapeClose) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, disableEscapeClose]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !disableBackdropClose) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div className={styles.overlay} onClick={handleBackdropClick}>
        <div
          ref={ref}
          className={`${styles.modal}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={subtitle ? 'modal-subtitle' : undefined}
        >
          {(title || subtitle || !hideCloseButton) && (
            <div className={styles.header}>
              <div className={styles.headerContent}>
                {title && (
                  <h2 id="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                <Button
                  backgroundColor="var(--white-3)"
                  width={32}
                  height={32}
                  padding={'0px'}
                  onClick={() => onClose()}
                >
                  <XIcon size={24} weight="light" color="var(--black-1)" />
                </Button>
              </div>
              {subtitle && (
                <p id="modal-subtitle" className={styles.subtitle}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className={styles.content}>{children}</div>

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    );
  }
);

export default BaseModal;
