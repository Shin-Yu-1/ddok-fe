import { useState } from 'react';

import { CustomOverlayMap, Map, MapMarker, ZoomControl } from 'react-kakao-maps-sdk';

import styles from './MapPage.module.scss';
import MapSubPanel from './MapSubPanel';
import Overlay from './Overlay';
import { OverlayType } from './OverlayType';

const MapPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMapSubPanelOpen, setIsMapSubPanelOpen] = useState(false);

  const [points] = useState<{ lat: number; lng: number }[]>([
    { lat: 37.5665, lng: 126.978 },
    { lat: 37.566, lng: 126.98 },
  ]);

  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.map__header}>HEADER</div>
      <div className={styles.map__subHeader}>SUBHEADER</div>
      <div className={styles.map__content}>
        <div className={styles.map__sidebar}>
          <div
            className={styles.map__sidebarToggleBtn}
            onClick={() => setIsMapSubPanelOpen(!isMapSubPanelOpen)}
          >
            {isMapSubPanelOpen ? 'CLOSE' : 'OPEN'}
          </div>
        </div>
        <div className={styles.map__container}>
          <Map id="map" className={styles.map} center={{ lat: 37.5665, lng: 126.978 }}>
            <ZoomControl position="TOPRIGHT" />
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
            {isOverlayOpen && selectedPoint && (
              <CustomOverlayMap position={selectedPoint} yAnchor={1.2}>
                <Overlay
                  onOverlayClose={() => setIsOverlayOpen(false)}
                  overlayType={OverlayType.project}
                />
              </CustomOverlayMap>
            )}
          </Map>
        </div>
      </div>
      {isMapSubPanelOpen && (
        <div className={styles.map__subPanelContainer}>
          <MapSubPanel isOpen={isMapSubPanelOpen} />
        </div>
      )}
    </div>
  );
};

export default MapPage;
