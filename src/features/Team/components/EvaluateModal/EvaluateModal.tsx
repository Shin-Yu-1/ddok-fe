import { useState } from 'react';

import { XIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import {
  EVALUATION_CRITERIA_LIST,
  EVALUATION_QUESTIONS,
  type EvaluationData,
  type EvaluationScore,
  type EvaluationCriteria,
} from '@/constants/evaluation';
import { DDtoast } from '@/features/toast';

import styles from './EvaluateModal.module.scss';

interface EvaluateModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  onSubmit: (evaluationData: EvaluationData) => void;
}

const EvaluateModal = ({ isOpen, onClose, memberName, onSubmit }: EvaluateModalProps) => {
  const [evaluations, setEvaluations] = useState<EvaluationData>(() => {
    const initialData = {} as EvaluationData;
    EVALUATION_CRITERIA_LIST.forEach(criteria => {
      initialData[criteria] = null;
    });
    return initialData;
  });

  const handleScoreSelect = (criteria: EvaluationCriteria, score: EvaluationScore) => {
    setEvaluations(prev => ({
      ...prev,
      [criteria]: score,
    }));
  };

  const handleSubmit = () => {
    const isAllEvaluated = EVALUATION_CRITERIA_LIST.every(
      criteria => evaluations[criteria] !== null
    );

    if (!isAllEvaluated) {
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '모든 항목을 평가해주세요.',
      });
      return;
    }

    onSubmit(evaluations);
    onClose();

    // 평가 초기화
    setEvaluations(() => {
      const initialData = {} as EvaluationData;
      EVALUATION_CRITERIA_LIST.forEach(criteria => {
        initialData[criteria] = null;
      });
      return initialData;
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 모달 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>{memberName} 평가하기</h2>
              <Button
                backgroundColor="transparent"
                width={24}
                height={24}
                padding="0px"
                onClick={onClose}
                style={{ flexShrink: 0 }}
              >
                <XIcon size={24} weight="light" color="var(--black-1)" />
              </Button>
            </div>
            <p className={styles.subtitle}>동료에 대한 평가 질문에 응답해주세요.</p>
          </div>
        </div>

        {/* 평가 항목들 */}
        <div className={styles.content}>
          <div className={styles.evaluationList}>
            {EVALUATION_CRITERIA_LIST.map(criteria => (
              <div key={criteria} className={styles.evaluationItem}>
                <div className={styles.question}>{EVALUATION_QUESTIONS[criteria]}</div>
                <div className={styles.scoreSelector}>
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      className={`${styles.scoreButton} ${
                        evaluations[criteria] === score ? styles.selected : ''
                      }`}
                      onClick={() => handleScoreSelect(criteria, score as EvaluationScore)}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={styles.footer}>
          <Button
            onClick={handleSubmit}
            backgroundColor="var(--black-4)"
            textColor="var(--white-3)"
            radius="sm"
            fontSize="var(--fs-xxsmall)"
            height="45px"
            className={styles.submitButton}
          >
            평가 제출하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateModal;
