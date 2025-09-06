import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';

import type { ProfileMapResponse } from '../schemas/profileMapSchema';
import type { MapBounds } from '../types/common';

interface UseGetProfileMapParams {
  playerId: number | null;
  mapBounds: MapBounds | null;
  enabled?: boolean;
}

/**
 * 프로필 지도 조회 API 훅
 * @param playerId - 플레이어 ID
 * @param mapBounds - 지도 경계 정보
 * @param enabled - 쿼리 활성화 여부
 */
export const useGetProfileMap = ({
  playerId,
  mapBounds,
  enabled = true,
}: UseGetProfileMapParams) => {
  const queryParams = mapBounds
    ? {
        swLat: mapBounds.swLat,
        swLng: mapBounds.swLng,
        neLat: mapBounds.neLat,
        neLng: mapBounds.neLng,
      }
    : {};

  return useQuery({
    queryKey: ['profileMap', playerId, queryParams],
    queryFn: async () => {
      const { data } = await api.get<ProfileMapResponse>(`/api/players/${playerId}/profile/map`, {
        params: queryParams,
      });
      return data;
    },
    enabled: enabled && !!mapBounds && !!playerId,
  });
};
