import { useQueryClient } from '@tanstack/react-query';

import Button from '@/components/Button/Button';
import User from '@/features/Team/components/UserRow/UserRow';
import { useApproveApplicant } from '@/features/Team/hooks/useApproveApplicant';
import { useRejectApplicant } from '@/features/Team/hooks/useRejectApplicant';

import type { ApplicantType } from '../../../schemas/teamApplicantsListSchema';

import styles from './ApplicantRow.module.scss';

interface ApplicantRowProps {
  member: ApplicantType;
  teamId: number;
  amILeader: boolean;
}

const ApplicantRow = ({ member, teamId, amILeader }: ApplicantRowProps) => {
  const queryClient = useQueryClient();

  const approveApplicant = useApproveApplicant({
    teamId,
    applicationId: member.applicantId,
  });

  const rejectApplicant = useRejectApplicant({
    teamId,
    applicationId: member.applicantId,
  });

  const handleApprove = () => {
    approveApplicant.mutate(undefined, {
      onSuccess: () => {
        console.log('참여 희망자 수락 성공');
        // 팀 설정 데이터와 참여 희망자 목록을 새로고침
        queryClient.invalidateQueries({
          queryKey: ['getApi', `/api/teams/${teamId}/members`],
        });
        queryClient.invalidateQueries({
          queryKey: ['getApi', `/api/teams/${teamId}/applicants`],
        });
      },
      onError: error => {
        console.error('참여 희망자 수락 실패:', error);
      },
    });
  };

  const handleReject = () => {
    rejectApplicant.mutate(undefined, {
      onSuccess: () => {
        console.log('참여 희망자 거절 성공');
        // 참여 희망자 목록만 새로고침 (거절의 경우 팀원 목록은 변경되지 않음)
        queryClient.invalidateQueries({
          queryKey: ['getApi', `/api/teams/${teamId}/applicants`],
        });
      },
      onError: error => {
        console.error('참여 희망자 거절 실패:', error);
      },
    });
  };
  return (
    <>
      <div className={styles.position}>{member.appliedPosition}</div>
      <User user={member.user} />
      <div className={styles.actionContainer}>
        {amILeader ? (
          <>
            <Button
              className={styles.action}
              backgroundColor="var(--blue-1)"
              fontSize="var(--fs-xxsmall)"
              height="28px"
              textColor="var(--white-2)"
              radius="xsm"
              fontWeightPreset="regular"
              onClick={handleApprove}
              disabled={approveApplicant.isPending}
            >
              {approveApplicant.isPending ? '처리 중...' : '수락'}
            </Button>
            <Button
              className={styles.action}
              backgroundColor="var(--gray-1)"
              fontSize="var(--fs-xxsmall)"
              height="28px"
              textColor="var(--white-2)"
              radius="xsm"
              fontWeightPreset="regular"
              onClick={handleReject}
              disabled={rejectApplicant.isPending}
            >
              {rejectApplicant.isPending ? '처리 중...' : '거절'}
            </Button>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ApplicantRow;
