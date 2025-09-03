import AddressSearchInput from '@/components/AddressSearchInput/AddressSearchInput';

import styles from './LocationSelector.module.scss';

interface LocationSelectorProps {
  locationSearch: string;
  onLocationSearchChange: (value: string) => void;
  onLocationSelect: (
    location: string,
    coordinates?: { latitude: number; longitude: number }
  ) => void;
}

const LocationSelector = ({
  locationSearch,
  onLocationSearchChange,
  onLocationSelect,
}: LocationSelectorProps) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 주활동지를 선택해주세요</h2>
      <AddressSearchInput
        value={locationSearch}
        onChange={onLocationSearchChange}
        onSelect={onLocationSelect}
        placeholder="주소 검색하기"
      />
    </div>
  );
};

export default LocationSelector;
