import { MagicWand } from '@phosphor-icons/react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';

import styles from './CreateProjectPage.module.scss';

const CreateProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleClick = () => {
    // TODO: 추후 API 연결 필요
    navigate(`/detail/project/${id}`);
  };
  return (
    <>
      <h1 className={styles.title}>CreateProjectPage</h1>
      <div className={styles.container}>
        <div className={styles.bannerImage}>배너 이미지 섹션</div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              <Button variant="secondary" radius="xsm" onClick={handleClick}>
                모집 공고 등록하기
              </Button>
            </div>
            <div className={styles.nameSection}>
              <MainSection title={'프로젝트 제목'}>추후 input 바 들어갈 예정</MainSection>
            </div>
            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'모집 현황'}>모집 현황 테이블 들어갈 예정</MainSection>
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
                        ></MagicWand>
                      </button>
                    </>
                  }
                >
                  마크다운 작성 양식 들어갈 예정
                </MainSection>
              </div>
              <div className={styles.rightSections}>
                <SideSection readonly={true} title={'진행 상태'}>
                  진행 상태 버튼 들어갈 예정
                </SideSection>
                <SideSection title={'모집 인원'}>모집 인원 드롭 추가 예정</SideSection>
                <SideSection title={'시작 예정일'}>날짜 선택 섹션 추가 예정</SideSection>
                <SideSection title={'예상 기간'}>날짜 선택 섹션 추가 예정</SideSection>
                <MainSection title={'모임 형태'}>모임 형태 선택 섹션</MainSection>
                <SideSection title={'지역'}>지역 선택 기능 추가 예정</SideSection>
                <MainSection title={'희망 나이대'}>희망 나이대 선택 섹션</MainSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProjectPage;
