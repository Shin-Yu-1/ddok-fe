import { useQueryClient } from '@tanstack/react-query';

import Button from '@/components/Button/Button';
import UserRow from '@/features/Team/components/UserRow/UserRow';
import { useExpelMember } from '@/features/Team/hooks/useExpelMember';
import type { MemberType } from '@/features/Team/schemas/teamMemberSchema';

import styles from './MemberRow.module.scss';

interface MemberRowProps {
  teamType: string;
  member: MemberType;
  amILeader: boolean;
  teamId: number;
  teamStatus?: string; // 팀 상태 추가
}

const MemberRow = ({ teamType, member, amILeader, teamId, teamStatus }: MemberRowProps) => {
  const queryClient = useQueryClient();

  const expelMember = useExpelMember({
    teamId,
    memberId: member.memberId,
  });

  const handleExpel = () => {
    if (window.confirm(`${member.user.nickname}님을 팀에서 추방하시겠습니까?`)) {
      expelMember.mutate(undefined, {
        onSuccess: () => {
          console.log('팀원 추방 성공');
          // 팀원 목록을 새로고침
          queryClient.invalidateQueries({
            queryKey: ['getApi', `/api/teams/${teamId}/members`],
          });
        },
        onError: error => {
          console.error('팀원 추방 실패:', error);
          // TODO: 에러 처리 로직
        },
      });
    }
  };
  return (
    <>
      <div className={styles.positionContainer}>
        {member.role === 'LEADER' ? <div className={styles.leader}>팀장</div> : null}
        {teamType === 'PROJECT' && <div className={styles.position}>{member.decidedPosition}</div>}
      </div>
      <UserRow user={member.user} />
      <div className={styles.actionContainer}>
        {amILeader && member.role !== 'LEADER' ? (
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
            onClick={handleExpel}
            disabled={expelMember.isPending || teamStatus === 'CLOSED'}
          >
            {expelMember.isPending ? '처리 중...' : '추방'}
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default MemberRow;
