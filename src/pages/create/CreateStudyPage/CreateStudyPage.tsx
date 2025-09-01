import { MagicWand } from '@phosphor-icons/react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import MainSection from '@/components/PostPagesSection/MainSection/MainSection';
import SideSection from '@/components/PostPagesSection/SideSection/SideSection';

import styles from './CreateStudyPage.module.scss';

const CreateStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleClick = () => {
    // TODO: 추후 API 연결 필요
    navigate(`/detail/study/${id}`);
  };
  return (
    <>
      <h1 className={styles.title}>CreateStudyPage</h1>
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
              <MainSection title={'스터디 이름'}></MainSection>
            </div>
            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>
                <MainSection title={'이런 분을 찾습니다!'}></MainSection>
                <MainSection title={'스터디 유형'}></MainSection>
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
                ></MainSection>
              </div>

              <div className={styles.rightSection}>
                <SideSection title={'예상 기간'}>날짜 선택 섹션 추가 예정</SideSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateStudyPage;
