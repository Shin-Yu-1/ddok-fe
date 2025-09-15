import { useRef, useState } from 'react';

import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
  ZoomControl,
} from 'react-kakao-maps-sdk';

import DDOKMascotIcon from '@/assets/images/DDOK/DDOK-Mascot.svg';
import Button from '@/components/Button/Button';

import { useGetProfileMap } from '../../hooks/useGetProfileMap';
import type { MapBounds } from '../../schemas/mapItemSchema';
import type { ProfileMapItem } from '../../schemas/profileMapSchema';

import InfoOverlay from './InfoOverlay/InfoOverlay';
import styles from './ProfileMap.module.scss';

interface ProfileMapProps {
  playerId: number;
  location: {
    address?: string;
    region1depthName?: string;
    region2depthName?: string;
    region3depthName?: string;
    roadName?: string;
    mainBuildingNo?: string;
    subBuildingNo?: string;
    latitude: number;
    longitude: number;
  };
}

const ProfileMap = ({ playerId, location }: ProfileMapProps) => {
  // 지도의 정보를 담는 ref
  const mapRef = useRef<kakao.maps.Map>(null);

  // 지도 사각 영역에 대한 정보
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  // 지도가 초기 위치에서 벗어났는지 확인하는 상태
  const [isMapMoved, setIsMapMoved] = useState(false);

  // 아이템의 고유 ID를 가져오는 헬퍼 함수
  const getItemId = (item: ProfileMapItem): number => {
    return item.category === 'project' ? item.projectId : item.studyId;
  };

  // 아이템을 ID로 찾는 헬퍼 함수
  const findItemById = (
    items: ProfileMapItem[],
    id: number,
    category: string
  ): ProfileMapItem | undefined => {
    return items.find(item => item.category === category && getItemId(item) === id);
  };

  // 프로필 지도 데이터 조회
  const { data: profileMapData } = useGetProfileMap({
    playerId,
    mapBounds,
    enabled: !!mapBounds && !!playerId,
  });

  // 지도가 로드된 후 mapBounds 설정
  const handleMapLoad = () => {
    updateMapBounds();
  };

  // 지도 영역 업데이트 함수
  const updateMapBounds = () => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const currentLevel = mapRef.current.getLevel();

      // 초기 위치와 현재 위치/줌 레벨 비교 (약간의 오차 허용)
      const centerMoved =
        Math.abs(currentCenter.getLat() - location.latitude) > 0.001 ||
        Math.abs(currentCenter.getLng() - location.longitude) > 0.001;
      const levelChanged = currentLevel !== 5;

      setIsMapMoved(centerMoved || levelChanged);

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

  // 지도 이동/줌 변경 시 호출
  const handleMapChange = () => {
    updateMapBounds();
  };

  // 오버레이의 열림/닫힘 상태
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // 커스텀 오버레이에 전달할 마커의 좌표, 타입 및 ID
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
    category: string;
    id: number;
  } | null>(null);

  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ['services'],
  });

  return (
    <div className={styles.container}>
      <Map
        className={styles.map}
        center={{ lat: location.latitude, lng: location.longitude }}
        draggable={true}
        zoomable={true}
        ref={mapRef}
        level={5}
        onLoad={handleMapLoad}
        onTileLoaded={() => {
          if (mapRef.current && !mapBounds) {
            handleMapLoad();
          }
        }}
        onDragEnd={handleMapChange}
        onZoomChanged={handleMapChange}
        onCenterChanged={handleMapChange}
      >
        {/* 줌 레벨 컨트롤 */}
        <ZoomControl position="BOTTOMRIGHT" />

        {/* 플레이어 중심 좌표 */}
        <MapMarker
          position={{ lat: location.latitude, lng: location.longitude }}
          image={{
            src: DDOKMascotIcon,
            size: { width: 40, height: 40 },
          }}
        />

        {/* 마커 */}
        {profileMapData?.data &&
          profileMapData.data.map(item => (
            <MapMarker
              key={`marker__${item.location.latitude}-${item.location.longitude}-${getItemId(item)}`}
              position={{ lat: item.location.latitude, lng: item.location.longitude }}
              onClick={() => {
                setSelectedPoint({
                  lat: item.location.latitude,
                  lng: item.location.longitude,
                  category: item.category,
                  id: getItemId(item),
                });
                setIsOverlayOpen(true);
              }}
            />
          ))}

        {/* 커스텀 오버레이 */}
        {isOverlayOpen &&
          selectedPoint &&
          profileMapData?.data &&
          (() => {
            const selectedItem = findItemById(
              profileMapData.data,
              selectedPoint.id,
              selectedPoint.category
            );
            return selectedItem ? (
              <CustomOverlayMap position={selectedPoint} yAnchor={1.2}>
                <InfoOverlay item={selectedItem} onOverlayClose={() => setIsOverlayOpen(false)} />
              </CustomOverlayMap>
            ) : null;
          })()}
      </Map>

      {/* 사용자 기존 위치로 되돌아가는 버튼 */}
      {isMapMoved && (
        <Button
          fontSize={12}
          width="fit-content"
          height="fit-content"
          backgroundColor="var(--blue-1)"
          textColor="var(--white-3)"
          className={styles.resetButton}
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setCenter(
                new kakao.maps.LatLng(location.latitude, location.longitude)
              );
              mapRef.current.setLevel(5);
              setIsMapMoved(false); // 버튼 클릭 후 상태 초기화
            }
          }}
        >
          사용자 위치로 돌아가기
        </Button>
      )}
    </div>
  );
};

export default ProfileMap;
