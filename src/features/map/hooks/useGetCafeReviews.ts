import { useGetApi } from '@/hooks/useGetApi';

import type { CafeReviewResponse } from '../schemas/cafeReviewSchema';

interface UseGetCafeReviewsOptions {
  cafeId: number;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

/**
 * 카페 리뷰 목록을 가져오는 리액트 쿼리 hook
 *
 * @param cafeId - 조회할 카페 ID
 * @param page - 페이지 번호 (기본값: 0)
 * @param pageSize - 페이지 크기 (기본값: 10)
 * @param enabled - 쿼리 실행 여부 (기본값: true)
 * @returns 카페 리뷰 목록 쿼리 결과
 */
export const useGetCafeReviews = ({
  cafeId,
  page = 0,
  pageSize = 10,
  enabled = true,
}: UseGetCafeReviewsOptions) => {
  const params = {
    page,
    size: pageSize,
  };

  const result = useGetApi<CafeReviewResponse>({
    url: `/api/map/cafes/${cafeId}/reviews`,
    params,
    enabled: enabled && !!cafeId,
  });

  // response.data.data를 더 구체적으로 노출
  return {
    ...result,
    data: result.data?.data?.cafeReviews,
    pagination: result.data?.data?.pagination,
    cafeInfo: result.data?.data
      ? {
          cafeId: result.data.data.cafeId,
          title: result.data.data.title,
        }
      : undefined,
  };
};
