import { useGetApi } from '@/hooks/useGetApi';

import type { CafeStatResponse } from '../schemas/cafeStatSchema';

interface UseGetCafeStatOptions {
  cafeId: number;
  enabled?: boolean;
}

/**
 * 카페 통계 정보를 가져오는 리액트 쿼리 hook
 *
 * @param cafeId - 조회할 카페 ID
 * @param enabled - 쿼리 실행 여부 (기본값: true)
 * @returns 카페 통계 정보 쿼리 결과
 */
export const useGetCafeStat = ({ cafeId, enabled = true }: UseGetCafeStatOptions) => {
  return useGetApi<CafeStatResponse>({
    url: `/api/map/cafes/${cafeId}/stats`,
    enabled: enabled && !!cafeId,
  });
};
