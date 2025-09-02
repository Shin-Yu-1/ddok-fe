import { useState, useEffect } from 'react';

import ProfileView from '@/features/Profile/components/ProfileView';
import { mockMyProfile } from '@/mocks/mockProfile';
import type { ProfileSectionType, CompleteProfileInfo } from '@/types/user';

import styles from './MyProfilePage.module.scss';

const MyProfilePage = () => {
  const [profileData, setProfileData] = useState<CompleteProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 프로필 데이터 로딩 시뮬레이션
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);

      // API 호출 시뮬레이션 (1초 로딩)
      setTimeout(() => {
        setProfileData(mockMyProfile);
        setIsLoading(false);
      }, 1000);
    };

    loadProfile();
  }, []);

  const handleEdit = (sectionType: ProfileSectionType) => {
    console.log(`편집 요청: ${sectionType} 섹션`);

    // TODO: 실제 편집 모달/페이지 열기 구현
    switch (sectionType) {
      case 'userInfo':
        console.log('사용자 기본 정보 편집 모달 열기');
        // 만들 예정(오늘.,.) openUserInfoModal();
        break;
      case 'location':
        console.log('위치 정보 편집 모달 열기');
        break;
      case 'position':
        console.log('포지션 정보 편집 모달 열기');
        break;
      case 'traits':
        console.log('성향 정보 편집 모달 열기');
        break;
      case 'time':
        console.log('활동 시간 편집 모달 열기');
        break;
      case 'portfolio':
        console.log('포트폴리오 편집 모달 열기');
        break;
      case 'techStack':
        console.log('기술 스택 편집 모달 열기');
        break;
      case 'projects':
        console.log('프로젝트 이력 편집 모달 열기');
        break;
      case 'studies':
        console.log('스터디 이력 편집 모달 열기');
        break;
      default:
        console.log('알 수 없는 섹션:', sectionType);
    }
  };

  return (
    <main className={styles.myProfilePage}>
      <div className={styles.content}>
        {profileData ? (
          <ProfileView
            user={profileData}
            isEditable={true}
            onEdit={handleEdit}
            isLoading={isLoading}
            className={styles.profileView}
          />
        ) : (
          <div className={styles.noData}>
            <p>프로필 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyProfilePage;
