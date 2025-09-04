import { useState, useEffect, useRef } from 'react';

import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
  ZoomControl,
} from 'react-kakao-maps-sdk';

import Button from '@/components/Button/Button';
import MapCafeOverlay from '@/features/map/components/MapOverlay/MapCafeOverlay/MapCafeOverlay';
import MapPlayerOverlay from '@/features/map/components/MapOverlay/MapPlayerOverlay/MapPlayerOverlay';
import MapProjectOverlay from '@/features/map/components/MapOverlay/MapProjectOverlay/MapProjectOverlay';
import MapStudyOverlay from '@/features/map/components/MapOverlay/MapStudyOverlay/MapStudyOverlay';
import MapPanel from '@/features/map/components/MapPanel/MapPanel';
import MapSubPanel from '@/features/map/components/MapSubPanel/MapSubPanel';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { overlayMockData } from '@/features/map/mocks/overlayMockData';
import { panelMockData } from '@/features/map/mocks/panelMockData';
import type { CafeOverlayData } from '@/features/map/types/cafe';
import type { MapBounds } from '@/features/map/types/common';
import { MapItemCategory } from '@/features/map/types/common';
import type { PlayerOverlayData } from '@/features/map/types/player';
import type { ProjectOverlayData } from '@/features/map/types/project';
import type { StudyOverlayData } from '@/features/map/types/study';
import Sidebar from '@/features/Sidebar/components/Sidebar';
import { useSidebarHandlers } from '@/features/Sidebar/hooks/useSidebarHandlers';

import styles from './MapPage.module.scss';

