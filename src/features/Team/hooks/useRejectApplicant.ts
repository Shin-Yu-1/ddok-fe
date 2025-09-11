import { usePostApi } from '@/hooks/usePostApi';

import type { ApplicantActionResponse } from '../schemas/teamApplicantActionSchema';

interface UseRejectApplicantParams {
  teamId: number;
  applicationId: number;
}

/**
 * 참여 희망자 거절 hook
 */
export const useRejectApplicant = ({ teamId, applicationId }: UseRejectApplicantParams) => {
  return usePostApi<ApplicantActionResponse>({
    url: `/api/teams/${teamId}/applicants/${applicationId}/reject`,
  });
};
