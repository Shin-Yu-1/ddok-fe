import { useState, useEffect, useRef } from 'react';

import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
  ZoomControl,
} from 'react-kakao-maps-sdk';

import MapCafeOverlay from '@/features/map/components/MapOverlay/MapCafeOverlay/MapCafeOverlay';
import MapPlayerOverlay from '@/features/map/components/MapOverlay/MapPlayerOverlay/MapPlayerOverlay';
import MapProjectOverlay from '@/features/map/components/MapOverlay/MapProjectOverlay/MapProjectOverlay';
import MapStudyOverlay from '@/features/map/components/MapOverlay/MapStudyOverlay/MapStudyOverlay';
import MapPanel from '@/features/map/components/MapPanel/MapPanel';
import MapSubPanel from '@/features/map/components/MapSubPanel/MapSubPanel';
import { useGetMapItem } from '@/features/map/hooks/useGetMapItem';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import type { MapBounds } from '@/features/map/schemas/mapItemSchema';
import { MapItemCategory } from '@/features/map/types/common';
import Sidebar from '@/features/Sidebar/components/Sidebar';
import { useSidebarHandlers } from '@/features/Sidebar/hooks/useSidebarHandlers';

import styles from './MapPage.module.scss';

const MapPage = () => {
  // 지도의 정보를 담는 ref
  const mapRef = useRef<kakao.maps.Map>(null);

  // 사용자 위치 좌표 상태 - 기본값 서울시청으로 설정
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 37.5665, lng: 126.978 });

  // 패널, 서브패널, 오버레이의 열림/닫힘 상태
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  const [isMapSubPanelOpen, setIsMapSubPanelOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // 현재 선택된 추천 장소의 ID
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(0);

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(undefined);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  // 마커 표시용 카테고리 필터 상태 (MapPanel의 카테고리 필터와 연동)
  const [markerCategory, setMarkerCategory] = useState<MapItemCategory | null>(null);

  // 지도 사각 영역에 대한 정보
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  // 최초 로드 완료 여부
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  // 커스텀 오버레이에 전달할 마커의 좌표, 타입 및 ID
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
    category: string;
    id: number;
  } | null>(null);

  // 사이드바에서 패널 및 서브패널의 열림 상태를 가져옴
  const { isSectionOpen, openSection } = useSidebarHandlers();

  // 마커 표시용 지도 아이템 API 호출 (카테고리 필터에 따라 변경)
  const { data: mapItemData, refetch: refetchMapItem } = useGetMapItem({
    mapBounds: mapBounds ?? undefined,
    category: markerCategory,
    enabled: isInitialLoad && !!mapBounds,
  });

  // 지도 검색 API 호출 (패널용 데이터 - 페이지네이션, 키워드 검색 포함)
  const {
    data: mapSearchData,
    pagination: mapSearchPagination,
    refetch: refetchMapSearch,
    isLoading: isMapSearchLoading,
  } = useMapSearch(mapBounds, {
    enabled: false,
    page: currentPage,
    pageSize: 5,
    category: selectedCategory,
    filter: selectedFilter,
    keyword: keyword,
  });

  // 세션 스토리지에서 사용자 위치 정보 가져오기
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

  // 페이지 변경 시 API 재호출
  useEffect(() => {
    if (isInitialLoad && mapBounds) {
      refetchMapSearch();
    }
  }, [currentPage, refetchMapSearch, isInitialLoad, mapBounds]);

  // 필터 변경 시 API 재호출
  useEffect(() => {
    if (isInitialLoad && mapBounds) {
      refetchMapSearch();
    }
  }, [selectedCategory, selectedFilter, keyword, refetchMapSearch, isInitialLoad, mapBounds]);

  // 마커 카테고리 변경 시 마커 데이터 리패치
  useEffect(() => {
    if (isInitialLoad && mapBounds) {
      refetchMapItem();
    }
  }, [markerCategory, refetchMapItem, isInitialLoad, mapBounds]);

  // mapBounds 변경 시 열려있는 overlay와 subPanel 닫기
  useEffect(() => {
    if (isInitialLoad && mapBounds) {
      // overlay 닫기
      setIsOverlayOpen(false);
      setSelectedPoint(null);

      // subPanel 닫기
      setIsMapSubPanelOpen(false);
      setSelectedCafeId(null);

      // 마커 데이터 리패치
      refetchMapItem();
    }
  }, [mapBounds, isInitialLoad, refetchMapItem]);

  // 패널의 아이템 클릭 시, 패널 혹은 서브패널의 열고 닫힘 및 오버레이 표시
  const handleItemClick = (itemType: MapItemCategory, itemId?: number) => {
    if (!isMapPanelOpen || !itemId) return;

    // 클릭한 아이템 찾기 - mapSearchData가 undefined인 경우 빈 배열로 처리
    const items = mapSearchData || [];
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
      // 패널에서 선택한 아이템에 대해 오버레이 표시
      setSelectedPoint({
        lat: clickedItem.location.latitude,
        lng: clickedItem.location.longitude,
        category: clickedItem.category,
        id: itemId,
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

    const newMapBounds = {
      swLat: mapRef.current?.getBounds().getSouthWest().getLat() || 0,
      swLng: mapRef.current?.getBounds().getSouthWest().getLng() || 0,
      neLat: mapRef.current?.getBounds().getNorthEast().getLat() || 0,
      neLng: mapRef.current?.getBounds().getNorthEast().getLng() || 0,
      lat: mapRef.current?.getCenter().getLat() || 0,
      lng: mapRef.current?.getCenter().getLng() || 0,
    };

    setMapBounds(newMapBounds);

    // 최초 로드 시에만 API 호출
    if (!isInitialLoad) {
      setIsInitialLoad(true);
      // mapBounds가 설정된 이후 API 호출
      setTimeout(() => {
        refetchMapSearch();
        refetchMapItem();
      }, 100);
    }

    console.log(newMapBounds);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // 페이지 변경 시 열려있는 overlay 닫기
    setIsOverlayOpen(false);
    setSelectedPoint(null);

    // useEffect에서 currentPage 변경을 감지하여 자동으로 리패치됨
  };

  // 필터 변경 핸들러
  const handleFilterChange = (category?: string, filter?: string) => {
    setSelectedCategory(category);
    setSelectedFilter(filter);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 리셋

    // 마커 카테고리도 함께 업데이트
    if (category) {
      setMarkerCategory(category as MapItemCategory);
    } else {
      setMarkerCategory(null); // 전체 선택 시 null로 설정
    }

    // 필터 변경 시 열려있는 overlay 닫기
    setIsOverlayOpen(false);
    setSelectedPoint(null);

    // useEffect에서 필터 변경을 감지하여 자동으로 리패치됨
  };

  // 키워드 변경 핸들러
  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword || undefined);
    setCurrentPage(0); // 키워드 검색 시 첫 페이지로 리셋

    // 키워드 검색 시 열려있는 overlay 닫기
    setIsOverlayOpen(false);
    setSelectedPoint(null);

    // useEffect에서 키워드 변경을 감지하여 자동으로 리패치됨
  };

  // 지도 로드
  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ['services', 'clusterer'],
  });

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.map__content}>
        <div className={styles.map__container}>
          <Map
            id="map"
            className={styles.map}
            center={userLocation}
            onTileLoaded={() => {
              handleMapChange();
            }}
            ref={mapRef}
          >
            {/* 줌 레벨 컨트롤 */}
            <ZoomControl position="BOTTOMRIGHT" />

            {/* 마커 */}
            {mapItemData &&
              mapItemData.map(m => {
                let id: number;
                let uniqueKey: string;

                if (m.category === MapItemCategory.PROJECT && 'projectId' in m) {
                  id = m.projectId;
                  uniqueKey = `marker__project-${m.projectId}`;
                } else if (m.category === MapItemCategory.STUDY && 'studyId' in m) {
                  id = m.studyId;
                  uniqueKey = `marker__study-${m.studyId}`;
                } else if (m.category === MapItemCategory.PLAYER && 'userId' in m) {
                  id = m.userId;
                  uniqueKey = `marker__player-${m.userId}`;
                } else if (m.category === MapItemCategory.CAFE && 'cafeId' in m) {
                  id = m.cafeId;
                  uniqueKey = `marker__cafe-${m.cafeId}`;
                } else {
                  return null;
                }

                return (
                  <MapMarker
                    key={uniqueKey}
                    position={{ lat: m.location.latitude, lng: m.location.longitude }}
                    onClick={() => {
                      setIsOverlayOpen(true);
                      setSelectedPoint({
                        lat: m.location.latitude,
                        lng: m.location.longitude,
                        category: m.category,
                        id: id,
                      });

                      // cafe 마커 클릭 시 MapSubPanel도 열기
                      if (m.category === MapItemCategory.CAFE && 'cafeId' in m) {
                        // MapPanel이 닫혀있으면 먼저 열기
                        if (!isMapPanelOpen) {
                          openSection('map');
                        }
                        setSelectedCafeId(m.cafeId);
                        setIsMapSubPanelOpen(true);
                      } else {
                        // cafe가 아닌 경우 서브패널 닫기
                        setIsMapSubPanelOpen(false);
                        setSelectedCafeId(null);
                      }
                    }}
                  ></MapMarker>
                );
              })}

            {/* 오버레이 */}
            {isOverlayOpen && selectedPoint && (
              <CustomOverlayMap position={selectedPoint} yAnchor={1.13}>
                {(() => {
                  const commonProps = {
                    onOverlayClose: () => setIsOverlayOpen(false),
                    id: selectedPoint.id,
                  };

                  switch (selectedPoint.category) {
                    case MapItemCategory.PROJECT:
                      return <MapProjectOverlay {...commonProps} />;
                    case MapItemCategory.STUDY:
                      return <MapStudyOverlay {...commonProps} />;
                    case MapItemCategory.PLAYER:
                      return <MapPlayerOverlay {...commonProps} />;
                    case MapItemCategory.CAFE:
                      return <MapCafeOverlay {...commonProps} />;
                    default:
                      return null;
                  }
                })()}
              </CustomOverlayMap>
            )}
          </Map>
        </div>
      </div>

      {/* 지도 패널 */}
      {isMapPanelOpen && (
        <div className={styles.map__panelContainer}>
          <MapPanel
            data={mapSearchData}
            pagination={mapSearchPagination}
            isLoading={isMapSearchLoading}
            handleItemClick={handleItemClick}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onKeywordChange={handleKeywordChange}
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