const MapPage = () => {
  // 지도의 정보를 담는 ref
  const mapRef = useRef<kakao.maps.Map>(null);

  // 패널, 서브패널, 오버레이의 열림/닫힘 상태
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  const [isMapSubPanelOpen, setIsMapSubPanelOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // 현재 선택된 추천 장소의 ID
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(0);

  // 지도 사각 영역에 대한 정보
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  // 지도 사각 영역의 변경 여부
  const [isMapChanged, setIsMapChanged] = useState(false);

  // 커스텀 오버레이에 전달할 마커의 좌표 및 타입
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
    type: string;
  } | null>(null);

  // 사이드바에서 패널 및 서브패널의 열림 상태를 가져옴
  const { isSectionOpen } = useSidebarHandlers();

  // 지도 검색 API 호출
  const {
    data: mapSearchData,
    pagination: mapSearchPagination,
    refetch: refetchMapSearch,
    isLoading: isMapSearchLoading,
  } = useMapSearch(mapBounds, {
    enabled: false, // 수동으로 호출
    page: currentPage,
    pageSize: 20,
  });

  // Sidebar의 map 섹션 상태에 따라 MapPanel 상태 동기화
  useEffect(() => {
    const mapSectionOpen = isSectionOpen('map');
    if (mapSectionOpen !== isMapPanelOpen) {
      setIsMapPanelOpen(mapSectionOpen);
      if (!mapSectionOpen) {
        // 패널이 닫히면 서브패널도 닫기
        setIsMapSubPanelOpen(false);
        setSelectedCafeId(null);
      }
    }
  }, [isSectionOpen, isMapPanelOpen]);

  // 패널의 아이템 클릭 시, 패널 혹은 서브패널의 열고 닫힘 및 오버레이 표시
  const handleItemClick = (itemType: MapItemCategory, itemId?: number) => {
    if (!isMapPanelOpen) return;

    // 클릭한 아이템 찾기
    const items = mapSearchData || panelMockData;
    const clickedItem = items.find(item => {
      if (itemType === MapItemCategory.PROJECT && 'projectId' in item)
        return item.projectId === itemId;
      if (itemType === MapItemCategory.STUDY && 'studyId' in item) return item.studyId === itemId;
      if (itemType === MapItemCategory.PLAYER && 'userId' in item) return item.userId === itemId;
      if (itemType === MapItemCategory.CAFE && 'cafeId' in item) return item.cafeId === itemId;
      return false;
    });

    // 클릭한 아이템 위치에 오버레이 표시
    if (clickedItem) {
      //   지도 중심을 클릭한 아이템 위치로 이동
      //   mapRef.current?.setCenter(
      //     new kakao.maps.LatLng(clickedItem.location.latitude, clickedItem.location.longitude)
      //   );

      // 패널에서 선택한 아이템에 대해 오버레이 표시
      setSelectedPoint({
        lat: clickedItem.location.latitude,
        lng: clickedItem.location.longitude,
        type: clickedItem.category,
      });
      setIsOverlayOpen(true);
    }

    if (itemType === MapItemCategory.CAFE && itemId !== undefined) {
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

  // 지도 영역의 변경을 자동으로 감지하여 MapBounds 업데이트
  const handleMapChange = () => {
    // 변경된 뷰포트로 지도 영역 크기 동적 변경
    mapRef.current?.relayout();

    setIsMapChanged(true);
    setMapBounds({
      swLat: mapRef.current?.getBounds().getSouthWest().getLat() || 0,
      swLng: mapRef.current?.getBounds().getSouthWest().getLng() || 0,
      neLat: mapRef.current?.getBounds().getNorthEast().getLat() || 0,
      neLng: mapRef.current?.getBounds().getNorthEast().getLng() || 0,
      lat: mapRef.current?.getCenter().getLat() || 0,
      lng: mapRef.current?.getCenter().getLng() || 0,
    });

    console.log(mapBounds);
  };

  // 지도 리로드 버튼 클릭 시, 현재 영역 정보를 기반으로 데이터를 불러옴
  const handleMapReload = () => {
    setIsMapChanged(false);
    setCurrentPage(0); // 페이지를 첫 번째로 리셋
    if (mapBounds) {
      refetchMapSearch();
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (mapBounds) {
      refetchMapSearch();
    }
  };

  // 지도 로드
  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_API_KEY, libraries: ['services'] });

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.map__content}>
        <div className={styles.map__container}>
          {/* TODO: 초기 로드 위치를 사용자 위치로 설정해야 함 */}
          <Map
            id="map"
            className={styles.map}
            center={{ lat: 37.5665, lng: 126.978 }}
            onTileLoaded={() => {
              handleMapChange();
            }}
            ref={mapRef}
          >
            {/* 줌 레벨 컨트롤 */}
            <ZoomControl position="BOTTOMRIGHT" />

            {/* 마커 - API에서 받은 데이터(mapSearchData)로 표시 */}
            {mapSearchData &&
              mapSearchData.map(m => (
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

            {/* API 데이터가 없는 경우 panelMockData로 표시 (테스트용, 추후 제거) */}
            {!mapSearchData &&
              panelMockData.map(m => (
                <MapMarker
                  key={`marker__mock__${m.location.latitude}-${m.location.longitude}`}
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
                {(() => {
                  const overlayData = overlayMockData.find(
                    data => data.category === selectedPoint.type
                  );
                  if (!overlayData) return null;

                  const commonProps = {
                    onOverlayClose: () => setIsOverlayOpen(false),
                  };

                  switch (selectedPoint.type) {
                    case MapItemCategory.PROJECT:
                      return (
                        <MapProjectOverlay
                          {...commonProps}
                          project={overlayData as ProjectOverlayData}
                        />
                      );
                    case MapItemCategory.STUDY:
                      return (
                        <MapStudyOverlay {...commonProps} study={overlayData as StudyOverlayData} />
                      );
                    case MapItemCategory.PLAYER:
                      return (
                        <MapPlayerOverlay
                          {...commonProps}
                          player={overlayData as PlayerOverlayData}
                        />
                      );
                    case MapItemCategory.CAFE:
                      return (
                        <MapCafeOverlay {...commonProps} cafe={overlayData as CafeOverlayData} />
                      );
                    default:
                      return null;
                  }
                })()}
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
          onClick={handleMapReload}
        >
          현 지도에서 검색
        </Button>
      )}

      {/* 지도 패널 */}
      {isMapPanelOpen && (
        <div className={styles.map__panelContainer}>
          <MapPanel
            data={mapSearchData}
            pagination={mapSearchPagination}
            isLoading={isMapSearchLoading}
            handleItemClick={handleItemClick}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* 지도 서브패널 */}
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
