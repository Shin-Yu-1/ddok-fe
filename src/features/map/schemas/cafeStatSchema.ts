import { z } from 'zod';

/**
 * 리뷰 내 평가 태그
 */
export const CafeReviewTagSchema = z.object({
  tagName: z.string(),
  tagCount: z.number(),
});
/**
 * 리뷰 내 평가 태그 타입
 */
export type CafeReview = z.infer<typeof CafeReviewTagSchema>;

/**
 * 리뷰 통계 정보
 */
export const CafeStatSchema = z.object({
  cafeId: z.number(),
  title: z.string(),
  reviewCount: z.number(),
  cafeReviewTag: z.array(CafeReviewTagSchema),
  totalRating: z.number(),
});
/**
 * 리뷰 통계 정보 타입
 */
export type CafeStat = z.infer<typeof CafeStatSchema>;

/**
 * 리뷰 통계 조회 API 응답 스키마
 */
export const CafeStatResponseSchema = z.object({
  data: CafeStatSchema,
  message: z.string(),
  status: z.number(),
});

/**
 * 리뷰 통계 조회 API 응답 타입
 */
export type CafeStatResponse = z.infer<typeof CafeStatResponseSchema>;
