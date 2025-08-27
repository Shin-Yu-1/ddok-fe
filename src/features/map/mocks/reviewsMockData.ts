/**
 * 서브 패널에서 사용할 리뷰 목 데이터
 */

export const reviewsMockData = {
  cafeId: 1,
  title: '구지라지 카페',
  pagination: {
    currentPage: 0,
    pageSize: 4,
    totalPages: 1,
    totalItems: 2,
  },
  cafeReviews: [
    {
      userId: 1,
      nickname: '용',
      profileImageUrl: '/src/assets/images/avatar.png',
      rating: 1.5,
      cafeReviewTag: ['분위기가 나빠요', '시끄러워요'],
      createdAt: '2025-08-14',
      updatedAt: '2025-08-22',
    },
    {
      userId: 2,
      nickname: '건',
      profileImageUrl: '/src/assets/images/avatar.png',
      rating: 3,
      cafeReviewTag: ['오래 머무르기 좋아요', '직원이 친절해요', '조명이 밝아요'],
      createdAt: '2025-08-14',
      updatedAt: '2025-08-22',
    },
    {
      userId: 3,
      nickname: '소',
      profileImageUrl: '/src/assets/images/avatar.png',
      rating: 4.5,
      cafeReviewTag: ['분위기가 좋아요', '조용해요'],
      createdAt: '2025-08-14',
      updatedAt: '2025-08-22',
    },
    {
      userId: 4,
      nickname: '재',
      profileImageUrl: '/src/assets/images/avatar.png',
      rating: 5,
      cafeReviewTag: ['분위기가 좋아요', '위기의 맛집', '가성비가 좋아요'],
      createdAt: '2025-08-14',
      updatedAt: '2025-08-22',
    },
  ],
};
