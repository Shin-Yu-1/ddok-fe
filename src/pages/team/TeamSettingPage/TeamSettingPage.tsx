import Button from '@/components/Button/Button';

import styles from './TeamSettingPage.module.scss';

const TeamSettingPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>'프로젝트/스터디 팀명' 관리 페이지</h1>

      <section className={styles.wrapper}>
        <div className={styles.label}>팀원</div>
        <div className={styles.membersGrid}>
          <div className={styles.gridLabel}>담당 포지션</div>
          <div className={styles.gridLabel}>멤버</div>
          <div className={styles.gridLabel}>액션</div>

          <div className={styles.position}>팀장</div>
          <div className={styles.member}>
            <div className={styles.member__item}>
              <div className={styles.member__item__left}>
                <img
                  className={styles.member__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.member__item__left__nickname}>용</div>
                <div className={styles.member__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.member__item__right}>
                <div className={styles.member__item__right__position}>풀스택</div>
                <div className={styles.member__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>

          <div className={styles.position}>풀스택</div>
          <div className={styles.member}>
            <div className={styles.member__item}>
              <div className={styles.member__item__left}>
                <img
                  className={styles.member__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.member__item__left__nickname}>쏘</div>
                <div className={styles.member__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.member__item__right}>
                <div className={styles.member__item__right__position}>풀스택</div>
                <div className={styles.member__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>

          <div className={styles.position}>프론트엔드</div>
          <div className={styles.member}>
            <div className={styles.member__item}>
              <div className={styles.member__item__left}>
                <img
                  className={styles.member__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.member__item__left__nickname}>건</div>
                <div className={styles.member__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.member__item__right}>
                <div className={styles.member__item__right__position}>풀스택</div>
                <div className={styles.member__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>

          <div className={styles.position}>풀스택</div>
          <div className={styles.member}>
            <div className={styles.member__item}>
              <div className={styles.member__item__left}>
                <img
                  className={styles.member__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.member__item__left__nickname}>재</div>
                <div className={styles.member__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.member__item__right}>
                <div className={styles.member__item__right__position}>풀스택</div>
                <div className={styles.member__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className={styles.label}>참여 희망자</div>
        <div className={styles.participantsGrid}>
          <div className={styles.gridLabel}>지원 포지션</div>
          <div className={styles.gridLabel}>멤버</div>
          <div className={styles.gridLabel}>액션</div>

          <div className={styles.position}>팀장</div>
          <div className={styles.participant}>
            <div className={styles.participant__item}>
              <div className={styles.participant__item__left}>
                <img
                  className={styles.participant__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.participant__item__left__nickname}>용</div>
                <div className={styles.participant__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.participant__item__right}>
                <div className={styles.participant__item__right__position}>풀스택</div>
                <div className={styles.participant__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>

          <div className={styles.position}>풀스택</div>
          <div className={styles.participant}>
            <div className={styles.participant__item}>
              <div className={styles.participant__item__left}>
                <img
                  className={styles.participant__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.participant__item__left__nickname}>쏘</div>
                <div className={styles.participant__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.participant__item__right}>
                <div className={styles.participant__item__right__position}>풀스택</div>
                <div className={styles.participant__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>

          <div className={styles.position}>프론트엔드</div>
          <div className={styles.participant}>
            <div className={styles.participant__item}>
              <div className={styles.participant__item__left}>
                <img
                  className={styles.participant__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.participant__item__left__nickname}>건</div>
                <div className={styles.participant__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.participant__item__right}>
                <div className={styles.participant__item__right__position}>PM</div>
                <div className={styles.participant__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>

          <div className={styles.position}>풀스택</div>
          <div className={styles.participant}>
            <div className={styles.participant__item}>
              <div className={styles.participant__item__left}>
                <img
                  className={styles.participant__item__left__img}
                  src="/src/assets/images/avatar.png"
                  alt="Banner"
                />
                <div className={styles.participant__item__left__nickname}>재</div>
                <div className={styles.participant__item__left__badges}>배지 리스트 표시</div>
              </div>
              <div className={styles.participant__item__right}>
                <div className={styles.participant__item__right__position}>프론트엔드</div>
                <div className={styles.participant__item__right__temperature}>36.5℃</div>
              </div>
            </div>
          </div>
          <Button
            className={styles.action}
            backgroundColor="var(--gray-1)"
            fontSize="var(--fs-xxsmall)"
            height="28px"
            textColor="var(--white-2)"
            radius="xsm"
            fontWeightPreset="regular"
          >
            추방
          </Button>
        </div>
      </section>

      <section className={styles.settings}>
        <div className={styles.label}>프로젝트 관련 설정</div>
        <div className={styles.settingItem}>
          <div>프로젝트 중도 하차하기</div>
          <Button
            backgroundColor="var(--black-1)"
            textColor="var(--white-3)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            하차하기
          </Button>
        </div>
        <div className={styles.settingItem}>
          <div>프로젝트 종료 및 평가하기</div>
          <Button
            backgroundColor="var(--black-1)"
            textColor="var(--white-3)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            종료 및 평가하기
          </Button>
        </div>
        <div className={styles.settingItem}>
          <div>프로젝트 삭제하기</div>
          <Button
            backgroundColor="var(--gray-4)"
            radius="xsm"
            fontSize="var(--fs-xxsmall)"
            height="35px"
          >
            삭제하기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TeamSettingPage;
