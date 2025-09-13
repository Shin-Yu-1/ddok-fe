import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';

import type { SubmitEvaluationRequest } from '../schemas/teamEvaluationSchema';

interface SubmitEvaluationVariables {
  teamId: number;
  evaluationId: number;
  evaluationData: SubmitEvaluationRequest;
}

/**
 * 팀원 평가 제출 API 호출 훅
 */
export const useSubmitEvaluation = () => {
  return useMutation<void, unknown, SubmitEvaluationVariables>({
    mutationFn: async ({ teamId, evaluationId, evaluationData }: SubmitEvaluationVariables) => {
      await api.post(`/api/teams/${teamId}/evaluations/${evaluationId}/scores`, evaluationData);
    },
  });
};
