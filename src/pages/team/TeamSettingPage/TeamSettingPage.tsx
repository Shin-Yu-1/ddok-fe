import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import type { EvaluationData } from '@/constants/evaluation';
import ApplicantsGrid from '@/features/Team/components/ApplicantsGrid/ApplicantsGrid';
import EvaluateModal from '@/features/Team/components/EvaluateModal/EvaluateModal';
import MembersGrid from '@/features/Team/components/MembersGrid/MembersGrid';
import RemoveModal from '@/features/Team/components/RemoveModal/RemoveModal';
import SelectMemberModal from '@/features/Team/components/SelectMemberModal/SelectMemberModal';
import WithdrawModal from '@/features/Team/components/WithdrawModal/WithdrawModal';
import { useCloseTeam } from '@/features/Team/hooks/useCloseTeam';
import { useGetEvaluationItems } from '@/features/Team/hooks/useGetEvaluationItems';
import { useGetTeamSetting } from '@/features/Team/hooks/useGetTeamSetting';
import { useRemoveTeam } from '@/features/Team/hooks/useRemoveTeam';
import { useWithdrawFromTeam } from '@/features/Team/hooks/useWithdrawFromTeam';

import type { MemberType } from '../../../features/Team/schemas/teamMemberSchema';

import styles from './TeamSettingPage.module.scss';

const TeamSettingPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  // 모달 상태 관리
  const [isSelectMemberModalOpen, setIsSelectMemberModalOpen] = useState(false);
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  const teamId = id ? parseInt(id, 10) : null;

  const {
    data: teamData,
    isLoading,
    isError,
    error,
  } = useGetTeamSetting({
    teamId: teamId || 0,
    enabled: !!teamId,
  });

  // 평가 데이터 가져오기 (팀이 종료된 상태이고 모달이 열렸을 때만)
  const { data: evaluationData } = useGetEvaluationItems({
    teamId: teamId || 0,
    enabled: !!teamId && teamData?.data.teamStatus === 'CLOSED' && isSelectMemberModalOpen,
  });

  // 현재 사용자의 memberId 찾기
  const currentUserMember = teamData?.data.items.find(member => member.isMine);
  const currentMemberId = currentUserMember?.memberId;

  // 하차 API 호출
  const withdrawMutation = useWithdrawFromTeam(teamId || 0, currentMemberId || 0);

  // 종료 API 호출
  const closeMutation = useCloseTeam();

  // 삭제 API 호출
  const removeMutation = useRemoveTeam(
    teamData?.data.teamType || 'PROJECT',
    teamData?.data.recruitmentId || 0
  );

  // 권한 에러 체크 및 이전 페이지로 이동
  useEffect(() => {
    if (isError && error) {
      if (
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 403
      ) {
        alert('해당 팀에 접근할 권한이 없습니다.');
        navigate(-1); // 이전 페이지로 이동
      }
    }
  }, [isError, error, navigate]);

  const handleEvaluateSubmit = (evaluationData: EvaluationData) => {
    console.log('평가 데이터:', evaluationData);
    console.log('평가 대상:', selectedMember?.user.nickname);
    // TODO: 평가 데이터 API 전송 로직 추가
  };

  const openSelectMemberModal = () => {
    setIsSelectMemberModalOpen(true);
  };

  const closeSelectMemberModal = () => {
    setIsSelectMemberModalOpen(false);
  };

  const handleMemberSelect = (member: MemberType) => {
    // 평가 데이터가 있다면 해당 멤버의 평가 상태를 확인
    if (evaluationData?.data.items) {
      const evaluationMember = evaluationData.data.items.find(
        item => item.memberId === member.memberId
      );
      if (evaluationMember) {
        console.log(`${member.user.nickname} 평가 상태:`, {
          isEvaluated: evaluationMember.isEvaluated,
          scores: evaluationMember.scores,
        });
      }
    }

    setSelectedMember(member);
    setIsEvaluateModalOpen(true);
  };

  const closeEvaluateModal = () => {
    setIsEvaluateModalOpen(false);
    setSelectedMember(null);
  };

  // 하차 관련 핸들러
  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawConfirm = (confirmText: string) => {
    if (!teamId || !currentMemberId) return;

    withdrawMutation.mutate(
      { confirmText },
      {
        onSuccess: () => {
          alert('프로젝트에서 하차했습니다.');
          setIsWithdrawModalOpen(false);
          navigate(-1); // 이전 페이지로 이동
        },
        onError: error => {
          console.error('하차 실패:', error);
          alert('하차 처리 중 오류가 발생했습니다.');
        },
      }
    );
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  // 종료 관련 핸들러
  const handleCloseClick = () => {
    if (!teamData?.data.teamId) return;

    const confirmMessage = `정말로 ${teamData.data.teamType === 'PROJECT' ? '프로젝트' : '스터디'}를 종료하시겠습니까?`;

    if (confirm(confirmMessage)) {
      closeMutation.mutate(
        { teamId: teamData.data.teamId },
        {
          onSuccess: () => {
            alert(
              `${teamData.data.teamType === 'PROJECT' ? '프로젝트' : '스터디'}가 종료되었습니다.`
            );
            // 페이지 새로고침 또는 상태 업데이트
            window.location.reload();
          },
          onError: error => {
            console.error('종료 실패:', error);
            alert('종료 처리 중 오류가 발생했습니다.');
          },
        }
      );
    }
  };

  // 삭제 관련 핸들러
  const handleRemoveClick = () => {
    setIsRemoveModalOpen(true);
  };

  const handleRemoveConfirm = (confirmText: string) => {
    if (!teamData?.data.recruitmentId) return;

    removeMutation.mutate(
      { confirmText },
      {
        onSuccess: () => {
          alert('프로젝트/스터디가 삭제되었습니다.');
          setIsRemoveModalOpen(false);
          navigate('/map'); // 지도 페이지로 이동
        },
        onError: error => {
          console.error('삭제 실패:', error);
          alert('삭제 처리 중 오류가 발생했습니다.');
        },
      }
    );
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
  };

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
      <div className={styles.header}>
        {/* 팀 이름 */}
        <h1 className={styles.title}>
          {teamData.data.teamTitle}
          <span className={styles.subtitle}> 관리 페이지</span>
        </h1>

        {/* 프로젝트 진행 상태 */}
        <div
          className={`${styles.teamStatus} ${
            teamData.data.teamStatus === 'RECRUITING'
              ? styles.recruiting
              : teamData.data.teamStatus === 'ONGOING'
                ? styles.ongoing
                : styles.closed
          }`}
        >
          {teamData.data.teamType === 'PROJECT' ? '프로젝트' : '스터디'}{' '}
          {teamData.data.teamStatus === 'RECRUITING'
            ? '모집 중'
            : teamData.data.teamStatus === 'ONGOING'
              ? '진행 중'
              : '종료'}
        </div>
      </div>

      <section className={styles.wrapper}>
        <div className={styles.label}>팀원</div>
        <MembersGrid
          teamType={teamData.data.teamType}
          members={teamData.data.items}
          amILeader={teamData.data.isLeader}
          teamId={teamId}
        />
      </section>

      <section className={styles.wrapper}>
        <div className={styles.label}>참여 희망자</div>
        <ApplicantsGrid
          teamType={teamData.data.teamType}
          teamId={teamId}
          amILeader={teamData.data.isLeader}
        />
      </section>

      <section className={styles.settings}>
        <div className={styles.label}>프로젝트 관련 설정</div>
        {/* 하차하기 버튼: 내가 leader가 아니고, teamStatus가 종료되지 않았을 때만 보임 */}
        {!teamData.data.isLeader && teamData.data.teamStatus !== 'CLOSED' && (
          <div className={styles.settingItem}>
            <div>프로젝트 중도 하차하기</div>
            <Button
              className={styles.leaveBtn}
              backgroundColor="var(--black-1)"
              textColor="var(--white-3)"
              radius="xsm"
              fontSize="var(--fs-xxsmall)"
              height="35px"
              onClick={handleWithdrawClick}
            >
              하차하기
            </Button>
          </div>
        )}

        {/* 종료하기 버튼: 내가 leader이고 teamStatus가 진행 중일 때만 보임 */}
        {teamData.data.isLeader && teamData.data.teamStatus === 'ONGOING' && (
          <div className={styles.settingItem}>
            <div>프로젝트 종료하기</div>
            <Button
              className={styles.closureBtn}
              backgroundColor="var(--black-1)"
              textColor="var(--white-3)"
              radius="xsm"
              fontSize="var(--fs-xxsmall)"
              height="35px"
              onClick={handleCloseClick}
              disabled={closeMutation.isPending}
            >
              {closeMutation.isPending ? '종료 중...' : '종료하기'}
            </Button>
          </div>
        )}

        {/* 평가하기 버튼: teamStatus가 종료 상태일 때 보임 */}
        {teamData.data.teamStatus === 'CLOSED' && (
          <div className={styles.settingItem}>
            <div>팀원 평가하기</div>
            <Button
              className={styles.evaluateBtn}
              backgroundColor="var(--black-1)"
              textColor="var(--white-3)"
              radius="xsm"
              fontSize="var(--fs-xxsmall)"
              height="35px"
              onClick={openSelectMemberModal}
            >
              평가하기
            </Button>
          </div>
        )}

        {/* 프로젝트 삭제하기 버튼: 내가 leader일 때만 */}
        {teamData.data.isLeader && (
          <div className={styles.settingItem}>
            <div>프로젝트 삭제하기</div>
            <Button
              className={styles.deleteBtn}
              backgroundColor="var(--gray-4)"
              radius="xsm"
              fontSize="var(--fs-xxsmall)"
              height="35px"
              onClick={handleRemoveClick}
            >
              삭제하기
            </Button>
          </div>
        )}
      </section>

      {/* 팀원 선택 모달 */}
      <SelectMemberModal
        isOpen={isSelectMemberModalOpen}
        onClose={closeSelectMemberModal}
        members={teamData?.data.items || []}
        onSelectMember={handleMemberSelect}
        evaluationMembers={evaluationData?.data.items}
      />

      {/* 평가 모달 */}
      <EvaluateModal
        isOpen={isEvaluateModalOpen}
        onClose={closeEvaluateModal}
        memberName={selectedMember?.user.nickname || '팀원'}
        onSubmit={handleEvaluateSubmit}
      />

      {/* 하차 모달 */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={closeWithdrawModal}
        onConfirm={handleWithdrawConfirm}
        isLoading={withdrawMutation.isPending}
      />

      {/* 삭제 모달 */}
      <RemoveModal
        isOpen={isRemoveModalOpen}
        onClose={closeRemoveModal}
        onConfirm={handleRemoveConfirm}
        isLoading={removeMutation.isPending}
      />
    </div>
  );
};

export default TeamSettingPage;
