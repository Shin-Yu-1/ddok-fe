import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';

interface GetApiOptions {
  url: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
}

const fetcher = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const { data } = await api.get<T>(url, { params });
  return data;
};

export const useGetApi = <T>({ url, params, enabled = true }: GetApiOptions) => {
  return useQuery({
    queryKey: ['getApi', url, params],
    queryFn: () => fetcher<T>(url, params),
    enabled: enabled && !!url,
  });
};
