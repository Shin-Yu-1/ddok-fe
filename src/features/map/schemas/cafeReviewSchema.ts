import { z } from 'zod';

/**
 * 페이지네이션 정보 스키마
 */
export const PaginationSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
});

/**
 * 개별 리뷰
 */
export const CafeReviewSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  rating: z.number(),
  cafeReviewTag: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * 리뷰 리스트 조회 API 데이터 스키마
 */
export const CafeReviewDataSchema = z.object({
  cafeId: z.number(),
  title: z.string(),
  pagination: PaginationSchema,
  cafeReviews: z.array(CafeReviewSchema),
});

/**
 * 리뷰 리스트 조회 API 응답 스키마
 */
export const CafeReviewResponseSchema = z.object({
  data: CafeReviewDataSchema,
  message: z.string(),
  status: z.number(),
});

/**
 * 페이지네이션 정보 타입
 */
export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * 개별 리뷰 타입
 */
export type CafeReview = z.infer<typeof CafeReviewSchema>;

/**
 * 리뷰 리스트 조회 API 데이터 타입
 */
export type CafeReviewData = z.infer<typeof CafeReviewDataSchema>;

/**
 * 리뷰 리스트 조회 API 응답 타입
 */
export type CafeReviewResponse = z.infer<typeof CafeReviewResponseSchema>;
