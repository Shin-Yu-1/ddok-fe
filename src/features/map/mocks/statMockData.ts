import type { CafeStat } from '../types/cafe';

/**
 * 서브 패널에서 사용할 통계 목 데이터
 */

export const statMockData: CafeStat[] = [
  {
    cafeId: 1,
    title: '구지라지 카페',
    reviewCount: 193,
    cafeReviewTag: [
      {
        tagName: '분위기가 좋아요',
        tagCount: 32,
      },
      {
        tagName: '음료가 맛있어요',
        tagCount: 25,
      },
      {
        tagName: '직원이 친절해요',
        tagCount: 18,
      },
    ],
    totalRating: 3.9,
  },
  {
    cafeId: 2,
    title: '새로운 카페',
    reviewCount: 1,
    cafeReviewTag: [
      {
        tagName: '별로에요',
        tagCount: 1,
      },
    ],
    totalRating: 1.3,
  },
];
