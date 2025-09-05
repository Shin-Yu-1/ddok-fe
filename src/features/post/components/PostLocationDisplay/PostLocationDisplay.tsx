import { useEffect, useRef, useState } from 'react';

import { MapPin, NavigationArrow } from '@phosphor-icons/react';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const [locationData, setLocationData] = useState<Location | null>(location || null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

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
        }
      } catch (error) {
        console.error('주소 정보 로드 실패:', error);
        setMapError('위치 정보를 불러올 수 없습니다.');
      }
    };

    loadLocationData();
  }, [address, location]);

  // 카카오 지도 초기화
  useEffect(() => {
    if (!showMap || !locationData || !mapRef.current) return;

    const initializeMap = () => {
      if (!window.kakao?.maps) {
        setMapError('카카오 지도를 불러올 수 없습니다.');
        return;
      }

      // null 체크를 통과한 후이므로 non-null assertion 사용
      const mapElement = mapRef.current!;

      try {
        const { kakao } = window;

        // 지도 중심 좌표 설정
        const coords = new kakao.maps.LatLng(locationData.latitude, locationData.longitude);

        // 지도 옵션
        const options: kakao.maps.MapOptions = {
          center: coords,
          level: 3, // 확대/축소 레벨
        };

        // 지도 생성
        const map = new kakao.maps.Map(mapElement, options);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: coords,
          map: map,
        });

        // 인포윈도우 생성 (주소 표시)
        const infoWindow = new kakao.maps.InfoWindow({
          content: `
            <div style="
              padding: 8px 12px; 
              font-size: 12px; 
              line-height: 1.4;
              max-width: 200px;
              word-break: keep-all;
            ">
              ${address}
            </div>
          `,
          removable: false,
        });

        // 마커 클릭 시 인포윈도우 표시
        kakao.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(map, marker);
        });

        setMapInstance(map);
        setIsMapLoaded(true);
        setMapError(null);
      } catch (error) {
        console.error('지도 초기화 실패:', error);
        setMapError('지도를 불러올 수 없습니다.');
      }
    };

    // 카카오 지도 API 로드 확인
    if (window.kakao?.maps) {
      initializeMap();
    } else {
      // 카카오 지도 API 로드 대기
      const checkKakaoMaps = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(checkKakaoMaps);
          initializeMap();
        }
      }, 100);

      // 5초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkKakaoMaps);
        if (!window.kakao?.maps) {
          setMapError('카카오 지도 로드 타임아웃');
        }
      }, 5000);
    }
  }, [locationData, showMap, address]);

  // 지도 중심 재설정 함수 (mapInstance 사용)
  const recenterMap = () => {
    if (mapInstance && locationData && window.kakao?.maps) {
      const coords = new window.kakao.maps.LatLng(locationData.latitude, locationData.longitude);
      mapInstance.setCenter(coords);
    }
  };

  const { region, detail } = parseAddress(address);

  // 카카오맵 앱으로 길찾기
  const handleNavigateToKakaoMap = () => {
    if (!locationData) return;

    const { latitude, longitude } = locationData;
    const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(address)},${latitude},${longitude}`;
    window.open(kakaoMapUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      {/* 지도 섹션 */}
      {showMap && (
        <div className={styles.mapSection}>
          {mapError ? (
            <div className={styles.mapError}>
              <MapPin size={24} />
              <span>{mapError}</span>
            </div>
          ) : (
            <div ref={mapRef} className={styles.map} style={{ height: `${mapHeight}px` }} />
          )}

          {/* 지도 컨트롤 */}
          {isMapLoaded && locationData && (
            <div className={styles.mapControls}>
              <button
                className={styles.navigateButton}
                onClick={handleNavigateToKakaoMap}
                title="카카오맵에서 길찾기"
              >
                <NavigationArrow size={16} />
                길찾기
              </button>

              <button className={styles.recenterButton} onClick={recenterMap} title="위치 재설정">
                <MapPin size={16} />
              </button>
            </div>
          )}
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
        {(!showMap || mapError) && locationData && (
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
