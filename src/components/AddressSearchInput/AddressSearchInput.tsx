import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';
import type { Location } from '@/types/project';
import { enhanceAddressWithKakao } from '@/utils/kakaoGeocoder';

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
  onLocationSelect?: (location: Location) => void;
  placeholder?: string;
  className?: string;
}

const AddressSearchInput = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = '주소 검색하기',
  className,
}: AddressSearchInputProps) => {
  const handleIconClick = () => {
    // 카카오 주소검색 API가 로드되어 있는지 확인
    if (window.daum && window.daum.Postcode) {
      const postcode = new window.daum.Postcode({
        oncomplete: async function (data) {
          const fullAddress = data.address;
          onChange(fullAddress);

          if (onLocationSelect) {
            // kakaoGeocoder를 사용하여 상세한 위치 정보 획득
            const locationData = await enhanceAddressWithKakao(fullAddress, data.zonecode);

            if (locationData) {
              onLocationSelect(locationData);
            } else {
              // kakaoGeocoder 실패 시 기본 좌표만 사용
              const fallbackLocation: Location = {
                address: fullAddress,
                region1depthName: data.sido || '',
                region2depthName: data.sigungu || '',
                region3depthName: data.bname || '',
                roadName: data.roadname || '',
                mainBuildingNo: '',
                subBuildingNo: '',
                zoneNo: data.zonecode || '',
                latitude: data.y ? parseFloat(data.y) : 0,
                longitude: data.x ? parseFloat(data.x) : 0,
              };
              onLocationSelect(fallbackLocation);
            }
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
