import { useGetApi } from '@/hooks/useGetApi';

import type { MapSearchResponse } from '../schemas/mapSearchSchema';
import type { MapPanelItem } from '../types';
import type { MapBounds } from '../types/common';

/**
 * 지도 검색을 위한 React Query 훅
 *
 * @param mapBounds - 지도의 사각형 영역 정보
 * @param options - React Query 옵션
 * @returns 지도 검색 결과
 */
export const useMapSearch = (
  mapBounds: MapBounds | null,
  options: {
    enabled?: boolean;
  } = {}
) => {
  const { enabled = true } = options;

  const params = mapBounds
    ? {
        swLat: mapBounds.swLat,
        swLng: mapBounds.swLng,
        neLat: mapBounds.neLat,
        neLng: mapBounds.neLng,
        lat: mapBounds.lat,
        lng: mapBounds.lng,
      }
    : undefined;

  const result = useGetApi<MapSearchResponse>({
    url: '/api/map/search',
    params,
    enabled: enabled && !!mapBounds,
  });

  // response.data.data를 data로 노출하여 사용하기 편하게 함
  return {
    ...result,
    data: result.data?.data as MapPanelItem[] | undefined,
  };
};
