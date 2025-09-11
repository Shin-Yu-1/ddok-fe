import { usePatchApi } from '@/hooks/usePatchApi';

import type { ApplicantActionResponse } from '../schemas/teamApplicantActionSchema';

interface UseExpelMemberParams {
  teamId: number;
  memberId: number;
}

/**
 * 팀원 추방 hook
 */
export const useExpelMember = ({ teamId, memberId }: UseExpelMemberParams) => {
  return usePatchApi<ApplicantActionResponse>({
    url: `/api/teams/${teamId}/members/${memberId}/expel`,
  });
};
