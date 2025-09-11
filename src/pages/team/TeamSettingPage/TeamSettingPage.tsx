import { useState } from 'react';

import { useParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import type { EvaluationData } from '@/constants/evaluation';
import ApplicantsGrid from '@/features/Team/components/ApplicantsGrid/ApplicantsGrid';
import EvaluateModal from '@/features/Team/components/EvaluateModal/EvaluateModal';
import MembersGrid from '@/features/Team/components/MembersGrid/MembersGrid';
import SelectMemberModal from '@/features/Team/components/SelectMemberModal/SelectMemberModal';
import { useGetTeamSetting } from '@/features/Team/hooks/useGetTeamSetting';

import type { MemberType } from '../../../features/Team/schemas/teamMemberSchema';

import styles from './TeamSettingPage.module.scss';

const TeamSettingPage = () => {
  const params = useParams();
  const { id } = params;

  // 모달 상태 관리
  const [isSelectMemberModalOpen, setIsSelectMemberModalOpen] = useState(false);
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  const teamId = id ? parseInt(id, 10) : null;

  const {
    data: teamData,
    isLoading,
    isError,
  } = useGetTeamSetting({
    teamId: teamId || 0,
    enabled: !!teamId,
  });

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
    setSelectedMember(member);
    setIsEvaluateModalOpen(true);
  };

  const closeEvaluateModal = () => {
    setIsEvaluateModalOpen(false);
    setSelectedMember(null);
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
      <h1 className={styles.title}>
        {teamData.data.teamTitle}
        <span className={styles.subtitle}> 관리 페이지</span>
      </h1>

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
            >
              하차하기
            </Button>
          </div>
        )}

        {/* 종료하기 버튼: 내가 leader이고 teamStatus가 진행중이 아닐 때만 보임 */}
        {teamData.data.isLeader && teamData.data.teamStatus !== 'ONGOING' && (
          <div className={styles.settingItem}>
            <div>프로젝트 종료하기</div>
            <Button
              className={styles.closureBtn}
              backgroundColor="var(--black-1)"
              textColor="var(--white-3)"
              radius="xsm"
              fontSize="var(--fs-xxsmall)"
              height="35px"
            >
              종료하기
            </Button>
          </div>
        )}

        {/* 평가하기 버튼: 모든 멤버에 대해 teamStatus가 CLOSED일 때 보임 */}
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
        members={teamData.data.items}
        onSelectMember={handleMemberSelect}
      />

      {/* 평가 모달 */}
      <EvaluateModal
        isOpen={isEvaluateModalOpen}
        onClose={closeEvaluateModal}
        memberName={selectedMember?.user.nickname || '팀원'}
        onSubmit={handleEvaluateSubmit}
      />
    </div>
  );
};

export default TeamSettingPage;
