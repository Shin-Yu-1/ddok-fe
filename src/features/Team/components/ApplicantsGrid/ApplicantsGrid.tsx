import ApplicantRow from '@/features/Team/components/ApplicantsGrid/ApplicantRow/ApplicantRow';
import { useGetTeamApplicants } from '@/features/Team/hooks/useGetTeamApplicants';

import styles from './ApplicantsGrid.module.scss';

interface ApplicantsGridProps {
  teamType: string;
  teamId: number;
  amILeader: boolean;
  page?: number;
  size?: number;
  teamStatus?: string; // 팀 상태 추가
}

const ApplicantsGrid = ({
  teamType,
  teamId,
  amILeader,
  page = 0,
  size = 4,
  teamStatus,
}: ApplicantsGridProps) => {
  const { data, isLoading, isError, error } = useGetTeamApplicants({
    teamId,
    page,
    size,
  });

  if (isLoading) {
    return <div className={styles.loading}>참여 희망자를 불러오는 중...</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>참여 희망자를 불러오는데 실패했습니다: {error?.message}</div>
    );
  }

  if (!data?.data?.items || data.data.items.length === 0) {
    return <div className={styles.empty}>참여 희망자가 없습니다.</div>;
  }

  return (
    <div className={`${styles.applicantsGrid} ${teamType === 'STUDY' ? styles.study : ''}`}>
      {teamType === 'PROJECT' && <div className={styles.gridLabel}>지원 포지션</div>}
      <div className={styles.gridLabel}>멤버</div>
      <div className={styles.gridLabel}>액션</div>

      {data.data.items.map(applicant => (
        <ApplicantRow
          teamType={teamType}
          key={applicant.applicantId}
          member={applicant}
          teamId={teamId}
          amILeader={amILeader}
          teamStatus={teamStatus}
        />
      ))}
    </div>
  );
};

export default ApplicantsGrid;
