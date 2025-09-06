import { useEffect, useRef, useState } from 'react';

import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

import { useGetProfileMap } from '../../hooks/useGetProfileMap';
import type { MapBounds } from '../../types/common';

import styles from './ProfileMap.module.scss';

interface ProfileMapProps {
  playerId: number;
}

const ProfileMap = ({ playerId }: ProfileMapProps) => {
  // 지도의 정보를 담는 ref
  const mapRef = useRef<kakao.maps.Map>(null);

  // 지도 사각 영역에 대한 정보
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  // 사용자 위치 좌표 상태 - 기본값 서울시청으로 설정
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 37.5665, lng: 126.978 });

  // 프로필 지도 데이터 조회
  const { data: profileMapData, isError } = useGetProfileMap({
    playerId,
    mapBounds,
    enabled: !!mapBounds && !!playerId,
  });

  // 세션 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    try {
      const userDataString = sessionStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData.location && userData.location.latitude && userData.location.longitude) {
          setUserLocation({
            lat: userData.location.latitude,
            lng: userData.location.longitude,
          });
        }
      }
    } catch (error) {
      console.error('세션 스토리지에서 사용자 위치 정보를 가져오는 중 오류 발생:', error);
      // 오류 발생 시 기본 위치 사용 (서울시청)
      setUserLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, []);

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
        center={userLocation}
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
