import AddressSearchInput from '@/components/AddressSearchInput/AddressSearchInput';
import type { Location } from '@/types/project';
import { convertAddressToCoords } from '@/utils/kakaoGeocoder';

import styles from './PostLocationSelector.module.scss';

interface PostLocationSelectorProps {
  location: Location | null;
  onLocationChange: (location: Location | null) => void;
}

const PostLocationSelector = ({ location, onLocationChange }: PostLocationSelectorProps) => {
  const handleLocationSearchChange = () => {
    // 단순 텍스트 변경은 처리하지 않음 (읽기 전용)
    // AddressSearchInput이 readOnly이므로 실제로는 호출되지 않음
  };

  const handleLocationSelect = async (address: string) => {
    try {
      const location = await convertAddressToCoords(address);
      onLocationChange(location);
    } catch {
      // 오류 발생 시에도 주소만이라도 저장
      onLocationChange({
        latitude: 37.5665,
        longitude: 126.978,
        address: address,
      });
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.sectionSubtitle}>프로젝트를 진행할 지역을 선택해주세요</p>
      <AddressSearchInput
        value={location?.address || ''}
        onChange={handleLocationSearchChange}
        onSelect={handleLocationSelect}
        placeholder="주소 검색하기"
      />

      {location && (
        <div className={styles.selectedLocation}>
          <div className={styles.locationInfo}>
            <span className={styles.locationText}>선택된 지역: {location.address}</span>
            <span className={styles.coordsText}>
              좌표: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostLocationSelector;
