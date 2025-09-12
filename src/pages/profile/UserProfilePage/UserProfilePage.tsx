import { useParams, useNavigate } from 'react-router-dom';

import ProfileView from '@/features/Profile/components/ProfileView';
import { useProfileData, useChatRequest } from '@/features/Profile/hooks';

import styles from './UserProfilePage.module.scss';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profileData, isLoading, error, refetch } = useProfileData(id, false);
  const { handleChatRequest, getChatButtonText } = useChatRequest(profileData, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <main className={styles.userProfilePage}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>오류 발생</h1>
            <p className={styles.errorMessage}>{error}</p>
            <button type="button" onClick={handleBack} className={styles.backButton}>
              돌아가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.userProfilePage}>
      <div className={styles.content}>
        {profileData ? (
          <ProfileView
            user={profileData}
            isEditable={false} // 타인 프로필은 편집 불가
            isLoading={isLoading}
            className={styles.profileView}
            onChatRequest={handleChatRequest}
            getChatButtonText={getChatButtonText}
          />
        ) : isLoading ? (
          <div className={styles.loadingContainer}>
            <p>프로필을 불러오는 중...</p>
          </div>
        ) : (
          <div className={styles.noData}>
            <p>프로필 데이터를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserProfilePage;
