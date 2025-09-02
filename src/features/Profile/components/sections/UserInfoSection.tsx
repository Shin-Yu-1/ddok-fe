// 프로필이미지+닉네임+뱃지+온도
// 프로필이미지+닉네임+뱃지+온도

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import BurningIcon from '@/assets/icons/temperature-burning-icon.svg';
import ColdIcon from '@/assets/icons/temperature-cold-icon.svg';
import CoolIcon from '@/assets/icons/temperature-cool-icon.svg';
import FreezingIcon from '@/assets/icons/temperature-freezing-icon.svg';
import HotIcon from '@/assets/icons/temperature-hot-icon.svg';
import WarmIcon from '@/assets/icons/temperature-warm-icon.svg';
import type { ProfileSectionProps, TemperatureLevel } from '@/types/user';

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

    // 온도 레벨에 맞는 아이콘 반환
    const getTemperatureIcon = (level: TemperatureLevel) => {
      switch (level) {
        case 'freezing':
          return FreezingIcon;
        case 'cold':
          return ColdIcon;
        case 'cool':
          return CoolIcon;
        case 'warm':
          return WarmIcon;
        case 'hot':
          return HotIcon;
        case 'burning':
          return BurningIcon;
        default:
          return WarmIcon; // 기본값
      }
    };

    const TemperatureIcon = getTemperatureIcon(user.temperatureLevel);

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
            {/* 뱃지 컨테이너 - 일단 임시로 이모티콘으로 대체*/}
            <div className={styles.badgeContainer}>
              {user.badges.map((badge, index) => (
                <div
                  key={index}
                  className={clsx(styles.mainBadge)}
                  title={`${badge.type} ${badge.tier}`}
                >
                  🏆
                </div>
              ))}

              {user.abandonBadge.isGranted && (
                <div
                  className={styles.abandonBadge}
                  title={`포기 뱃지 ${user.abandonBadge.count}개`}
                >
                  ⚠️
                </div>
              )}
            </div>

            {/* 온도 */}
            <div className={styles.temperatureContainer}>
              <div className={styles.temperatureDisplay}>
                <img
                  src={TemperatureIcon}
                  alt={`온도 ${user.temperatureLevel}`}
                  className={styles.temperatureIcon}
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
