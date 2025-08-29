import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          address: string;
          zonecode: string;
          addressType: string;
          bname: string;
          buildingName: string;
          roadAddress?: string;
          jibunAddress?: string;
          sido?: string;
          sigungu?: string;
          roadname?: string;
          x?: string; // 경도 (longitude)
          y?: string; // 위도 (latitude)
        }) => void;
        onclose?: () => void;
        width?: string | number;
        height?: string | number;
      }) => {
        open: () => void;
      };
    };
    kakao: {
      maps: {
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (
                result: Array<{
                  x: string; // 경도
                  y: string; // 위도
                  address_name: string;
                  address_type: string;
                  road_address: {
                    address_name: string;
                    region_1depth_name: string;
                    region_2depth_name: string;
                    region_3depth_name: string;
                    road_name: string;
                    underground_yn: string;
                    main_building_no: string;
                    sub_building_no: string;
                    building_name: string;
                    zone_no: string;
                  } | null;
                }>,
                status: string
              ) => void
            ) => void;
          };
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
        };
      };
    };
  }
}

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: string, coordinates?: { latitude: number; longitude: number }) => void;
  placeholder?: string;
  className?: string;
}

const AddressSearchInput = ({
  value,
  onChange,
  onSelect,
  placeholder = '주소 검색하기',
  className,
}: AddressSearchInputProps) => {
  // 카카오 지오코더를 사용하여 주소로 좌표 검색
  const getCoordinatesFromAddress = (
    address: string
  ): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise(resolve => {
      if (!window.kakao?.maps?.services) {
        console.warn('카카오 Maps API가 로드되지 않았습니다.');
        resolve(null);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const coords = {
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
          };
          console.log('지오코더로 찾은 좌표:', coords);
          resolve(coords);
        } else {
          console.warn('주소로 좌표를 찾을 수 없습니다:', address);
          resolve(null);
        }
      });
    });
  };

  const handleIconClick = () => {
    // 카카오 주소검색 API가 로드되어 있는지 확인
    if (window.daum && window.daum.Postcode) {
      const postcode = new window.daum.Postcode({
        oncomplete: async function (data) {
          const fullAddress = data.address;
          onChange(fullAddress);

          if (onSelect) {
            // 먼저 Postcode API에서 제공하는 좌표를 확인
            let coordinates: { latitude: number; longitude: number } | undefined;

            if (data.x && data.y) {
              coordinates = {
                latitude: parseFloat(data.y),
                longitude: parseFloat(data.x),
              };
              console.log('Postcode API에서 좌표 획득:', coordinates);
            } else {
              // Postcode API에서 좌표가 없으면 지오코더 API 사용
              console.log('Postcode API에 좌표 없음, 지오코더 API 사용');
              const geocoderResult = await getCoordinatesFromAddress(fullAddress);
              if (geocoderResult) {
                coordinates = geocoderResult;
              }
            }

            onSelect(fullAddress, coordinates);
          }
        },
        onclose: function () {},
        width: '100%',
        height: '100%',
      });
      postcode.open();
    } else {
      alert('주소검색 서비스를 로드할 수 없습니다. 페이지를 새로고침 해주세요.');
    }
  };

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={() => {}}
        onClick={handleIconClick}
        width="100%"
        height="40px"
        fontSize="var(--fs-xxsmall)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        iconSize={24}
        readOnly
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
            cursor: 'pointer',
            marginBottom: '1.5rem',
          } as React.CSSProperties
        }
        rightIcon={
          <button
            type="button"
            onClick={handleIconClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <MagnifyingGlassIcon width={24} height={24} color="var(--black-1)" />
          </button>
        }
      />
    </div>
  );
};

export default AddressSearchInput;
