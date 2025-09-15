import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';

interface CloseTeamVariables {
  teamId: number;
}

/**
 * 팀 종료 API 호출 훅
 */
export const useCloseTeam = () => {
  return useMutation<void, unknown, CloseTeamVariables>({
    mutationFn: async ({ teamId }: CloseTeamVariables) => {
      await api.patch(`/api/teams/${teamId}/close`);
    },
  });
};
