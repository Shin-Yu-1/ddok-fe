import { useMutation } from '@tanstack/react-query';

import { api } from '@/api/api';

interface PostApiOptions {
  url: string;
  params?: Record<string, unknown>;
}

/**
 * TODO: 추후 제거 예정
 * 사용 예:
 * const postUser = usePostApi<RESPONSE_TYPE, REQUEST_TYPE>({ url: '/POST_URL' });
 *
 * 요청: postUser.mutate(REQUEST_BODY_DATA);
 * 요청 및 응답:
 * postUser.mutate(REQUEST_BODY_DATA, {
 *   onSuccess: SUCCESS_FUNCTION,
 *   onError: ERROR_FUNCTION
 * });
 */

export const usePostApi = <TResponse, TBody = unknown>({ url, params }: PostApiOptions) => {
  return useMutation<TResponse, unknown, TBody>({
    mutationFn: async (body: TBody) => {
      const { data } = await api.post<TResponse>(url, body, { params });
      return data;
    },
  });
};
