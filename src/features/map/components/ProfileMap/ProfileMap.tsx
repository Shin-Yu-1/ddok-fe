import { useRef, useState } from 'react';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import { useGetProfileMap } from '../../hooks/useGetProfileMap';
import type { MapBounds } from '../../types/common';

import styles from './ProfileMap.module.scss';

interface ProfileMapProps {
  playerId: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const ProfileMap = ({ playerId, location }: ProfileMapProps) => {
  // 지도의 정보를 담는 ref
  const mapRef = useRef<kakao.maps.Map>(null);

  // 지도 사각 영역에 대한 정보
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  // 프로필 지도 데이터 조회
  const { data: profileMapData, isError } = useGetProfileMap({
    playerId,
    mapBounds,
    enabled: !!mapBounds && !!playerId,
  });

  // 지도가 로드된 후 mapBounds 설정
  const handleMapLoad = () => {
    if (mapRef.current) {
      setMapBounds({
        swLat: mapRef.current.getBounds().getSouthWest().getLat(),
        swLng: mapRef.current.getBounds().getSouthWest().getLng(),
        neLat: mapRef.current.getBounds().getNorthEast().getLat(),
        neLng: mapRef.current.getBounds().getNorthEast().getLng(),
        lat: mapRef.current.getCenter().getLat(),
        lng: mapRef.current.getCenter().getLng(),
      });
    }
  };

  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_API_KEY, libraries: ['services'] });

  // 로딩 중이거나 에러 상태 처리
  if (isError) {
    console.error('프로필 지도 데이터를 가져오는 중 오류가 발생했습니다.');
  }

  return (
    <div className={styles.container}>
      <Map
        className={styles.map}
        center={{ lat: location.latitude, lng: location.longitude }}
        draggable={false}
        zoomable={false}
        ref={mapRef}
        level={5}
        onLoad={handleMapLoad}
      >
        {/* 마커 */}
        {profileMapData?.data &&
          profileMapData.data.map(item => (
            <MapMarker
              key={`marker__${item.location.latitude}-${item.location.longitude}`}
              position={{ lat: item.location.latitude, lng: item.location.longitude }}
            />
          ))}
      </Map>
    </div>
  );
};

export default ProfileMap;
