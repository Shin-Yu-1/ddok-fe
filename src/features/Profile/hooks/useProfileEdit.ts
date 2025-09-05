import type { ProfileSectionType } from '@/types/user';

export const useProfileEdit = () => {
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

  const handleEditPersonalInfo = () => {
    console.log('비밀번호 확인 모달 → 개인정보 수정 페이지');
  };

  const handleEditIntroduction = () => {
    console.log('자기소개 수정 모달 열기');
  };

  return {
    handleEdit,
    handleEditPersonalInfo,
    handleEditIntroduction,
  };
};
