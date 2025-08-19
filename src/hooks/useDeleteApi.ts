import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';

interface DeleteApiOptions {
  url: string;
  params?: Record<string, unknown>;
}

/**
 * TODO: 추후 제거 예정
 * 사용 예:
 * const deleteUser = useDeleteApi<RESPONSE_TYPE>({ url: '/DELETE_URL' });
 *
 * 요청: deleteUser.mutate();
 * 요청 및 응답:
 * deleteUser.mutate(undefined, {
 *   onSuccess: SUCCESS_FUNCTION,
 *   onError: ERROR_FUNCTION
 * });
 */
export const useDeleteApi = <TResponse>({ url, params }: DeleteApiOptions) => {
  return useMutation<TResponse>({
    mutationFn: async () => {
      const { data } = await api.delete<TResponse>(url, { params });
      return data;
    },
  });
};
