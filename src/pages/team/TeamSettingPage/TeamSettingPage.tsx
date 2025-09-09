import { useParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import ApplicantsGrid from '@/features/Team/components/ApplicantsGrid/ApplicantsGrid';
import MembersGrid from '@/features/Team/components/MembersGrid/MembersGrid';
import { useGetTeamSetting } from '@/features/Team/hooks/useGetTeamSetting';

import styles from './TeamSettingPage.module.scss';

const TeamSettingPage = () => {
  const params = useParams();
  const { id } = params;

  const teamId = id ? parseInt(id, 10) : null;

  // 팀 설정 정보 조회
  const {
    data: teamData,
    isLoading,
    isError,
  } = useGetTeamSetting({
    teamId: teamId || 0,
    enabled: !!teamId,
  });

  if (!id || !teamId || isNaN(teamId)) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>올바르지 않은 팀 ID입니다.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>팀 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (isError || !teamData?.data) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>팀 정보를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {teamData.data.teamTitle}
        <span className={styles.subtitle}> 관리 페이지</span>
      </h1>

      <section className={styles.wrapper}>
        <div className={styles.label}>팀원</div>
        <MembersGrid members={teamData.data.items} amILeader={teamData.data.isLeader} />
      </section>

      <section className={styles.wrapper}>
        <div className={styles.label}>참여 희망자</div>
        <ApplicantsGrid teamId={teamId} />
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
          <div>프로젝트 종료하기</div>
          <Button
            backgroundColor="var(--black-1)"
            textColor="var(--white-3)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            종료하기
          </Button>
        </div>

        <div className={styles.settingItem}>
          <div>팀원 평가하기</div>
          <Button
            backgroundColor="var(--black-1)"
            textColor="var(--white-3)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            평가하기
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
