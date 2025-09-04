import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';

import styles from './ProfileMap.module.scss';

const ProfileMap = () => {
  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_API_KEY, libraries: ['services'] });

  return (
    <div className={styles.container}>
      <Map
        className={styles.map}
        center={{ lat: 37.5665, lng: 126.978 }}
        draggable={false}
        zoomable={false}
      />
    </div>
  );
};

export default ProfileMap;
