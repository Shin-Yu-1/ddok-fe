import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';

import type { TeamSettingResponse } from '../schemas/teamSettingSchema';

interface UseGetTeamSettingParams {
  teamId: number;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const fetcher = async (
  teamId: number,
  params?: Record<string, unknown>
): Promise<TeamSettingResponse> => {
  const { data } = await api.get<TeamSettingResponse>(`/api/teams/${teamId}/members`, { params });
  return data;
};

/**
 * 팀 설정(팀원 목록) 조회 hook
 */
export const useGetTeamSetting = ({
  teamId,
  page = 0,
  size = 10,
  enabled = true,
}: UseGetTeamSettingParams) => {
  return useQuery({
    queryKey: ['getApi', `/api/teams/${teamId}/members`, { page, size }],
    queryFn: () => fetcher(teamId, { page, size }),
    enabled: enabled && !!teamId,
    retry: (failureCount, error) => {
      // 403 에러의 경우 재시도하지 않음
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
