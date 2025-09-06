import { useGetApi } from '@/hooks/useGetApi';

import type { MapSearchResponse } from '../schemas/mapSearchSchema';
import type { MapPanelItem } from '../types';
import type { MapBounds } from '../types/common';

interface UseMapSearchOptions {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  category?: string;
  filter?: string;
}

/**
 * 지도 검색을 위한 React Query 훅
 *
 * @param mapBounds - 지도의 사각형 영역 정보
 * @param options - React Query 옵션 (enabled, page, pageSize, category, filter)
 * @returns 지도 검색 결과
 */
export const useMapSearch = (mapBounds: MapBounds | null, options: UseMapSearchOptions = {}) => {
  const { enabled = true, page = 0, pageSize = 5, category, filter } = options;

  const params = mapBounds
    ? {
        swLat: mapBounds.swLat,
        swLng: mapBounds.swLng,
        neLat: mapBounds.neLat,
        neLng: mapBounds.neLng,
        lat: mapBounds.lat,
        lng: mapBounds.lng,
        page,
        size: pageSize,
        ...(category && { category }),
        ...(filter && { filter }),
      }
    : undefined;

  const result = useGetApi<MapSearchResponse>({
    url: '/api/map/search',
    params,
    enabled: enabled && !!mapBounds,
  });

  // response.data.data를 더 구체적으로 노출
  return {
    ...result,
    data: result.data?.data?.items as MapPanelItem[] | undefined,
    pagination: result.data?.data?.pagination,
  };
};
