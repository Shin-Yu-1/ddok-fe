import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/api';

interface PatchApiOptions {
  url: string;
  params?: Record<string, unknown>;
}

/**
 * TODO: 추후 제거 예정
 * 사용 예:
 * const patchUser = usePatchApi<RESPONSE_TYPE, REQUEST_TYPE>({ url: '/PATCH_URL' });
 *
 * 요청: patchUser.mutate(REQUEST_BODY_DATA);
 * 요청 및 응답:
 * patchUser.mutate(REQUEST_BODY_DATA, {
 *   onSuccess: SUCCESS_FUNCTION,
 *   onError: ERROR_FUNCTION
 * });
 */
export const usePatchApi = <TResponse, TBody = unknown>({ url, params }: PatchApiOptions) => {
  return useMutation<TResponse, unknown, TBody>({
    mutationFn: async (body: TBody) => {
      const { data } = await api.patch<TResponse>(url, body, { params });
      return data;
    },
  });
};
