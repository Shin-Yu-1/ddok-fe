import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/api';

interface PutApiOptions {
  url: string;
  params?: Record<string, unknown>;
}

/**
 * TODO: 추후 제거 예정
 * 사용 예:
 * const putUser = usePutApi<RESPONSE_TYPE, REQUEST_TYPE>({ url: '/PUT_URL' });
 *
 * 요청: putUser.mutate(REQUEST_BODY_DATA);
 * 요청 및 응답:
 * putUser.mutate(REQUEST_BODY_DATA, {
 *   onSuccess: SUCCESS_FUNCTION,
 *   onError: ERROR_FUNCTION
 * });
 */
export const usePutApi = <TResponse, TBody = unknown>({ url, params }: PutApiOptions) => {
  return useMutation<TResponse, unknown, TBody>({
    mutationFn: async (body: TBody) => {
      const { data } = await api.put<TResponse>(url, body, { params });
      return data;
    },
  });
};
