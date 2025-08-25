import { reviewMockData } from '../../mocks/reviewMockData';

import styles from './MapSubPanel.module.scss';

const reviewData = reviewMockData[0];

const MapSubPanel = () => {
  return (
    <div className={styles.subPanel__container}>
      {/* 서브 패널 타이틀*/}
      <div className={styles.subPanel__title}>{reviewData.title}</div>
      <div>작성된 후기 {reviewData.reviewCount}건</div>
      <div>평점 {reviewData.totalRating}점</div>
      {/* 리뷰 태그 */}
      {reviewData.cafeReviewTag.map(tag => (
        <div key={tag.tagName}>
          {tag.tagName} {tag.tagCount}건
        </div>
      ))}
    </div>
  );
};

export default MapSubPanel;
