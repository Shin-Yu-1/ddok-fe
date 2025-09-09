import { useGetApi } from '@/hooks/useGetApi';

import type { TeamSettingResponse } from '../schemas/teamSettingSchema';

interface UseGetTeamSettingParams {
  teamId: number;
  page?: number;
  size?: number;
  enabled?: boolean;
}

/**
 * 팀 설정(팀원 목록) 조회 hook
 */
export const useGetTeamSetting = ({
  teamId,
  page = 0,
  size = 10,
  enabled = true,
}: UseGetTeamSettingParams) => {
  return useGetApi<TeamSettingResponse>({
    url: `/api/teams/${teamId}/members`,
    params: { page, size },
    enabled: enabled && !!teamId,
  });
};
