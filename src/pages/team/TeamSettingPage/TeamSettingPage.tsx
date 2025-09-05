import Button from '@/components/Button/Button';
import ApplicantRow from '@/features/Team/components/ApplicantRow/ApplicantRow';
import MemberRow from '@/features/Team/components/MemberRow/MemberRow';
import { teamApplicantsMockData } from '@/features/Team/mocks/teamApplicantsListMockData';
import { teamSettingMockData } from '@/features/Team/mocks/teamSettingMockData';

import styles from './TeamSettingPage.module.scss';

const TeamSettingPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{teamSettingMockData.teamTitle} 관리 페이지</h1>

      <section className={styles.wrapper}>
        <div className={styles.label}>팀원</div>
        <div className={styles.membersGrid}>
          <div className={styles.gridLabel}>담당 포지션</div>
          <div className={styles.gridLabel}>멤버</div>
          <div className={styles.gridLabel}>액션</div>
          {teamSettingMockData.items.map(member => (
            <MemberRow key={member.memberId} member={member} />
          ))}
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className={styles.label}>참여 희망자</div>
        <div className={styles.participantsGrid}>
          <div className={styles.gridLabel}>지원 포지션</div>
          <div className={styles.gridLabel}>멤버</div>
          <div className={styles.gridLabel}>액션</div>

          {teamApplicantsMockData.items.map(member => (
            <ApplicantRow key={member.applicantId} member={member} />
          ))}
        </div>
      </section>

      <section className={styles.settings}>
        <div className={styles.label}>프로젝트 관련 설정</div>
        <div className={styles.settingItem}>
          <div>프로젝트 중도 하차하기</div>
          <Button
            backgroundColor="var(--black-1)"
            textColor="var(--white-3)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            하차하기
          </Button>
        </div>

        <div className={styles.settingItem}>
          <div>프로젝트 종료 및 평가하기</div>
          <Button
            backgroundColor="var(--black-1)"
            textColor="var(--white-3)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            종료 및 평가하기
          </Button>
        </div>

        <div className={styles.settingItem}>
          <div>프로젝트 삭제하기</div>
          <Button
            backgroundColor="var(--gray-4)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            삭제하기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TeamSettingPage;
