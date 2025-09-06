import type { BaseMapItem } from './common';

/**
 * 카페 관련 타입 정의
 */

/** 개별 리뷰 */
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

/** 지도상의 추천 장소 정보 */
export interface CafeMapItem extends BaseMapItem {
  cafeId: number;
  title: string;
}

/** 패널의 추천 장소 아이템 정보 */
export interface CafePanelItem extends CafeMapItem {
  bannerImageUrl: string;
}

/** 추천 장소 오버레이 정보 */
export interface CafeOverlayData {
  category: string;
  cafeId: number;
  title: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  address: string;
}
