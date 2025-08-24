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
