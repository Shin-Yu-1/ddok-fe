/**
 * 팀원 평가 항목 enum
 */
export enum EvaluationCriteria {
  PARTICIPATION = 'PARTICIPATION',
  COLLABORATION = 'COLLABORATION',
  CONTRIBUTION = 'CONTRIBUTION',
  PROBLEM_SOLVING = 'PROBLEM_SOLVING',
  TIME_MANAGEMENT = 'TIME_MANAGEMENT',
}

/**
 * 평가 항목별 질문 텍스트
 */
export const EVALUATION_QUESTIONS = {
  [EvaluationCriteria.PARTICIPATION]: '프로젝트/스터디 전반에서 성실하게 참여했는가?',
  [EvaluationCriteria.COLLABORATION]: '의견 교환과 의사소통에 적극적이고 원활했는가?',
  [EvaluationCriteria.CONTRIBUTION]:
    '본인이 맡은 역할을 충실히 수행하고 팀 목표 달성에 기여했는가?',
  [EvaluationCriteria.PROBLEM_SOLVING]: '문제 상황에서 건설적인 해결책을 제시했는가?',
  [EvaluationCriteria.TIME_MANAGEMENT]: '정해진 기한과 약속을 성실히 지켰는가?',
} as const;

/**
 * 평가 점수 타입 (1-5점)
 */
export type EvaluationScore = 1 | 2 | 3 | 4 | 5;

/**
 * 평가 데이터 타입
 */
export type EvaluationData = {
  [key in EvaluationCriteria]: EvaluationScore | null;
};

/**
 * 평가 항목 목록 (순서대로)
 */
export const EVALUATION_CRITERIA_LIST = [
  EvaluationCriteria.PARTICIPATION,
  EvaluationCriteria.COLLABORATION,
  EvaluationCriteria.CONTRIBUTION,
  EvaluationCriteria.PROBLEM_SOLVING,
  EvaluationCriteria.TIME_MANAGEMENT,
] as const;
