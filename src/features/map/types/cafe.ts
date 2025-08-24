import type { BaseMapItem } from './common';

/**
 * 카페 관련 타입 정의
 */

export interface Cafe extends BaseMapItem {
  category: 'cafe';
  cafeId: number;
  title: string;
  bannerImageUrl: string;
}

// 카페 생성/수정 시 사용할 입력 타입
export interface CafeInput {
  title: string;
  bannerImageUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// 카페 리스트 아이템 (요약 정보)
export interface CafeSummary {
  cafeId: number;
  title: string;
  location: {
    address: string;
  };
}
