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
  const handleIconClick = () => {
    // 카카오 주소검색 API가 로드되어 있는지 확인
    if (window.daum && window.daum.Postcode) {
      const postcode = new window.daum.Postcode({
        oncomplete: function (data) {
          const fullAddress = data.address;
          onChange(fullAddress);

          // 좌표 정보가 있다면 함께 전달
          if (onSelect) {
            const coordinates =
              data.x && data.y
                ? {
                    latitude: parseFloat(data.y),
                    longitude: parseFloat(data.x),
                  }
                : undefined;

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
