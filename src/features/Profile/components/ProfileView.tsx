import { forwardRef } from 'react';

import clsx from 'clsx';

import type { ProfileViewProps, ProfileSectionType } from '@/types/user';

import styles from './ProfileView.module.scss';
import LocationSection from './sections/LocationSection';
import PortfolioSection from './sections/PortfolioSection';
import PositionSection from './sections/PositionSection';
import ProjectSection from './sections/ProjectSection';
import StudySection from './sections/StudySection';
import TechStackSection from './sections/TechStackSection';
import TimeSection from './sections/TimeSection';
import TraitsSection from './sections/TraitsSection';
import UserInfoSection from './sections/UserInfoSection';

interface ExtendedProfileViewProps extends ProfileViewProps {
  onChatRequest?: () => void;
  getChatButtonText?: () => string;
}

const ProfileView = forwardRef<HTMLDivElement, ExtendedProfileViewProps>(
  (
    {
      user,
      isEditable = false,
      onEdit,
      isLoading = false,
      className,
      onChatRequest,
      getChatButtonText,
    },
    ref
  ) => {
    const handleSectionEdit = (sectionType: ProfileSectionType) => {
      if (isEditable && onEdit) {
        onEdit(sectionType);
      }
    };

    // 로딩 중일 때
    if (isLoading) {
      return (
        <div ref={ref} className={clsx(styles.profileView, styles.loading, className)}>
          <div className={styles.loadingMessage}>프로필을 불러오는 중...</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={clsx(styles.profileView, className)}
        role="main"
        aria-label="사용자 프로필"
      >
        {/* 사용자 기본 정보 섹션 (전체 너비) */}
        <div className={styles.userInfoWrapper}>
          <UserInfoSection
            user={user}
            isEditable={isEditable}
            onEdit={handleSectionEdit}
            onEditPersonalInfo={() => {
              console.log('비밀번호 확인 모달 → 개인정보 수정 페이지');
            }}
            onEditIntroduction={() => {
              console.log('자기소개 수정 모달 열기');
            }}
          />

          {/* 본인 프로필: 공개/비공개 토글, 타인 프로필: 채팅 버튼 */}
          <div className={styles.ToggleSection}>
            <div className={styles.profileToggle}>
              {user.isMine ? (
                // 본인 프로필: 공개/비공개 토글
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>프로필 공개/비공개</span>
                  <div className={clsx(styles.toggle, user.isProfilePublic && styles.on)}>
                    <span className={styles.toggleStatus}>
                      {user.isProfilePublic ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </label>
              ) : (
                // 타인 프로필: 채팅 버튼
                <button
                  type="button"
                  onClick={onChatRequest}
                  disabled={user.dmRequestPending}
                  className={clsx(styles.chatButton, user.dmRequestPending && styles.pending)}
                  aria-label={getChatButtonText?.() || '채팅'}
                >
                  {getChatButtonText?.() || '채팅'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2컬럼 레이아웃 - 피그마 대로(따라오는건 안 예뻐서 뺐슴니닷)*/}
        <div className={styles.twoColumnLayout}>
          {/* 왼쪽 컬럼 (737px) */}
          <div className={styles.leftColumn}>
            <LocationSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />

            <TechStackSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />

            <ProjectSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />

            <StudySection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />
          </div>

          {/* 오른쪽 컬럼 (404px) */}
          <div className={styles.rightColumn}>
            <PositionSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />

            <TraitsSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />

            <TimeSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />

            <PortfolioSection user={user} isEditable={isEditable} onEdit={handleSectionEdit} />
          </div>
        </div>
      </div>
    );
  }
);

ProfileView.displayName = 'ProfileView';
export default ProfileView;
