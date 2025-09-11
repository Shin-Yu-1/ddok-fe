import { useRef, useState } from 'react';

import { CustomOverlayMap, Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import { useGetProfileMap } from '../../hooks/useGetProfileMap';
import type { MapBounds } from '../../schemas/mapItemSchema';

import styles from './ProfileMap.module.scss';

interface ProfileMapProps {
  playerId: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

const ProfileMap = ({ playerId, location }: ProfileMapProps) => {
  // 지도의 정보를 담는 ref
  const mapRef = useRef<kakao.maps.Map>(null);

  // 지도 사각 영역에 대한 정보
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  // 오버레이 열림 상태
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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
          onClick={() => {
            setIsOverlayOpen(true);
          }}
        />

        {/* 플레이어 중심 좌표 오버레이 */}
        {isOverlayOpen && (
          <CustomOverlayMap
            position={{ lat: location.latitude, lng: location.longitude }}
            yAnchor={2.5}
          >
            <div className={styles.overlay}>
              <div>{location.address}</div>
            </div>
          </CustomOverlayMap>
        )}

        {/* 마커 */}
        {profileMapData?.data &&
          profileMapData.data.map(item => (
            <MapMarker
              key={`marker__${item.location.latitude}-${item.location.longitude}`}
              position={{ lat: item.location.latitude, lng: item.location.longitude }}
            />
          ))}
      </Map>
      <div className={styles.blocker}></div>
    </div>
  );
};

export default ProfileMap;
