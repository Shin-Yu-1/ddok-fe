import { forwardRef } from 'react';

import clsx from 'clsx';

import type { ProfileViewProps, ProfileSectionType } from '@/types/user';

import { useProfileToggle } from '../hooks/useProfileToggle';

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
  getChatButtonDisabled?: () => boolean;
  onEditPersonalInfo?: () => void;
  onEditIntroduction?: () => void;
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
      getChatButtonDisabled,
      onEditPersonalInfo,
      onEditIntroduction,
    },
    ref
  ) => {
    // 공개/비공개 토글 훅 (항상 호출하되, 본인 프로필이 아니면 비활성화)
    const { isProfilePublic, isToggling, handleTogglePrivacy, toggleError, isError } =
      useProfileToggle({
        user,
        enabled: user.isMine, // 본인 프로필일 때만 활성화
        onSuccess: newPrivacyState => {
          console.log('토글 성공! 새로운 상태:', newPrivacyState ? '공개' : '비공개');
          // TODO: 성공 토스트 표시
        },
        onError: error => {
          console.error('토글 실패:', error);
          // TODO: 에러 토스트 표시
        },
      });

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

    // 비공개 프로필 메시지 컴포넌트
    const PrivateProfileMessage = () => (
      <div className={styles.privateProfileContainer}>
        <div className={styles.privateProfileMessage}>
          <h3>비공개 프로필</h3>
          <p>이 사용자의 상세 정보는 비공개로 설정되어 있습니다.</p>
          <p>기본 정보만 확인할 수 있습니다.</p>
        </div>
      </div>
    );

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
            onEditPersonalInfo={onEditPersonalInfo}
            onEditIntroduction={onEditIntroduction}
          />

          {/* 본인 프로필: 공개/비공개 토글, 타인 프로필: 채팅 버튼 */}
          <div className={styles.ToggleSection}>
            <div className={styles.profileToggle}>
              {user.isMine ? (
                // 본인 프로필: 공개/비공개 토글
                <div className={styles.toggleContainer}>
                  <label className={styles.toggleLabel}>
                    <span className={styles.toggleText}>프로필 공개/비공개</span>
                    <div
                      className={clsx(
                        styles.toggle,
                        isProfilePublic && styles.on,
                        isToggling && styles.loading
                      )}
                      onClick={handleTogglePrivacy}
                    >
                      <span className={styles.toggleStatus}>
                        {isToggling ? '...' : isProfilePublic ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </label>

                  {/* 에러 메시지 표시 */}
                  {isError && toggleError && (
                    <div className={styles.errorMessage}>
                      토글 변경에 실패했습니다. 다시 시도해주세요.
                    </div>
                  )}
                </div>
              ) : (
                // 타인 프로필: 채팅 버튼
                <button
                  type="button"
                  onClick={onChatRequest}
                  disabled={getChatButtonDisabled?.() ?? user.dmRequestPending}
                  className={clsx(
                    styles.chatButton,
                    (getChatButtonDisabled?.() ?? user.dmRequestPending) && styles.pending
                  )}
                  aria-label={getChatButtonText?.() || '채팅하기'}
                >
                  {getChatButtonText?.() || '채팅하기'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 상세 정보 섹션 - 공개 상태에 따라 조건부 렌더링 */}
        {isProfilePublic ? (
          // 공개 프로필: 모든 정보 표시
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
        ) : (
          // 비공개 프로필: 비공개 메시지만 표시
          <PrivateProfileMessage />
        )}
      </div>
    );
  }
);

ProfileView.displayName = 'ProfileView';
export default ProfileView;
