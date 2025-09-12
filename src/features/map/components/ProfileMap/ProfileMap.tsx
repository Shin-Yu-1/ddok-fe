import { useRef, useState } from 'react';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import { useGetProfileMap } from '../../hooks/useGetProfileMap';
import type { MapBounds } from '../../schemas/mapItemSchema';

import styles from './ProfileMap.module.scss';

interface ProfileMapProps {
  playerId: number;
  location: {
    address?: string; // 전체 주소
    region1depthName?: string; // 시도 (예: 부산광역시)
    region2depthName?: string; // 구군 (예: 해운대구)
    region3depthName?: string; // 동면 (예: 우동)
    roadName?: string; // 도로명 (예: 센텀중앙로)
    mainBuildingNo?: string; // 주번지 (예: 90)
    subBuildingNo?: string; // 부번지 (예: '')
    zoneNo?: string; // 우편번호 (예: 48058)
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
  const { data: profileMapData } = useGetProfileMap({
    playerId,
    mapBounds,
    enabled: !!mapBounds && !!playerId,
  });

  // 지도가 로드된 후 mapBounds 설정
  const handleMapLoad = () => {
    if (mapRef.current) {
      const newMapBounds = {
        swLat: mapRef.current.getBounds().getSouthWest().getLat(),
        swLng: mapRef.current.getBounds().getSouthWest().getLng(),
        neLat: mapRef.current.getBounds().getNorthEast().getLat(),
        neLng: mapRef.current.getBounds().getNorthEast().getLng(),
        lat: mapRef.current.getCenter().getLat(),
        lng: mapRef.current.getCenter().getLng(),
      };
      setMapBounds(newMapBounds);
    }
  };

  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ['services'],
  });

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
        onTileLoaded={() => {
          if (mapRef.current && !mapBounds) {
            handleMapLoad();
          }
        }}
      >
        {/* 플레이어 중심 좌표 */}
        <MapMarker
          position={{ lat: location.latitude, lng: location.longitude }}
          image={{
            src: '/src/assets/images/DDOK/DDOK-Mascot.svg',
            size: { width: 40, height: 40 },
          }}
        />

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
