import type { CafeReview } from '../types/cafe';

export const reviewMockData: CafeReview[] = [
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
];
