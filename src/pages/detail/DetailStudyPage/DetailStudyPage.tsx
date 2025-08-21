import { useParams, useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';

import styles from './DetailStudyPage.module.scss';

const DetailStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleClick = () => {
    // TODO: 추후 API 연결 필요
    navigate(`/edit/study/${id}`);
  };
  return (
    <>
      <h1 className={styles.title}>DetailStudyPage</h1>
      <div className={styles.container}>
        <div className={styles.bannerImage}>배너 이미지 섹션</div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>
              <Button variant="secondary" radius="xsm" onClick={handleClick}>
                모집 공고 수정하기
              </Button>
            </div>
            <div className={styles.nameSection}>팀명 컴포넌트 들어갈 예정</div>
            <div className={styles.detailInfoSection}>
              <div className={styles.leftSection}>왼쪽</div>
              <div className={styles.rightSections}>오른쪽</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailStudyPage;
