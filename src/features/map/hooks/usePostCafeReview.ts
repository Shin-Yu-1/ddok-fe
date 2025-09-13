import { usePostApi } from '@/hooks/usePostApi';

interface CafeReviewRequest {
  rating: number;
  cafeReviewTag: string[];
}

interface CafeReviewResponse {
  status: number;
  message: string;
  data: string;
}

interface UsePostCafeReviewOptions {
  cafeId: number;
}

/**
 * 카페 후기를 작성하는 리액트 쿼리 hook
 *
 * @param cafeId - 후기를 작성할 카페 ID
 * @returns 카페 후기 작성 뮤테이션 결과
 */
export const usePostCafeReview = ({ cafeId }: UsePostCafeReviewOptions) => {
  return usePostApi<CafeReviewResponse, CafeReviewRequest>({
    url: `/api/map/cafes/${cafeId}/reviews`,
  });
};
