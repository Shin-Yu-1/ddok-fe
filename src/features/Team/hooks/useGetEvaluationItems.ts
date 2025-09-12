import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';

import type { TeamEvaluationResponse } from '../schemas/teamEvaluationSchema';

interface UseGetEvaluationItemsParams {
  teamId: number;
  enabled?: boolean;
}

/**
 * 팀 평가 정보를 가져오는 훅
 */
export const useGetEvaluationItems = ({ teamId, enabled = true }: UseGetEvaluationItemsParams) => {
  return useQuery<TeamEvaluationResponse>({
    queryKey: ['teamEvaluations', teamId],
    queryFn: async () => {
      const { data } = await api.get<TeamEvaluationResponse>(`/api/teams/${teamId}/evaluations`);
      return data;
    },
    enabled: enabled && !!teamId,
  });
};
