// 카카오 API의 addressSearch를 사용하여 텍스트로 전달받은 주소를 검색하여 좌표 및 기타 사항들을 추출하는 유틸입니다.

import type { Location } from '@/types/project';

interface ExtendedKakaoResult {
  x: string;
  y: string;
  address_name: string;
  road_address_name?: string;
  address?: {
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code?: string;
  };
  road_address?: {
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    main_building_no: string;
    sub_building_no: string;
    zone_no: string;
  };
}

interface ExtendedCoord2AddressResult {
  address?: {
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    main_address_no: string;
    sub_address_no: string;
  };
  road_address?: {
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    main_building_no: string;
    sub_building_no: string;
    zone_no: string;
  };
}

export const enhanceAddressWithKakao = (
  address: string,
  zonecode?: string
): Promise<Location | null> => {
  return new Promise(resolve => {
    if (!window.kakao?.maps?.services) {
      resolve(null);
      return;
    }

    try {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status === 'OK' && result && result.length > 0) {
          const data = result[0] as ExtendedKakaoResult;

          if (data.road_address) {
            resolve({
              address: data.address_name || address,
              region1depthName: data.road_address.region_1depth_name,
              region2depthName: data.road_address.region_2depth_name,
              region3depthName: data.road_address.region_3depth_name,
              roadName: data.road_address.road_name,
              mainBuildingNo: data.road_address.main_building_no,
              subBuildingNo: data.road_address.sub_building_no,
              zoneNo: data.road_address.zone_no || zonecode || '',
              latitude: parseFloat(data.y),
              longitude: parseFloat(data.x),
            });
          } else if (data.address) {
            resolve({
              address: data.address_name || address,
              region1depthName: data.address.region_1depth_name,
              region2depthName: data.address.region_2depth_name,
              region3depthName: data.address.region_3depth_name,
              roadName: '',
              mainBuildingNo: data.address.main_address_no,
              subBuildingNo: data.address.sub_address_no,
              zoneNo: data.address.zip_code || zonecode || '',
              latitude: parseFloat(data.y),
              longitude: parseFloat(data.x),
            });
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    } catch {
      resolve(null);
    }
  });
};

export const getDetailedAddressFromCoords = (
  latitude: number,
  longitude: number
): Promise<Location | null> => {
  return new Promise(resolve => {
    if (!window.kakao?.maps?.services) {
      resolve(null);
      return;
    }

    try {
      const geocoder = new window.kakao.maps.services.Geocoder();

      const geocoderWithCoord2Address = geocoder as typeof geocoder & {
        coord2Address?: (
          lng: number,
          lat: number,
          callback: (result: ExtendedCoord2AddressResult[], status: string) => void
        ) => void;
      };

      if (!geocoderWithCoord2Address.coord2Address) {
        resolve(null);
        return;
      }

      geocoderWithCoord2Address.coord2Address(
        longitude,
        latitude,
        (result: ExtendedCoord2AddressResult[], status: string) => {
          if (status === 'OK' && result && result.length > 0) {
            const data = result[0];

            if (data.road_address) {
              const fullAddress = `${data.road_address.region_1depth_name} ${data.road_address.region_2depth_name} ${data.road_address.region_3depth_name} ${data.road_address.road_name} ${data.road_address.main_building_no}${data.road_address.sub_building_no ? `-${data.road_address.sub_building_no}` : ''}`;

              resolve({
                address: fullAddress,
                region1depthName: data.road_address.region_1depth_name,
                region2depthName: data.road_address.region_2depth_name,
                region3depthName: data.road_address.region_3depth_name,
                roadName: data.road_address.road_name,
                mainBuildingNo: data.road_address.main_building_no,
                subBuildingNo: data.road_address.sub_building_no,
                zoneNo: data.road_address.zone_no,
                latitude,
                longitude,
              });
            } else if (data.address) {
              const fullAddress = `${data.address.region_1depth_name} ${data.address.region_2depth_name} ${data.address.region_3depth_name} ${data.address.main_address_no}${data.address.sub_address_no ? `-${data.address.sub_address_no}` : ''}`;

              resolve({
                address: fullAddress,
                region1depthName: data.address.region_1depth_name,
                region2depthName: data.address.region_2depth_name,
                region3depthName: data.address.region_3depth_name,
                roadName: '',
                mainBuildingNo: data.address.main_address_no,
                subBuildingNo: data.address.sub_address_no,
                zoneNo: '',
                latitude,
                longitude,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      );
    } catch {
      resolve(null);
    }
  });
};

export const isKakaoMapsLoaded = (): boolean => {
  return !!window.kakao?.maps?.services;
};
