import type { CafeReview } from '../../../schemas/cafeReviewSchema';

import styles from './MapSubPanelReviews.module.scss';

interface MapSubPanelReviewsProps {
  reviewList: CafeReview[];
}

const MapSubPanelReviews: React.FC<MapSubPanelReviewsProps> = ({ reviewList }) => {
  return (
    <div className={styles.reviews}>
      {reviewList.map(review => (
        <div key={review.userId} className={styles.reviews__item}>
          <div className={styles.reviews__item__profileImg}>
            <img src={review.profileImageUrl} alt="Avatar" />
          </div>
          <div className={styles.reviews__item__left}>
            <div className={styles.reviews__item__left__nickname}>{review.nickname}</div>
            <div className={styles.reviews__item__left__reviews}>
              {review.cafeReviewTag.map((tag, index) => (
                <div key={index} className={styles.reviews__item__left__reviews__tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapSubPanelReviews;
