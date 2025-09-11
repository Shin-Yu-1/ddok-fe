import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';

interface RemoveRequest {
  confirmText: string;
}

interface RemoveResponse {
  success: boolean;
  message?: string;
}

export const useRemoveTeam = (teamType: 'PROJECT' | 'STUDY', recruitmentId: number) => {
  const endpoint =
    teamType === 'PROJECT' ? `/api/projects/${recruitmentId}` : `/api/studies/${recruitmentId}`;

  return useMutation<RemoveResponse, unknown, RemoveRequest>({
    mutationFn: async (body: RemoveRequest) => {
      const { data } = await api.delete<RemoveResponse>(endpoint, { data: body });
      return data;
    },
  });
};
