// 카카오 API의 addressSearch를 사용하여 텍스트로 전달받은 주소를 검색하여 좌표로 변환하는 유틸입니다.
import type { Location } from '@/types/project';

// 카카오맵 API 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (
                result: Array<{
                  x: string; // longitude
                  y: string; // latitude
                  address_name: string;
                  road_address_name?: string;
                }>,
                status: string
              ) => void
            ) => void;
          };
        };
      };
    };
  }
}

/**
 * 주소를 좌표로 변환하는 함수
 * @param address 변환할 주소
 * @returns Promise<Location> 좌표 정보가 포함된 Location 객체
 */
export const convertAddressToCoords = (address: string): Promise<Location> => {
  return new Promise(resolve => {
    // 카카오맵 API 로드 확인
    if (!window.kakao?.maps?.services) {
      // API가 로드되지 않은 경우 fallback 좌표 반환
      // TODO: 추후 토스트 연결 필요 및 재시도 또는 별도로 에러 처리 필요
      resolve({
        latitude: 37.5665, // 서울 중심좌표
        longitude: 126.978,
        address: address,
      });
      return;
    }

    try {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status === 'OK' && result && result.length > 0) {
          const coords = result[0];
          resolve({
            latitude: parseFloat(coords.y),
            longitude: parseFloat(coords.x),
            address: coords.road_address_name || coords.address_name || address,
          });
        } else {
          // 검색 실패 시 fallback 좌표 반환
          resolve({
            latitude: 37.5665,
            longitude: 126.978,
            address: address,
          });
        }
      });
    } catch {
      // 오류 발생 시 fallback 좌표 반환
      resolve({
        latitude: 37.5665,
        longitude: 126.978,
        address: address,
      });
    }
  });
};

/**
 * 카카오맵 API가 로드되었는지 확인하는 함수
 * @returns boolean 로드 여부
 */
export const isKakaoMapsLoaded = (): boolean => {
  return !!window.kakao?.maps?.services;
};
