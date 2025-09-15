import { usePostApi } from '@/hooks/usePostApi';

import type { ApplicantActionResponse } from '../schemas/teamApplicantActionSchema';

interface UseApproveApplicantParams {
  teamId: number;
  applicationId: number;
}

/**
 * 참여 희망자 수락 hook
 */
export const useApproveApplicant = ({ teamId, applicationId }: UseApproveApplicantParams) => {
  return usePostApi<ApplicantActionResponse>({
    url: `/api/teams/${teamId}/applicants/${applicationId}/approve`,
  });
};
