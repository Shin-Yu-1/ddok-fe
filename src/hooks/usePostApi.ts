import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/api';

interface PostApiOptions {
  url: string;
  params?: Record<string, unknown>;
}

export const usePostApi = <TResponse, TBody = unknown>({ url, params }: PostApiOptions) => {
  return useMutation<TResponse, unknown, TBody>({
    mutationFn: async (body: TBody) => {
      const { data } = await api.post<TResponse>(url, body, { params });
      return data;
    },
  });
};
