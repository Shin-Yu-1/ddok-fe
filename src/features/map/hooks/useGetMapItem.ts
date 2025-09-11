import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/api';

import type { MapBounds } from '../schemas/mapItemSchema';
import type { MapItem } from '../types';
import { MapItemCategory } from '../types/common';

interface MapItemResponse {
  status: number;
  message: string;
  data: MapItem[];
}

interface UseGetMapItemOptions {
  mapBounds?: MapBounds;
  category?: MapItemCategory | null;
  enabled?: boolean;
}

/**
 * 지도 영역 내의 아이템들을 가져오는 훅
 */

const fetcher = async (
  mapBounds: MapBounds,
  category?: MapItemCategory | null
): Promise<MapItem[]> => {
  const { swLat, swLng, neLat, neLng, lat, lng } = mapBounds;

  const params = {
    swLat,
    swLng,
    neLat,
    neLng,
    lat,
    lng,
  };

  let url = '/api/map/all';

  // 카테고리가 지정된 경우 해당 카테고리의 엔드포인트 사용
  if (category) {
    switch (category) {
      case MapItemCategory.PROJECT:
        url = '/api/map/projects';
        break;
      case MapItemCategory.STUDY:
        url = '/api/map/studies';
        break;
      case MapItemCategory.PLAYER:
        url = '/api/map/players';
        break;
      case MapItemCategory.CAFE:
        url = '/api/map/cafes';
        break;
      default:
        url = '/api/map/all';
    }
  }

  const { data } = await api.get<MapItemResponse>(url, { params });
  return data.data;
};

export const useGetMapItem = ({ mapBounds, category, enabled = true }: UseGetMapItemOptions) => {
  return useQuery({
    queryKey: ['getMapItem', mapBounds, category],
    queryFn: () => {
      if (!mapBounds) {
        throw new Error('MapBounds is required');
      }
      return fetcher(mapBounds, category);
    },
    enabled: enabled && !!mapBounds,
  });
};
