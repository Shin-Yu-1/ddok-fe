import { MagicWandIcon } from '@phosphor-icons/react';
import { useParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';
import TeamMemberTable from '@/components/TeamMemberTable/TeamMemberTable';
import AgeRangeSelector from '@/features/post/components/AgeRangeSelector/AgeRangeSelector';
import BannerImageSection from '@/features/post/components/BannerImageSection/BannerImageSection';
import PostCapacitySelector from '@/features/post/components/PostCapacitySelector/PostCapacitySelector';
import PostDateSelector from '@/features/post/components/PostDateSelector/PostDateSelector';
import PostDurationSlider from '@/features/post/components/PostDurationSlider/PostDurationSlider';
import PostLocationSelector from '@/features/post/components/PostLocationSelector/PostLocationSelector';
import PostModeSelector from '@/features/post/components/PostModeSelector/PostModeSelector';
import PostPersonalitySelector from '@/features/post/components/PostPersonalitySelector/PostPersonalitySelector';
import PostStatusSelector from '@/features/post/components/PostStatusSelector/PostStatusSelector';
import PostStudyTypeSelector from '@/features/post/components/PostStudyTypeSelector/PostStudyTypeSelector';
import { useEditStudyForm } from '@/hooks/post/useEditStudyForm';

import styles from './EditStudyPage.module.scss';

const EditStudyPage = () => {
  const { id } = useParams<{ id: string }>();
  const studyId = id ? parseInt(id, 10) : 0;

  const {
    formData,
    isLoadingEdit,
    updateTitle,
    updateMode,
    updateDetail,
    updateStudyType,
    editData,
    handleSubmit,
    updatePreferredAges,
    updateTraits,
    updateLocation,
    updateExpectedStart,
    updateCapacity,
    updateExpectedMonth,
    updateBannerImage,
    updateTeamStatus,
    isValid,
    isSubmitting,
  } = useEditStudyForm({ studyId });

  // 스터디 ID가 유효하지 않은 경우
  if (!id || studyId <= 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>잘못된 스터디 ID입니다.</div>
      </div>
    );
  }

  // 로딩 중인 경우
  if (isLoadingEdit || !formData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>수정 정보를 불러오는 중...</div>
      </div>
    );
  }

  const handleModeChange = (mode: 'online' | 'offline') => {
    updateMode(mode);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTitle(e.target.value);
  };

  const handleDetailChange = (value: string) => {
    updateDetail(value);
  };

  const handlePersonalityToggle = (personalityName: string) => {
    const currentTraits = formData.traits;
    const isSelected = currentTraits.includes(personalityName);

    if (isSelected) {
      // 제거
      const newTraits = currentTraits.filter(trait => trait !== personalityName);
      updateTraits(newTraits);
    } else {
      // 추가
      const newTraits = [...currentTraits, personalityName];
      updateTraits(newTraits);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // 스터디 수정 저장 버튼 클릭 시
  const handleSubmitClick = () => {
    console.log('=== 스터디 수정 폼 데이터 ===');
    console.log(JSON.stringify(formData, null, 2));

    if (!isValid) {
      console.warn('⚠️ 유효성 검사 실패로 인해 실제 API 호출을 건너뜁니다.');
      return;
    }

    console.log('✅ 유효성 검사 통과 - 스터디 수정 API 호출');
    handleSubmit();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.bannerImage}>
          <BannerImageSection
            bannerImage={formData.bannerImage}
            onImageChange={updateBannerImage}
            initialImageUrl={formData.bannerImageUrl}
          />
        </div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              <Button
                variant="secondary"
                radius="xsm"
                onClick={handleSubmitClick}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? '저장 중...' : '수정 사항 저장하기'}
              </Button>
            </div>
            <div className={styles.nameSection}>
              <MainSection title={'스터디 이름'}>
                <input
                  type="text"
                  placeholder="스터디 이름을 입력해주세요"
                  className={styles.titleInput}
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </MainSection>
            </div>
            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'스터디 유형'}>
                  <PostStudyTypeSelector
                    selectedStudyType={formData.studyType}
                    onStudyTypeSelect={updateStudyType}
                  />
                </MainSection>
                <MainSection title={'이런 분을 찾습니다!'}>
                  <PostPersonalitySelector
                    selectedPersonality={formData.traits}
                    onPersonalityToggle={handlePersonalityToggle}
                    maxSelection={5}
                  />
                </MainSection>
                <MainSection
                  title={'모집 공고 상세'}
                  titleAction={
                    <>
                      <button className={styles.useAIWrite}>
                        <MagicWandIcon
                          size={25}
                          weight="light"
                          color="var(--white-3)"
                          className="aiIcon"
                        />
                      </button>
                    </>
                  }
                >
                  <MarkdownEditor
                    value={formData.detail}
                    onChange={handleDetailChange}
                    mode="editor"
                  />
                </MainSection>
                <MainSection title="스터디 멤버">
                  {editData?.data && (
                    <TeamMemberTable
                      leader={editData.data.leader}
                      participants={editData.data.participants || []}
                      isStudyMode={true}
                    />
                  )}
                </MainSection>
              </div>
              <div className={styles.rightSection}>
                <SideSection title={'진행 상태'}>
                  <PostStatusSelector
                    value={formData.teamStatus}
                    onChange={updateTeamStatus}
                    postType="study"
                    editable={formData.teamStatus !== 'CLOSED'}
                  />
                </SideSection>
                <MainSection title={'모집 인원'}>
                  <PostCapacitySelector value={formData.capacity} onChange={updateCapacity} />
                </MainSection>
                <MainSection title={'시작 예정일'}>
                  <PostDateSelector
                    value={formData.expectedStart}
                    onChange={updateExpectedStart}
                    label="스터디를 언제 시작하실 예정인가요?"
                    placeholder="날짜를 선택해주세요"
                    min={getTomorrowDate()} // 내일부터 선택 가능
                  />
                </MainSection>
                <MainSection title={'예상 기간'}>
                  <PostDurationSlider
                    value={formData.expectedMonth}
                    onChange={updateExpectedMonth}
                    startDate={formData.expectedStart}
                  />
                </MainSection>
                <MainSection title={'모임 형태'}>
                  <PostModeSelector value={formData.mode} onChange={handleModeChange} />
                </MainSection>
                {/* 조건부 렌더링: 오프라인일 때만 지역 섹션 표시 */}
                {formData.mode === 'offline' && (
                  <MainSection title={'지역'}>
                    <PostLocationSelector
                      location={formData.location}
                      onLocationChange={updateLocation}
                      type="study"
                    />
                  </MainSection>
                )}
                <MainSection title={'희망 나이대'}>
                  <AgeRangeSelector value={formData.preferredAges} onChange={updatePreferredAges} />
                </MainSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditStudyPage;
