// 프로필이미지+닉네임+뱃지+온도
// 프로필이미지+닉네임+뱃지+온도

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import Thermometer from '@/components/Thermometer/Thermometer';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Badge';
import type { ProfileSectionProps } from '@/types/user';

import styles from './UserInfoSection.module.scss';

interface UserInfoSectionProps extends ProfileSectionProps {
  className?: string;
  onEditPersonalInfo?: () => void; // 개인정보 수정 핸들러
  onEditIntroduction?: () => void; // 자기소개 수정 핸들러
}

const UserInfoSection = forwardRef<HTMLElement, UserInfoSectionProps>(
  ({ user, isEditable = false, onEditPersonalInfo, onEditIntroduction, className }, ref) => {
    const handlePersonalInfoEdit = () => {
      if (isEditable && onEditPersonalInfo) {
        onEditPersonalInfo();
      }
    };

    const handleIntroductionEdit = () => {
      if (isEditable && onEditIntroduction) {
        onEditIntroduction();
      }
    };

    return (
      <section
        ref={ref}
        className={clsx(styles.userInfoSection, className)}
        aria-labelledby="user-info-title"
      >
        <div className={styles.container}>
          <div className={styles.leftContent}>
            {/* 프로필 이미지 */}
            <div className={styles.profileImageContainer}>
              <img
                src={user.profileImage}
                alt={`${user.nickname}의 프로필`}
                className={styles.profileImage}
              />
            </div>

            {/* 기본 정보 */}
            <div className={styles.userBasicInfo}>
              <div className={styles.userNameRow}>
                <h1 id="user-info-title" className={styles.nickname}>
                  {user.nickname}
                </h1>
                <span className={styles.ageGroup}>{user.ageGroup}</span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={handlePersonalInfoEdit}
                    className={styles.personalInfoEditButton}
                    aria-label="개인 정보 수정"
                  >
                    개인 정보 수정
                  </button>
                )}
              </div>

              {user.introduction && (
                <div className={styles.introductionRow}>
                  <p className={styles.introduction}>{user.introduction}</p>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={handleIntroductionEdit}
                      className={styles.introductionEditButton}
                      aria-label="자기소개 수정"
                    >
                      <PencilSimpleIcon size={21} weight="regular" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightContent}>
            {/* 뱃지 */}
            <div className={styles.badgeContainer}>
              {user.badges.map((badge, index) => (
                <div
                  key={index}
                  className={styles.badgeWrapper}
                  data-tooltip={`${badge.type === 'complete' ? '완주' : badge.type === 'leader_complete' ? '리더 완주' : '로그인'} 뱃지 - ${badge.tier} 등급`}
                >
                  <Badge
                    mainBadge={{
                      type: badge.type as BadgeType,
                      tier: badge.tier as BadgeTier,
                    }}
                    widthSize={28}
                    heightSize={51}
                    className={styles.mainBadge}
                  />
                </div>
              ))}

              {user.abandonBadge.isGranted && (
                <div
                  className={styles.badgeWrapper}
                  data-tooltip={`포기 뱃지 - ${user.abandonBadge.count}개`}
                >
                  <Badge
                    mainBadge={{ type: BadgeType.ABANDON }}
                    abandonBadge={user.abandonBadge}
                    widthSize={28}
                    heightSize={51}
                    className={styles.abandonBadge}
                  />
                </div>
              )}
            </div>

            {/* 온도 */}
            <div className={styles.temperatureContainer}>
              <div className={styles.temperatureDisplay}>
                <Thermometer
                  temperature={user.temperature}
                  width={24}
                  height={24}
                  animated={true}
                />
                <span className={styles.temperature}>{user.temperature}°C</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

UserInfoSection.displayName = 'UserInfoSection';
export default UserInfoSection;
