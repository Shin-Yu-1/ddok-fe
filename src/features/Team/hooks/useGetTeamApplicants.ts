import { useGetApi } from '@/hooks/useGetApi';

import type { TeamApplicantListResponse } from '../schemas/teamApplicantsListSchema';

interface UseGetTeamApplicantsParams {
  teamId: number;
  page?: number;
  size?: number;
  enabled?: boolean;
}

/**
 * 팀 참여 희망자 목록 조회 hook
 */
export const useGetTeamApplicants = ({
  teamId,
  page = 0,
  size = 4,
  enabled = true,
}: UseGetTeamApplicantsParams) => {
  return useGetApi<TeamApplicantListResponse>({
    url: `/api/teams/${teamId}/applicants`,
    params: { page, size },
    enabled: enabled && !!teamId,
  });
};
