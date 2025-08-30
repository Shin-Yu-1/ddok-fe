import { MagicWand } from '@phosphor-icons/react';
import { RadioGroup } from 'radix-ui';

import AgeRangeSelector from '@/components/AgeRangeSelector/AgeRangeSelector';
import Button from '@/components/Button/Button';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';
import { CreateRecruitmentTable } from '@/components/RecruitmentTable';
import { useCreateProjectForm } from '@/hooks/useCreateProjectForm';

import styles from './CreateProjectPage.module.scss';

const CreateProjectPage = () => {
  const {
    formData,
    updateTitle,
    updateMode,
    updateDetail,
    updatePositions,
    updateLeaderPosition,
    handleSubmit,
    updatePreferredAges,
    isValid,
  } = useCreateProjectForm();

  const handleModeChange = (value: string) => {
    updateMode(value as 'ONLINE' | 'OFFLINE');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTitle(e.target.value);
  };

  const handleDetailChange = (value: string) => {
    updateDetail(value);
  };

  // 포지션 관련 핸들러들
  const handleAddPosition = (position: string) => {
    const newPositions = [...formData.positions, position];
    updatePositions(newPositions);
  };

  const handleRemovePosition = (position: string) => {
    const newPositions = formData.positions.filter(p => p !== position);
    updatePositions(newPositions);

    // 삭제된 포지션이 리더 포지션이었다면 리더 포지션도 초기화
    if (formData.leaderPosition === position) {
      updateLeaderPosition('');
    }
  };

  const handleLeaderPositionChange = (position: string) => {
    // 이미 선택된 포지션이면 선택 취소
    if (formData.leaderPosition === position) {
      updateLeaderPosition('');
    } else {
      updateLeaderPosition(position);
    }
  };

  // 모집 공고 등록하기 버튼 클릭 시
  const handleSubmitClick = () => {
    console.log('=== 현재 폼 데이터 ===');
    console.log(JSON.stringify(formData, null, 2));

    // 실제 API로 전송될 데이터 구조
    console.log('=== 실제 API로 전송될 데이터 ===');

    // 1. 배너 이미지 정보
    if (formData.bannerImage) {
      console.log('배너 이미지:', {
        name: formData.bannerImage.name,
        size: formData.bannerImage.size,
        type: formData.bannerImage.type,
      });
    } else {
      console.log('배너 이미지: 없음 (기본 이미지 사용)');
    }

    // 2. JSON 요청 데이터 (FormData의 'request' 부분)
    const requestData = {
      title: formData.title,
      expectedStart: formData.expectedStart,
      expectedMonth: formData.expectedMonth,
      mode: formData.mode,
      location: formData.mode === 'OFFLINE' ? formData.location : null,
      preferredAges: formData.preferredAges,
      capacity: formData.capacity,
      traits: formData.traits,
      positions: formData.positions,
      leaderPosition: formData.leaderPosition,
      detail: formData.detail,
    };

    console.log('JSON 요청 데이터:');
    console.log(JSON.stringify(requestData, null, 2));

    // 3. FormData 시뮬레이션
    console.log('=== FormData 시뮬레이션 ===');
    console.log('FormData 구조:');
    if (formData.bannerImage) {
      console.log('- bannerImage: [File Object]', formData.bannerImage.name);
    }
    console.log('- request: [Blob]', JSON.stringify(requestData));

    // 4. 실제 전송될 HTTP 요청 정보
    console.log('=== HTTP 요청 정보 ===');
    console.log('Method: POST');
    console.log('URL: /api/projects');
    console.log('Content-Type: multipart/form-data');
    console.log('Headers: { Authorization: Bearer [token] }');

    // 유효성 검사 실패 시 실제 API 호출 하지 않음
    if (!isValid) {
      console.warn('⚠️ 유효성 검사 실패로 인해 실제 API 호출을 건너뜁니다.');
      return;
    }

    console.log('✅ 유효성 검사 통과 - 실제 API를 호출한다면 여기서 호출됩니다.');

    // 실제 API 호출은 주석 처리 (개발 중에는 실행하지 않음)
    // handleSubmit();

    // 실제 API 호출하고 싶으시면 위 주석을 해제하고 아래 주석을 추가하세요:
    handleSubmit();
  };

  return (
    <>
      <h1 className={styles.title}>CreateProjectPage</h1>
      <div className={styles.container}>
        <div className={styles.bannerImage}>배너 이미지 섹션</div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              <Button variant="secondary" radius="xsm" onClick={handleSubmitClick}>
                모집 공고 등록하기
              </Button>
            </div>
            <div className={styles.nameSection}>
              <MainSection title={'프로젝트 제목'}>
                <input
                  type="text"
                  placeholder="프로젝트 제목을 입력해주세요"
                  className={styles.titleInput}
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </MainSection>
            </div>
            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'모집 현황'}>
                  <CreateRecruitmentTable
                    positions={formData.positions}
                    leaderPosition={formData.leaderPosition}
                    onAddPosition={handleAddPosition}
                    onRemovePosition={handleRemovePosition}
                    onLeaderPositionChange={handleLeaderPositionChange}
                  />
                </MainSection>
                <MainSection title={'이런 분을 찾습니다!'}>
                  성향 입력 컴포넌트 들어갈 예정
                </MainSection>
                <MainSection
                  title={'모집 공고 상세'}
                  titleAction={
                    <>
                      <button className={styles.useAIWrite}>
                        <MagicWand
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
                  진행 상태 버튼 들어갈 예정
                </SideSection>
                <SideSection title={'모집 인원'}>모집 인원 드롭 추가 예정</SideSection>
                <SideSection title={'시작 예정일'}>날짜 선택 섹션 추가 예정</SideSection>
                <SideSection title={'예상 기간'}>날짜 선택 섹션 추가 예정</SideSection>
                <MainSection title={'모임 형태'}>
                  <RadioGroup.Root
                    className={styles.radioRoot}
                    value={formData.mode}
                    onValueChange={handleModeChange}
                  >
                    <div className={styles.radioItemGroup}>
                      <RadioGroup.Item className={styles.radioItem} value="ONLINE" id="r1">
                        <RadioGroup.Indicator className={styles.radioIndicator} />
                      </RadioGroup.Item>
                      <label className={styles.radioLabel} htmlFor="r1">
                        온라인
                      </label>
                    </div>
                    <div className={styles.radioItemGroup}>
                      <RadioGroup.Item className={styles.radioItem} value="OFFLINE" id="r2">
                        <RadioGroup.Indicator className={styles.radioIndicator} />
                      </RadioGroup.Item>
                      <label className={styles.radioLabel} htmlFor="r2">
                        오프라인
                      </label>
                    </div>
                  </RadioGroup.Root>
                </MainSection>
                {/* 조건부 렌더링: 오프라인일 때만 지역 섹션 표시 */}
                {formData.mode === 'OFFLINE' && (
                  <SideSection title={'지역'}>지역 선택 기능 추가 예정</SideSection>
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

export default CreateProjectPage;
