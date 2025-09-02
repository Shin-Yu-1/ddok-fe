import Button from '@/components/Button/Button';

import styles from './TeamSettingPage.module.scss';

const TeamSettingPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>'프로젝트/스터디 팀명' 관리 페이지</h1>

      <section className={styles.wrapper}>
        <div className={styles.label}>팀원</div>
        <div className={styles.members}>
          <div>담당 포지션</div>
          <div>멤버</div>
          <div>액션</div>

          <div>팀장</div>
          <div>용</div>
          <div>추방</div>

          <div>풀스택</div>
          <div>쏘</div>
          <div>추방</div>

          <div>프론트엔드</div>
          <div>건</div>
          <div>추방</div>

          <div>풀스택</div>
          <div>재</div>
          <div>추방</div>
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className={styles.label}>참여 희망자</div>
        <div className={styles.participants}>
          <div>번호</div>
          <div>지원 포지션</div>
          <div>멤버</div>
          <div>액션</div>

          <div>1</div>
          <div>팀장</div>
          <div>용</div>
          <div>추방</div>

          <div>2</div>
          <div>팀장</div>
          <div>용</div>
          <div>추방</div>

          <div>3</div>
          <div>팀장</div>
          <div>용</div>
          <div>추방</div>

          <div>4</div>
          <div>팀장</div>
          <div>용</div>
          <div>추방</div>
        </div>
      </section>

      <section className={styles.settings}>
        <div className={styles.label}>프로젝트 관련 설정</div>
        <div className={styles.settingItem}>
          <div>프로젝트 중도 하차하기</div>
          <Button backgroundColor="var(--black-1)" textColor="var(--white-3)" radius="sm">
            하차하기
          </Button>
        </div>
        <div className={styles.settingItem}>
          <div>프로젝트 종료 및 평가하기</div>
          <Button backgroundColor="var(--black-1)" textColor="var(--white-3)" radius="sm">
            종료 및 평가하기
          </Button>
        </div>
        <div className={styles.settingItem}>
          <div>프로젝트 삭제하기</div>
          <Button backgroundColor="var(--gray-4)" radius="sm">
            삭제하기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TeamSettingPage;
