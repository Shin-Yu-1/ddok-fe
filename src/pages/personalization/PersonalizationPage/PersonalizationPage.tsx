import PersonalizationForm from '@/features/Auth/PersonalizationForm/PersonalizationForm';

import styles from './PersonalizationPage.module.scss';

const PersonalizationPage = () => {
  return (
    <div className={styles.inner}>
      <p className={styles.text}>
        편리한 서비스 이용을 위해 아래 정보가 필요합니다.
        <br />
        해당 정보는 명시된 목적 외에는 이용되지 않습니다.
      </p>
      <PersonalizationForm />
    </div>
  );
};

export default PersonalizationPage;
