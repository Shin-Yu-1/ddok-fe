import { useParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';
import { DetailRecruitmentTable } from '@/components/RecruitmentTable';
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
import { useProjectDetail } from '@/hooks/post/useProjectDetail';

import styles from './DetailProjectPage.module.scss';

const DetailProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectIdNum = id ? parseInt(id, 10) : 0;

  console.log('🔄 DetailProjectPage 렌더링 중...');
  console.log('📋 URL params:', { id, projectIdNum });

  const {
    projectData,
    isLoading,
    error,
    handleEditProject,
    handleCancelApplication,
    handleApplyPosition,
  } = useProjectDetail({ projectId: projectIdNum });

  console.log('📋 DetailProjectPage 데이터 상태:', {
    projectIdNum,
    isLoading,
    hasError: !!error,
    hasProjectData: !!projectData,
    error: error,
  });

  // 프로젝트 ID가 유효하지 않은 경우
  if (!id || projectIdNum <= 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div>잘못된 프로젝트 ID입니다.</div>
          <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            URL 파라미터: {id}
          </div>
        </div>
      </div>
    );
  }

  // 현재 사용자가 확정된 포지션 찾기
  const getConfirmedPosition = () => {
    if (!projectData) return undefined;

    // 리더인 경우
    if (projectData.leader.isMine) {
      return projectData.leader.decidedPosition;
    }

    // 참여자인 경우
    const myParticipation = projectData.participants.find(p => p.isMine);
    return myParticipation?.decidedPosition;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error || !projectData) {
    console.log('DetailProjectPage - error:', error);
    console.log('DetailProjectPage - projectData:', projectData);

    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div>프로젝트를 불러올 수 없습니다.</div>
          {error && (
            <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
              에러 정보: {error instanceof Error ? error.message : String(error)}
            </div>
          )}
          <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            Project ID: {projectIdNum}
          </div>
        </div>
      </div>
    );
  }

  const handlePositionAction = (position: string) => {
    const positionData = projectData.positions.find(p => p.position === position);

    if (positionData?.isApplied) {
      // 지원 취소
      handleCancelApplication();
    } else {
      // 지원하기
      handleApplyPosition(position);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.bannerImage}>
          <BannerImageSection bannerImage={projectData.bannerImageUrl} readonly={true} />
        </div>

        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              {projectData.isMine && projectData.teamStatus !== 'CLOSED' && (
                <Button variant="secondary" radius="xsm" onClick={handleEditProject}>
                  프로젝트 수정하기
                </Button>
              )}
            </div>

            <div className={styles.nameSection}>
              <SideSection title={projectData.title} readonly />
            </div>

            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'모집 포지션'}>
                  <DetailRecruitmentTable
                    positions={projectData.positions}
                    onApply={handlePositionAction}
                    confirmedPosition={getConfirmedPosition()}
                  />
                </MainSection>

                <MainSection title={'이런 분을 찾습니다!'}>
                  <PostPersonalityDisplay selectedPersonality={projectData.traits} />
                </MainSection>

                <MainSection title={'프로젝트 상세'}>
                  <MarkdownEditor value={projectData.detail} mode="viewer" height={900} />
                </MainSection>

                {/* 팀 멤버 테이블 - 리더와 팀원을 포지션별로 통합 표시 */}
                <MainSection title="팀 멤버">
                  <TeamMemberTable
                    leader={projectData.leader}
                    participants={projectData.participants || []}
                  />
                </MainSection>
              </div>

              <div className={styles.rightSection}>
                <SideSection title={'진행 상태'}>
                  <PostStatusSelector
                    value={projectData.teamStatus}
                    postType="project"
                    editable={false}
                  />
                </SideSection>

                <MainSection title={'모집 인원'} readonly>
                  <PostCapacityDisplay
                    capacity={projectData.capacity}
                    applicantCount={projectData.applicantCount}
                    confirmedCount={projectData.positions.reduce(
                      (sum, pos) => sum + pos.confirmed,
                      0
                    )}
                  />
                </MainSection>

                <MainSection title={'시작 예정일'}>
                  <PostDateDisplay date={projectData.startDate} label="프로젝트 시작 예정일" />
                </MainSection>

                <MainSection title={'예상 기간'}>
                  <PostDurationDisplay
                    months={projectData.expectedMonth}
                    startDate={projectData.startDate}
                  />
                </MainSection>

                <MainSection title={'모임 형태'}>
                  <PostModeDisplay value={projectData.mode as 'online' | 'offline'} />
                </MainSection>

                {projectData.mode === 'offline' && projectData.location?.address && (
                  <MainSection title={'지역'}>
                    <PostLocationDisplay
                      address={projectData.location.address}
                      location={projectData.location}
                      showMap={true}
                      mapHeight={250}
                    />
                  </MainSection>
                )}

                <MainSection title={'희망 나이대'}>
                  <AgeRangeDisplay preferredAges={projectData.preferredAges} />
                </MainSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProjectPage;
