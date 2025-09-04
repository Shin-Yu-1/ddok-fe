import AddressSearchInput from '@/components/AddressSearchInput/AddressSearchInput';
import type { Location } from '@/types/project';
import { enhanceAddressWithKakao } from '@/utils/kakaoGeocoder';

import styles from './PostLocationSelector.module.scss';

interface PostLocationSelectorProps {
  location: Location | null;
  onLocationChange: (location: Location | null) => void;
}

// Location 객체를 주소 문자열로 변환하는 유틸 함수
const formatLocationToAddress = (location: Location): string => {
  const parts = [
    location.region1depthName,
    location.region2depthName,
    location.region3depthName,
    location.roadName,
    location.mainBuildingNo,
  ].filter(Boolean);

  return parts.join(' ');
};

const PostLocationSelector = ({ location, onLocationChange }: PostLocationSelectorProps) => {
  const handleLocationSearchChange = () => {
    // 단순 텍스트 변경은 처리하지 않음 (읽기 전용)
    // AddressSearchInput이 readOnly이므로 실제로는 호출되지 않음
  };

  const handleLocationSelect = async (address: string) => {
    const location = await enhanceAddressWithKakao(address);
    onLocationChange(location); // null이 될 수 있음 (실패 시)
  };

  return (
    <div className={styles.container}>
      <p className={styles.sectionSubtitle}>프로젝트를 진행할 지역을 선택해주세요</p>
      <AddressSearchInput
        value={location ? formatLocationToAddress(location) : ''}
        onChange={handleLocationSearchChange}
        onSelect={handleLocationSelect}
        placeholder="주소 검색하기"
      />

      {location && (
        <div className={styles.selectedLocation}>
          <div className={styles.locationInfo}>
            <span className={styles.locationText}>
              선택된 지역: {formatLocationToAddress(location)}
            </span>
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
