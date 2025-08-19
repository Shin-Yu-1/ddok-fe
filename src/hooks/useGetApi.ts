import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';

interface GetApiOptions {
  url: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
}

/**
 * TODO: 추후 제거 예정
 * 사용 예:
 * const { data, isLoading, isError, error, refetch } =
 *   useGetApi<RESPONSE_TYPE>({ url: '/GET_URL' });
 *
 * 파라미터 포함:
 * const { data } =
 *   useGetApi<RESPONSE_TYPE>({ url: '/GET_URL', params: { page: 1, size: 10 } });
 *
 * 조건부 실행(값 준비 후 수동 실행):
 * const { data, refetch } =
 *   useGetApi<RESPONSE_TYPE>({ url: userId ? `/users/${userId}` : '', enabled: !!userId });
 * // 또는 enabled: false 로 두고 나중에 refetch()
 * const { data, refetch } =
 *   useGetApi<RESPONSE_TYPE>({ url: '/GET_URL', enabled: false });
 * // ...어떤 시점에
 * refetch();
 */

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
