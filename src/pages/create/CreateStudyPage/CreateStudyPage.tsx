import { MagicWandIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';
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
import TextInput from '@/features/post/components/TextInput/TextInput';
import AIWriteModal from '@/features/post/Modal/AIWriteModal/AIWriteModal';
import { useAIWrite } from '@/hooks/post/useAIWrite';
import { useCreateStudyForm } from '@/hooks/post/useCreateStudyForm';

import styles from './CreateStudyPage.module.scss';

const CreateStudyPage = () => {
  const {
    formData,
    updateTitle,
    updateMode,
    updateDetail,
    updateStudyType,
    handleSubmit,
    updatePreferredAges,
    updateTraits,
    updateLocation,
    updateExpectedStart,
    updateCapacity,
    updateExpectedMonth,
    updateBannerImage,
    isValid,
    isSubmitting,
  } = useCreateStudyForm();

  // AI 글 작성 모달 관련
  const { isModalOpen, openModal, closeModal, handleContentApply } = useAIWrite({
    onContentApply: updateDetail,
  });

  const handleModeChange = (mode: 'online' | 'offline') => {
    updateMode(mode);
  };

  const handleDetailChange = (value: string) => {
    updateDetail(value);
  };

  const handlePersonalityToggle = (personalityName: string) => {
    const currentTraits = formData.traits;
    const isSelected = currentTraits.includes(personalityName);

    if (isSelected) {
      const newTraits = currentTraits.filter(trait => trait !== personalityName);
      updateTraits(newTraits);
    } else {
      const newTraits = [...currentTraits, personalityName];
      updateTraits(newTraits);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.bannerImage}>
          <BannerImageSection
            bannerImage={formData.bannerImage}
            onImageChange={updateBannerImage}
          />
        </div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              <Button
                variant="secondary"
                radius="xsm"
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? '등록 중...' : '모집 공고 등록하기'}
              </Button>
            </div>
            <div className={styles.nameSection}>
              <MainSection title={'스터디 이름'}>
                <TextInput
                  value={formData.title}
                  onChange={updateTitle}
                  placeholder="스터디 제목을 입력해주세요"
                  minLength={2}
                  maxLength={30}
                  showCounter={true}
                />
              </MainSection>
            </div>
            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'이런 분을 찾습니다!'}>
                  <PostPersonalitySelector
                    selectedPersonality={formData.traits}
                    onPersonalityToggle={handlePersonalityToggle}
                    maxSelection={5}
                  />
                </MainSection>
                <MainSection title={'스터디 유형'}>
                  <PostStudyTypeSelector
                    selectedStudyType={formData.studyType}
                    onStudyTypeSelect={updateStudyType}
                  />
                </MainSection>
                <MainSection
                  title={'모집 공고 상세'}
                  titleAction={
                    <>
                      <button className={styles.useAIWrite} onClick={openModal}>
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
              </div>
              <div className={styles.rightSection}>
                <SideSection readonly={true} title={'진행 상태'}>
                  <PostStatusSelector value="RECRUITING" postType="study" editable={false} />
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
                    min={getTomorrowDate()}
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

      {/* AI 글 작성 모달 */}
      <AIWriteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApplyContent={handleContentApply}
        formData={formData}
        postType="study"
      />
    </>
  );
};

export default CreateStudyPage;
