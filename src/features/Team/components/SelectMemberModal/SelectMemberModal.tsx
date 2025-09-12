import { useState } from 'react';

import { X } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';

import type { EvaluationMember, EvaluationScore } from '../../schemas/teamEvaluationSchema';
import type { MemberType } from '../../schemas/teamMemberSchema';

import styles from './SelectMemberModal.module.scss';

interface SelectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberType[];
  onSelectMember: (member: MemberType) => void;
  onViewEvaluation?: (member: MemberType, scores: EvaluationScore[]) => void;
  evaluationMembers?: EvaluationMember[];
}

const SelectMemberModal = ({
  isOpen,
  onClose,
  members,
  onSelectMember,
  onViewEvaluation,
  evaluationMembers,
}: SelectMemberModalProps) => {
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  const handleMemberSelect = (member: MemberType) => {
    setSelectedMember(member);
  };

  const handleConfirm = () => {
    if (selectedMember) {
      const isEvaluated = isAlreadyEvaluated(selectedMember.memberId);

      if (isEvaluated && onViewEvaluation) {
        // 이미 평가한 멤버인 경우 평가 조회
        const scores = getEvaluationScores(selectedMember.memberId);
        onViewEvaluation(selectedMember, scores);
      } else {
        // 평가하지 않은 멤버인 경우 평가 진행
        onSelectMember(selectedMember);
      }

      onClose();
      setSelectedMember(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedMember(null);
  };

  // 해당 멤버가 이미 평가되었는지 확인하는 함수
  const isAlreadyEvaluated = (memberId: number): boolean => {
    if (!evaluationMembers) return false;
    const evaluationMember = evaluationMembers.find(item => item.memberId === memberId);
    return evaluationMember?.isEvaluated || false;
  };

  // 해당 멤버의 평가 점수를 가져오는 함수
  const getEvaluationScores = (memberId: number) => {
    if (!evaluationMembers) return [];
    const evaluationMember = evaluationMembers.find(item => item.memberId === memberId);
    return evaluationMember?.scores || [];
  };

  if (!isOpen) return null;

  // 자신을 제외한 팀원들만 필터링
  const evaluatableMembers = members.filter(member => !member.isMine);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 모달 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>평가할 팀원 선택</h2>
              <Button
                backgroundColor="transparent"
                width={24}
                height={24}
                padding="0px"
                onClick={handleClose}
                style={{ flexShrink: 0 }}
              >
                <X size={24} weight="light" color="var(--black-1)" />
              </Button>
            </div>
            <p className={styles.subtitle}>평가하고 싶은 팀원을 선택해주세요.</p>
          </div>
        </div>

        {/* 팀원 리스트 */}
        <div className={styles.content}>
          {evaluatableMembers.length === 0 ? (
            <div className={styles.empty}>평가할 수 있는 팀원이 없습니다.</div>
          ) : (
            <div className={styles.memberList}>
              {evaluatableMembers.map(member => {
                const isEvaluated = isAlreadyEvaluated(member.memberId);
                return (
                  <div
                    key={member.memberId}
                    className={`${styles.memberItem} ${
                      selectedMember?.memberId === member.memberId ? styles.selected : ''
                    } ${isEvaluated ? styles.evaluated : ''}`}
                    onClick={() => handleMemberSelect(member)}
                  >
                    <div className={styles.user}>
                      <div className={styles.user__item}>
                        <div className={styles.user__item__left}>
                          <img
                            className={styles.user__item__left__img}
                            src="/src/assets/images/avatar.png"
                            alt="Banner"
                          />
                          <div className={styles.user__item__left__nickname}>
                            {member.user.nickname}
                          </div>
                        </div>

                        <div className={styles.user__item__right}>
                          <div className={styles.user__item__right__position}>
                            {member.user.mainPosition}
                          </div>
                          <div className={styles.user__item__right__temperature}>
                            <Thermometer temperature={member.user.temperature} />
                            {member.user.temperature}℃
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEvaluated ? (
                      <div className={styles.evaluationStatus}>
                        <span className={styles.evaluatedBadge}>평가 완료</span>
                      </div>
                    ) : (
                      <div className={styles.evaluationStatus}>
                        <span className={styles.noneEvaluatedBadge}>평가 대기</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className={styles.footer}>
          <div className={styles.buttonGroup}>
            <Button
              onClick={handleClose}
              backgroundColor="var(--gray-3)"
              textColor="var(--black-4)"
              fontSize="var(--fs-xxsmall)"
              radius="sm"
              className={styles.cancelButton}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              backgroundColor="var(--blue-1)"
              textColor="var(--white-3)"
              radius="sm"
              fontSize="var(--fs-xxsmall)"
              className={styles.confirmButton}
              disabled={!selectedMember}
            >
              {selectedMember && isAlreadyEvaluated(selectedMember.memberId)
                ? '평가 조회'
                : '평가하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectMemberModal;
