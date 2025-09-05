import styles from './User.module.scss';

const User = () => {
  return (
    <div className={styles.user}>
      <div className={styles.user__item}>
        <div className={styles.user__item__left}>
          <img
            className={styles.user__item__left__img}
            src="/src/assets/images/avatar.png"
            alt="Banner"
          />
          <div className={styles.user__item__left__nickname}>용</div>
          <div className={styles.user__item__left__badges}>배지 리스트 표시</div>
        </div>
        <div className={styles.user__item__right}>
          <div className={styles.user__item__right__position}>풀스택</div>
          <div className={styles.user__item__right__temperature}>36.5℃</div>
        </div>
      </div>
    </div>
  );
};

export default User;
