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

export interface Cafe extends BaseMapItem {
  category: 'cafe';
  cafeId: number;
  title: string;
  bannerImageUrl: string;
}
