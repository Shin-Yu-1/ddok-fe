import type { BaseMapItem } from './common';

/**
 * 카페 관련 타입 정의
 */

export interface CafeReviewTag {
  tagName: string;
  tagCount: number;
}

export interface CafeStat {
  cafeId: number;
  title: string;
  reviewCount: number;
  cafeReviewTag: CafeReviewTag[];
  totalRating: number;
}

export interface CafeReview {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  rating: number;
  cafeReviewTag: string[];
  createdAt: string;
  updatedAt: string;
}

// TODO: Response는 추후 별도의 파일로 분리 예정
export interface CafeReviewResponse {
  cafeId: number;
  title: string;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  cafeReviews: CafeReview[];
}

export interface Cafe extends BaseMapItem {
  category: 'cafe';
  cafeId: number;
  title: string;
  bannerImageUrl: string;
}

export interface CafeOverlayData {
  category: string;
  cafeId: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  address: string;
}
