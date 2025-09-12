import { X } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import { EVALUATION_QUESTIONS, EVALUATION_CRITERIA_LIST } from '@/constants/evaluation';

import type { EvaluationScore } from '../../schemas/teamEvaluationSchema';
import type { MemberType } from '../../schemas/teamMemberSchema';

import styles from './EvaluationResultModal.module.scss';

interface EvaluationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberType | null;
  scores: EvaluationScore[];
}

const EvaluationResultModal = ({ isOpen, onClose, member, scores }: EvaluationResultModalProps) => {
  if (!isOpen || !member) return null;

  // itemId를 기반으로 평가 질문 텍스트를 가져오는 함수
  const getEvaluationQuestion = (itemId: number): string => {
    const criteriaIndex = itemId - 1; // itemId는 1부터 시작하므로 인덱스는 -1
    const criteria = EVALUATION_CRITERIA_LIST[criteriaIndex];
    return criteria ? EVALUATION_QUESTIONS[criteria] : `평가 항목 ${itemId}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{member.user.nickname}님에 대한 평가 결과</h2>
          <Button
            backgroundColor="transparent"
            width={24}
            height={24}
            padding="0px"
            onClick={onClose}
            style={{ flexShrink: 0 }}
          >
            <X size={24} weight="light" color="var(--black-1)" />
          </Button>
        </div>

        <div className={styles.content}>
          {scores.length > 0 ? (
            <div className={styles.scoresList}>
              {scores.map(score => (
                <div key={score.itemId} className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>{getEvaluationQuestion(score.itemId)}</span>
                  <span className={styles.scoreValue}>{score.score}점</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noScores}>평가 데이터가 없습니다.</div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            onClick={onClose}
            backgroundColor="var(--gray-2)"
            textColor="var(--black-1)"
            radius="sm"
            fontSize="var(--fs-xsmall)"
            className={styles.closeButton}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResultModal;
