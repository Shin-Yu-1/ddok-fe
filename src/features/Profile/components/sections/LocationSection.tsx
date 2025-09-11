// 주활동지+지도
// 주활동지+지도

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import ProfileMap from '@/features/map/components/ProfileMap/ProfileMap';
import type { ProfileSectionProps } from '@/types/user';

import styles from './LocationSection.module.scss';

interface LocationSectionProps extends ProfileSectionProps {
  className?: string;
}

const LocationSection = forwardRef<HTMLElement, LocationSectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
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
          {/* 주활동지 정보 텍스트 */}
          {user.location && (
            <div>
              <p className={styles.locationText}>
                {user.location.address
                  ? user.location.address.split(' ').slice(0, 3).join(' ')
                  : '위치 정보 없음'}
              </p>
            </div>
          )}

          {/* 지도 영역 */}
          <ProfileMap playerId={user.userId} location={user.location} />
        </div>
      </section>
    );
  }
);

LocationSection.displayName = 'LocationSection';
export default LocationSection;
