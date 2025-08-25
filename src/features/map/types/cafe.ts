import type { BaseMapItem } from './common';

/**
 * 카페 관련 타입 정의
 */

export interface CafeReview {
  cafeId: number;
  title: string;
  reviewCount: number;
  cafeReviewTag: {
    tagName: string;
    tagCount: number;
  }[];
  totalRating: number;
}

export interface Cafe extends BaseMapItem {
  category: 'cafe';
  cafeId: number;
  title: string;
  bannerImageUrl: string;
}
