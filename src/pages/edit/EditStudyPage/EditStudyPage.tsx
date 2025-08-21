import styles from './EditStudyPage.module.scss';

const EditStudyPage = () => {
  return (
    <>
      <h1 className={styles.title}>EditStudyPage</h1>
      <div className={styles.container}>
        <div className={styles.bannerImage}>배너 이미지 섹션</div>
        <div className={styles.postContainer}>
          <div className={styles.postContentsLayout}>
            <div className={styles.actionsLine}>버튼 section 컴포넌트 들어갈 예정</div>
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

export default EditStudyPage;
