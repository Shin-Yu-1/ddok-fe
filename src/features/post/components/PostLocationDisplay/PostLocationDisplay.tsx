import { useCallback, useEffect, useState } from 'react';

import { MapPin, NavigationArrow } from '@phosphor-icons/react';
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';

import type { Location } from '@/types/project';
import { enhanceAddressWithKakao } from '@/utils/kakaoGeocoder';

import styles from './PostLocationDisplay.module.scss';

interface PostLocationDisplayProps {
  address: string;
  location?: Location | null;
  showMap?: boolean;
  mapHeight?: number;
}

const PostLocationDisplay = ({
  address,
  location,
  showMap = true,
  mapHeight = 200,
}: PostLocationDisplayProps) => {
  const [isLoading, kakaoError] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API_KEY,
    libraries: ['services', 'clusterer'],
  });

  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const [locationData, setLocationData] = useState<Location | null>(location || null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  // 주소를 지역별로 파싱
  const parseAddress = (addr: string) => {
    const parts = addr.split(' ');
    const region = parts.slice(0, 2).join(' '); // 시/도 구/군
    const detail = parts.slice(2).join(' '); // 나머지 상세 주소

    return { region, detail };
  };

  // Location 객체가 없을 때 주소로부터 좌표 정보 가져오기
  useEffect(() => {
    const loadLocationData = async () => {
      if (location) {
        setLocationData(location);
        return;
      }

      if (!address) return;

      try {
        const enhancedLocation = await enhanceAddressWithKakao(address);
        if (enhancedLocation) {
          setLocationData(enhancedLocation);
          setMapError(null);
        } else {
          setMapError('위치 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('주소 정보 로드 실패:', error);
        setMapError('위치 정보를 불러올 수 없습니다.');
      }
    };

    loadLocationData();
  }, [address, location]);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(() => {
    setShowInfoWindow(true);
  }, []);

  // 지정된 주소로 이동 (초기 배율 유지)
  const moveToLocation = useCallback(() => {
    if (mapInstance && locationData) {
      const currentLevel = mapInstance.getLevel(); // 현재 배율 저장
      const coords = new kakao.maps.LatLng(locationData.latitude, locationData.longitude);

      mapInstance.setCenter(coords);
      mapInstance.setLevel(currentLevel); // 배율 유지
    }
  }, [mapInstance, locationData]);

  // 카카오맵 앱으로 길찾기
  const handleNavigateToKakaoMap = useCallback(() => {
    if (!locationData) return;

    const { latitude, longitude } = locationData;
    const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(address)},${latitude},${longitude}`;
    window.open(kakaoMapUrl, '_blank');
  }, [locationData, address]);

  const { region, detail } = parseAddress(address);

  // 카카오맵 로딩 중
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.mapSection}>
          <div className={styles.mapLoading}>
            <MapPin size={24} />
            <span>카카오 지도를 로드하고 있습니다...</span>
          </div>
        </div>

        <div className={styles.locationInfo}>
          <div className={styles.iconSection}>
            <MapPin size={20} color="var(--blue-1)" />
          </div>
          <div className={styles.addressSection}>
            <div className={styles.region}>{region}</div>
            {detail && <div className={styles.detail}>{detail}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 카카오맵 로드 에러
  if (kakaoError) {
    return (
      <div className={styles.container}>
        <div className={styles.mapSection}>
          <div className={styles.mapError}>
            <MapPin size={24} />
            <span>카카오 지도를 불러올 수 없습니다.</span>
          </div>
        </div>

        <div className={styles.locationInfo}>
          <div className={styles.iconSection}>
            <MapPin size={20} color="var(--blue-1)" />
          </div>
          <div className={styles.addressSection}>
            <div className={styles.region}>{region}</div>
            {detail && <div className={styles.detail}>{detail}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 위치 데이터 로드 에러
  if (mapError) {
    return (
      <div className={styles.container}>
        <div className={styles.mapSection}>
          <div className={styles.mapError}>
            <MapPin size={24} />
            <span>{mapError}</span>
          </div>
        </div>

        <div className={styles.locationInfo}>
          <div className={styles.iconSection}>
            <MapPin size={20} color="var(--blue-1)" />
          </div>
          <div className={styles.addressSection}>
            <div className={styles.region}>{region}</div>
            {detail && <div className={styles.detail}>{detail}</div>}
          </div>
        </div>
      </div>
    );
  }

  // 위치 데이터가 없는 경우
  if (!locationData) {
    return (
      <div className={styles.container}>
        <div className={styles.locationInfo}>
          <div className={styles.iconSection}>
            <MapPin size={20} color="var(--blue-1)" />
          </div>
          <div className={styles.addressSection}>
            <div className={styles.region}>{region}</div>
            {detail && <div className={styles.detail}>{detail}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 지도 섹션 */}
      {showMap && (
        <div className={styles.mapSection}>
          <div className={styles.map} style={{ height: `${mapHeight}px` }}>
            <Map
              center={{
                lat: locationData.latitude,
                lng: locationData.longitude,
              }}
              level={3}
              style={{
                width: '100%',
                height: '100%',
              }}
              onCreate={setMapInstance}
            >
              <MapMarker
                position={{
                  lat: locationData.latitude,
                  lng: locationData.longitude,
                }}
                onClick={handleMarkerClick}
              />

              {showInfoWindow && (
                <CustomOverlayMap
                  position={{
                    lat: locationData.latitude,
                    lng: locationData.longitude,
                  }}
                  yAnchor={1.3}
                >
                  <div className={styles.infoWindow}>
                    <div className={styles.infoContent}>{address}</div>
                    <button
                      className={styles.infoCloseButton}
                      onClick={() => setShowInfoWindow(false)}
                    >
                      ×
                    </button>
                  </div>
                </CustomOverlayMap>
              )}
            </Map>
          </div>

          {/* 지도 컨트롤 */}
          <div className={styles.mapControls}>
            <button
              className={styles.navigateButton}
              onClick={handleNavigateToKakaoMap}
              title="카카오맵에서 길찾기"
            >
              <NavigationArrow size={16} />
              길찾기
            </button>

            <button className={styles.recenterButton} onClick={moveToLocation} title="위치로 이동">
              <MapPin size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 주소 정보 */}
      <div className={styles.locationInfo}>
        <div className={styles.iconSection}>
          <MapPin size={20} color="var(--blue-1)" />
        </div>

        <div className={styles.addressSection}>
          <div className={styles.region}>{region}</div>
          {detail && <div className={styles.detail}>{detail}</div>}
        </div>

        {/* 카카오맵 링크 (지도가 없을 때) */}
        {!showMap && (
          <button
            className={styles.mapLinkButton}
            onClick={handleNavigateToKakaoMap}
            title="카카오맵에서 보기"
          >
            <NavigationArrow size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostLocationDisplay;
