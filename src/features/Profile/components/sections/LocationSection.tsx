// 주활동지+지도
// 주활동지+지도

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import styles from './LocationSection.module.scss';

interface LocationSectionProps extends ProfileSectionProps {
  className?: string;
}

const LocationSection = forwardRef<HTMLElement, LocationSectionProps>(
  ({ isEditable = false, onEdit, className }, ref) => {
    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('location');
      }
    };

    return (
      <section
        ref={ref}
        className={clsx(styles.locationSection, className)}
        aria-labelledby="location-title"
      >
        <div className={styles.header}>
          <h2 id="location-title" className={styles.title}>
            주활동지
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="위치 정보 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div className={styles.content}>
          {/* 지도 영역 (추후 실제 지도 컴포넌트로 교체 예정) */}
          <div className={styles.mapContainer}>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapIcon}>🗺️</div>
              <p className={styles.mapText}>지도 영역</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

LocationSection.displayName = 'LocationSection';
export default LocationSection;
