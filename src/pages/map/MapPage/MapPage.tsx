import { useState } from 'react';

import { CustomOverlayMap, Map, MapMarker, ZoomControl } from 'react-kakao-maps-sdk';

import MapOverlay from '@/features/map/components/MapOverlay/MapOverlay';
import MapPanel from '@/features/map/components/MapPanel/MapPanel';
import MapSubPanel from '@/features/map/components/MapSubPanel/MapSubPanel';
import { MapOverlayType } from '@/features/map/constants/MapOverlayType';

import styles from './MapPage.module.scss';

const MapPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  const [isMapSubPanelOpen, setIsMapSubPanelOpen] = useState(false);

  // 임시 마커 배열
  const [points] = useState<{ lat: number; lng: number }[]>([
    { lat: 37.5665, lng: 126.978 },
    { lat: 37.566, lng: 126.98 },
  ]);

  const handleMapPanelToggle = () => {
    if (isMapPanelOpen) {
      setIsMapSubPanelOpen(false);
    }
    setIsMapPanelOpen(!isMapPanelOpen);
  };

  const handleSubPanelToggle = () => {
    if (!isMapPanelOpen) return setIsMapSubPanelOpen(false);
    setIsMapSubPanelOpen(prev => !prev);
  };

  // 커스텀 오버레이에 전달할 마커의 좌표
  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lng: number } | null>(null);

  // TODO: center 이동 / level 변경 / bounds 변경 이벤트들을 감지하여 서브 패널 리로드

  return (
    <div className={styles.container}>
      <div className={styles.map__header}>HEADER</div>
      <div className={styles.map__subHeader}>SUBHEADER</div>
      <div className={styles.map__content}>
        {/* 서브 패널 토글을 위한 임시 사이드바 */}
        <div className={styles.map__sidebar}>
          <div className={styles.map__sidebarToggleBtn} onClick={() => handleMapPanelToggle()}>
            {isMapPanelOpen ? 'CLOSE' : 'OPEN'}
          </div>
        </div>

        <div className={styles.map__container}>
          {/* TODO: 초기 로드 위치를 사용자 위치로 설정해야 함 */}
          <Map id="map" className={styles.map} center={{ lat: 37.5665, lng: 126.978 }}>
            {/* 컨트롤 */}
            <ZoomControl position="TOPRIGHT" />

            {/* 마커 */}
            {points.map(point => (
              <MapMarker
                key={`marker__${point.lat}-${point.lng}`}
                position={point}
                onClick={() => {
                  setIsOverlayOpen(true);
                  setSelectedPoint(point);
                }}
              ></MapMarker>
            ))}

            {/* 오버레이 */}
            {isOverlayOpen && selectedPoint && (
              <CustomOverlayMap position={selectedPoint} yAnchor={1.13}>
                <MapOverlay
                  onOverlayClose={() => setIsOverlayOpen(false)}
                  overlayType={MapOverlayType.PROJECT}
                />
              </CustomOverlayMap>
            )}
          </Map>
        </div>
      </div>

      {/* 지도 패널 */}
      {isMapPanelOpen && (
        <div className={styles.map__panelContainer}>
          <MapPanel
            isMapPanelOpen={isMapPanelOpen}
            handleSubPanelToggle={handleSubPanelToggle}
            isMapSubPanelOpen={isMapSubPanelOpen}
          />
        </div>
      )}

      {/* 지도 서브 패널 */}
      {isMapSubPanelOpen && (
        <div className={styles.map__subPanelContainer}>
          <MapSubPanel />
        </div>
      )}
    </div>
  );
};

export default MapPage;
