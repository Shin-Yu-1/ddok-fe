import { useState } from 'react';

import { CustomOverlayMap, Map, MapMarker, ZoomControl } from 'react-kakao-maps-sdk';

import Button from '@/components/Button/Button';
import MapOverlay from '@/features/map/components/MapOverlay/MapOverlay';
import MapPanel from '@/features/map/components/MapPanel/MapPanel';
import MapSubPanel from '@/features/map/components/MapSubPanel/MapSubPanel';
import { mapMockData } from '@/features/map/mocks/mapMockData';

import styles from './MapPage.module.scss';

const MapPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  const [isMapSubPanelOpen, setIsMapSubPanelOpen] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
  const [isMapChanged, setIsMapChanged] = useState(false);

  const handleMapPanelToggle = () => {
    if (isMapPanelOpen) {
      setIsMapSubPanelOpen(false);
      setSelectedCafeId(null);
    }
    setIsMapPanelOpen(!isMapPanelOpen);
  };

  const handleItemClick = (itemType: 'project' | 'study' | 'player' | 'cafe', itemId?: number) => {
    if (!isMapPanelOpen) return;

    if (itemType === 'cafe' && itemId !== undefined) {
      // 카페 아이템 클릭 시
      if (selectedCafeId === itemId && isMapSubPanelOpen) {
        // 같은 카페를 다시 클릭했고 서브패널이 열려있으면 닫기
        setIsMapSubPanelOpen(false);
        setSelectedCafeId(null);
      } else {
        // 다른 카페를 클릭했거나 처음 클릭하면 해당 카페 데이터로 서브패널 열기
        setSelectedCafeId(itemId);
        setIsMapSubPanelOpen(true);
      }
    } else {
      // project, study, player 클릭 시 서브패널 닫기
      setIsMapSubPanelOpen(false);
      setSelectedCafeId(null);
    }
  };

  // 커스텀 오버레이에 전달할 마커의 좌표 및 타입
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
    type: string;
  } | null>(null);

  // TODO: center 이동 / level 변경 / bounds 변경 이벤트들을 감지하여 서브 패널 리로드

  return (
    <div className={styles.container}>
      <div className={styles.map__header}>HEADER</div>
      <div className={styles.map__subHeader}>SUBHEADER</div>
      <div className={styles.map__content}>
        {/* 패널 토글을 위한 임시 사이드바 */}
        <div className={styles.map__sidebar}>
          <div className={styles.map__sidebarToggleBtn} onClick={() => handleMapPanelToggle()}>
            {isMapPanelOpen ? 'CLOSE' : 'OPEN'}
          </div>
        </div>

        <div className={styles.map__container}>
          {/* TODO: 초기 로드 위치를 사용자 위치로 설정해야 함 */}
          <Map
            id="map"
            className={styles.map}
            center={{ lat: 37.5665, lng: 126.978 }}
            onTileLoaded={() => setIsMapChanged(true)}
          >
            {/* 컨트롤 */}
            <ZoomControl position="TOPRIGHT" />

            {/* 마커 */}
            {mapMockData.map(m => (
              <MapMarker
                key={`marker__${m.location.latitude}-${m.location.longitude}`}
                position={{ lat: m.location.latitude, lng: m.location.longitude }}
                onClick={() => {
                  setIsOverlayOpen(true);
                  setSelectedPoint({
                    lat: m.location.latitude,
                    lng: m.location.longitude,
                    type: m.category,
                  });
                }}
              ></MapMarker>
            ))}

            {/* 오버레이 */}
            {isOverlayOpen && selectedPoint && (
              <CustomOverlayMap position={selectedPoint} yAnchor={1.13}>
                <MapOverlay
                  onOverlayClose={() => setIsOverlayOpen(false)}
                  overlayType={selectedPoint.type as 'project' | 'study' | 'player' | 'cafe'}
                />
              </CustomOverlayMap>
            )}
          </Map>
        </div>
      </div>

      {/* 지도 리로드 버튼 */}
      {isMapChanged && (
        <Button
          className={styles.map__reloadBtn}
          fontSize="var(--fs-xxxsmall)"
          backgroundColor="var(--blue-1)"
          width="fit-content"
          height="fit-content"
          textColor="var(--white-1)"
          onClick={() => setIsMapChanged(false)}
        >
          현 지도에서 검색
        </Button>
      )}

      {/* 지도 패널 */}
      {isMapPanelOpen && (
        <div className={styles.map__panelContainer}>
          <MapPanel handleItemClick={handleItemClick} />
        </div>
      )}

      {/* 지도 서브 패널 */}
      {isMapSubPanelOpen && selectedCafeId && (
        <div className={styles.map__subPanelContainer}>
          <MapSubPanel cafeId={selectedCafeId} />
          <div
            className={styles.subPanel__closeBtn}
            onClick={() => {
              setIsMapSubPanelOpen(false);
              setSelectedCafeId(null);
            }}
          >
            {'<'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
