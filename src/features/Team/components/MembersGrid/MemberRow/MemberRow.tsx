import { useQueryClient } from '@tanstack/react-query';

import Button from '@/components/Button/Button';
import UserRow from '@/features/Team/components/UserRow/UserRow';
import { useExpelMember } from '@/features/Team/hooks/useExpelMember';
import type { MemberType } from '@/features/Team/schemas/teamMemberSchema';
import { DDtoast } from '@/features/toast';

import styles from './MemberRow.module.scss';

interface MemberRowProps {
  teamType: string;
  member: MemberType;
  amILeader: boolean;
  teamId: number;
  teamStatus?: string;
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
          DDtoast({
            mode: 'custom',
            type: 'success',
            userMessage: '팀원 추방이 완료되었습니다.',
          });
          queryClient.invalidateQueries({
            queryKey: ['getApi', `/api/teams/${teamId}/members`],
          });
        },
        onError: () => {
          DDtoast({
            mode: 'custom',
            type: 'error',
            userMessage: '팀원 추방 중 오류가 발생했습니다.',
          });
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
