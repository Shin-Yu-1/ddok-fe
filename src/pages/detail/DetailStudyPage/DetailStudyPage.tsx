import { useParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';
import TeamMemberTable from '@/components/TeamMemberTable/TeamMemberTable';
import AgeRangeDisplay from '@/features/post/components/AgeRangeDisplay/AgeRangeDisplay';
import BannerImageSection from '@/features/post/components/BannerImageSection/BannerImageSection';
import PostCapacityDisplay from '@/features/post/components/PostCapacityDisplay/PostCapacityDisplay';
import PostDateDisplay from '@/features/post/components/PostDateDisplay/PostDateDisplay';
import PostDurationDisplay from '@/features/post/components/PostDurationDisplay/PostDurationDisplay';
import PostLocationDisplay from '@/features/post/components/PostLocationDisplay/PostLocationDisplay';
import PostModeDisplay from '@/features/post/components/PostModeDisplay/PostModeDisplay';
import PostPersonalityDisplay from '@/features/post/components/PostPersonalityDisplay/PostPersonalityDisplay';
import PostStatusSelector from '@/features/post/components/PostStatusSelector/PostStatusSelector';
import { StudyRecruitmentTable } from '@/features/post/components/StudyRecruitmentTable';
import StudyTypeDisplay from '@/features/post/components/StudyTypeDisplay/StudyTypeDisplay';
import { useStudyDetail } from '@/hooks/post/useStudyDetail';

import styles from './DetailStudyPage.module.scss';

const DetailStudyPage = () => {
  const { id } = useParams<{ id: string }>();
  const studyIdNum = id ? parseInt(id, 10) : 0;

  console.log('🔄 DetailStudyPage 렌더링 중...');
  console.log('📋 URL params:', { id, studyIdNum });

  const {
    studyData,
    isLoading,
    error,
    handleEditStudy,
    handleTeamManagement,
    handleApplyStudy,
    handleCancelApplication,
  } = useStudyDetail({ studyId: studyIdNum });

  console.log('📋 DetailStudyPage 데이터 상태:', {
    studyIdNum,
    isLoading,
    hasError: !!error,
    hasStudyData: !!studyData,
    error: error,
  });

  // 스터디 ID가 유효하지 않은 경우
  if (!id || studyIdNum <= 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div>잘못된 스터디 ID입니다.</div>
          <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            URL 파라미터: {id}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error || !studyData) {
    console.log('DetailStudyPage - error:', error);
    console.log('DetailStudyPage - studyData:', studyData);

    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div>스터디를 불러올 수 없습니다.</div>
          {error && (
            <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
              에러 정보: {error instanceof Error ? error.message : String(error)}
            </div>
          )}
          <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            Study ID: {studyIdNum}
          </div>
        </div>
      </div>
    );
  }

  // 스터디 참여 액션 처리
  const handleStudyAction = () => {
    if (studyData.isApplied) {
      handleCancelApplication();
    } else {
      handleApplyStudy();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.bannerImage}>
          <BannerImageSection bannerImage={studyData.bannerImageUrl} readonly={true} />
        </div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              {/* 모집글 작성자인 경우 - 스터디 수정하기 버튼 */}
              {studyData.isMine && studyData.teamStatus !== 'CLOSED' && (
                <Button variant="secondary" radius="xsm" onClick={handleEditStudy}>
                  스터디 수정하기
                </Button>
              )}

              {/* 팀 멤버인 경우 - 팀 관리 페이지로 이동하기 버튼 */}
              {studyData.isTeamMember && (
                <Button variant="primary" radius="xsm" onClick={handleTeamManagement}>
                  팀 관리 페이지로 이동하기
                </Button>
              )}
            </div>

            <div className={styles.nameSection}>
              <SideSection title={studyData.title} readonly />
            </div>

            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'지원하기'}>
                  <StudyRecruitmentTable
                    appliedCount={studyData.applicantCount}
                    confirmedCount={studyData.participantsCount}
                    capacity={studyData.capacity}
                    isApplied={studyData.isApplied}
                    isApproved={studyData.isApproved}
                    isMine={studyData.isMine}
                    status={studyData.teamStatus}
                    onApply={handleStudyAction}
                  />
                </MainSection>

                <MainSection title={'스터디 유형'}>
                  <StudyTypeDisplay studyType={studyData.studyType} />
                </MainSection>

                <MainSection title={'이런 분을 찾습니다!'}>
                  <PostPersonalityDisplay selectedPersonality={studyData.traits} />
                </MainSection>

                <MainSection title={'스터디 상세'}>
                  <MarkdownEditor value={studyData.detail} mode="viewer" height={900} />
                </MainSection>

                {/* 팀 멤버 테이블 - 스터디장과 스터디원들을 표시 */}
                <MainSection title="스터디 멤버">
                  <TeamMemberTable
                    leader={studyData.leader}
                    participants={studyData.participants || []}
                    isStudyMode={true}
                  />
                </MainSection>
              </div>

              <div className={styles.rightSection}>
                <SideSection title={'진행 상태'}>
                  <PostStatusSelector
                    value={studyData.teamStatus}
                    postType="study"
                    editable={false}
                  />
                </SideSection>

                <MainSection title={'모집 인원'} readonly>
                  <PostCapacityDisplay
                    capacity={studyData.capacity}
                    applicantCount={studyData.applicantCount}
                    confirmedCount={studyData.participantsCount}
                  />
                </MainSection>

                <MainSection title={'시작 예정일'}>
                  <PostDateDisplay date={studyData.startDate} label="스터디 시작 예정일" />
                </MainSection>

                <MainSection title={'예상 기간'}>
                  <PostDurationDisplay
                    months={studyData.expectedMonth}
                    startDate={studyData.startDate}
                  />
                </MainSection>

                <MainSection title={'모임 형태'}>
                  <PostModeDisplay value={studyData.mode as 'online' | 'offline'} />
                </MainSection>

                {studyData.mode === 'offline' && studyData.location && (
                  <MainSection title={'지역'}>
                    <PostLocationDisplay
                      address={studyData.location.address || ''}
                      location={studyData.location}
                      showMap={true}
                      mapHeight={250}
                    />
                  </MainSection>
                )}

                <MainSection title={'희망 나이대'}>
                  <AgeRangeDisplay preferredAges={studyData.preferredAges} />
                </MainSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailStudyPage;
