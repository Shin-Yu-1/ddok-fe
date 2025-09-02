import { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import ProfileView from '@/features/Profile/components/ProfileView';
import { mockOtherProfile } from '@/mocks/mockProfile';
import type { CompleteProfileInfo } from '@/types/user';

import styles from './UserProfilePage.module.scss';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<CompleteProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 데이터 로딩 시뮬레이션
  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setError('사용자 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // API 호출 시뮬레이션 (1.2초 로딩)
        setTimeout(() => {
          // 나중엔 id를 사용해서 API 호출: `/api/profile/${id}`
          if (id === '1') {
            setProfileData(mockOtherProfile);
          } else {
            // 다른 사용자 ID의 경우 목 데이터 변형
            setProfileData({
              ...mockOtherProfile,
              userId: parseInt(id, 10),
              nickname: `사용자${id}`,
            });
          }
          setIsLoading(false);
        }, 1200);
      } catch {
        setError('프로필을 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const handleChatRequest = () => {
    if (!profileData) return;

    if (profileData.chatRoomId) {
      // 이미 채팅방이 있는 경우 - 채팅방으로 이동
      console.log('기존 채팅방으로 이동:', profileData.chatRoomId);
    } else if (profileData.dmRequestPending) {
      // 채팅 요청 대기 중
      console.log('채팅 요청 대기 중...');
    } else {
      // 새로운 채팅 요청 보내기
      console.log('채팅 요청 보내기:', profileData.userId);
      // TODO: 실제 채팅 요청 API 호출
    }
  };

  const getChatButtonText = () => {
    if (!profileData) return '채팅하기';

    if (profileData.chatRoomId) {
      return '채팅하기';
    } else if (profileData.dmRequestPending) {
      return '요청 대기 중...';
    } else {
      return '채팅 요청';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 에러 상태
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
