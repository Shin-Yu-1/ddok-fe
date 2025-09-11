import { usePatchApi } from '@/hooks/usePatchApi';

interface WithdrawRequest {
  confirmText: string;
}

interface WithdrawResponse {
  success: boolean;
  message?: string;
}

export const useWithdrawFromTeam = (teamId: number, memberId: number) => {
  return usePatchApi<WithdrawResponse, WithdrawRequest>({
    url: `/api/teams/${teamId}/members/${memberId}/withdraw`,
  });
};
