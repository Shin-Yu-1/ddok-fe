import { useState } from 'react';

import { MagnifyingGlassIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import { AGE_RANGES } from '@/constants/ageRanges';
import { POSITIONS } from '@/constants/positions';

import styles from './SearchProjectPage.module.scss';

const statusOptions = [
  { label: '전체', value: '0' },
  { label: '모집 중', value: '1' },
  { label: '프로젝트 진행 중', value: '2' },
  { label: '프로젝트 종료', value: '3' },
];
const capacityOptions = [
  { label: '1명', value: 1 },
  { label: '2명', value: 2 },
  { label: '2명', value: 3 },
  { label: '3명', value: 4 },
  { label: '4명', value: 5 },
  { label: '5명', value: 6 },
  { label: '6명', value: 7 },
  { label: '7명', value: 8 },
];
const modeOptions = [
  { label: '오프라인', value: 'offline' },
  { label: '온라인', value: 'online' },
];
const periodOptions = [
  { label: '1개월 이하', value: 1 },
  { label: '2개월', value: 2 },
  { label: '3개월', value: 3 },
  { label: '4개월', value: 4 },
  { label: '5개월 이상', value: 5 },
];

const SearchProjectPage = () => {
  const [keyword, setKeyword] = useState('');
  const [filterOption, setFilterOption] = useState<{ [key: string]: string | number | null }>({
    status: null, // 진행 여부
    position: null, // 모집 포지션
    capacity: null, // 모집 입원
    mode: null, // 진행 방식
    age: null,
    'age-min': null, // 희망 나이대(이상)
    'age-max': null, // 희망 나이대(미만)
    period: null, // 예상 기간
    'expected-month': null, // 종료 예정일(?)
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  /* 옵션 세팅 */
  const positionOptions = POSITIONS.reduce(
    (acc, cur) => {
      acc.push({ label: cur.name, value: cur.id });
      return acc;
    },
    [] as { label: string; value: number }[]
  );
  positionOptions.splice(0, 0, { label: '전체', value: 0 });

  const ageRangeOptions = AGE_RANGES.reduce(
    (acc, cur) => {
      acc.push({ label: cur.label, value: cur.id });
      return acc;
    },
    [] as { label: string; value: number }[]
  );

  /* 이벤트 동작 함수 */
  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleChangeOptionValue = (key: string, value: string | number | null) => {
    console.log(key, value);
    setFilterOption(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClickSearch = () => {
    // TODO: 추후 API 요청
    console.log(keyword);
    console.log(filterOption);
    console.log(selectedDate);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>프로젝트</h1>

        <Button size="md" variant="secondary" radius="xsm">
          모집글 작성하기
        </Button>
      </div>

      <div className={styles.searchWrapper}>
        <Input
          type="text"
          width={'916px'}
          height={40}
          fontSize="var(--fs-xsmall)"
          placeholder="제목 또는 지역을 입력해주세요"
          border="1px solid var(--gray-2)"
          focusBorder="1px solid var(--gray-2)"
          backgroundColor="var(--white-3)"
          leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />}
          onChange={handleChangeKeyword}
        ></Input>

        <Button size="md" variant="secondary" radius="xsm" onClick={handleClickSearch}>
          검색하기
        </Button>
      </div>
      <div>
        <Select
          placeholder="진행 여부"
          width={154}
          height={32}
          options={statusOptions}
          value={filterOption.status as string | null | undefined}
          onChange={v => handleChangeOptionValue('status', v)}
        />
        <Select
          placeholder="모집 포지션"
          width={150}
          height={32}
          options={positionOptions}
          value={filterOption.position as number | null | undefined}
          onChange={v => handleChangeOptionValue('position', v)}
        />
        <Select
          placeholder="모집 인원"
          width={108}
          height={32}
          options={capacityOptions}
          value={filterOption.capacity as number | null | undefined}
          onChange={v => handleChangeOptionValue('capacity', v)}
        />
        <Select
          placeholder="진행 방식"
          width={108}
          height={32}
          options={modeOptions}
          value={filterOption.mode as string | null | undefined}
          onChange={v => handleChangeOptionValue('mode', v)}
        />
        <Select
          placeholder="희망 나이"
          width={108}
          height={32}
          options={ageRangeOptions}
          value={filterOption.age as number | null | undefined}
          onChange={v => handleChangeOptionValue('age', v)}
        />
        <Select
          placeholder="예상 기간"
          width={118}
          height={32}
          options={periodOptions}
          value={filterOption.period as number | null | undefined}
          onChange={v => handleChangeOptionValue('period', v)}
        />
        <DatePicker
          locale={ko}
          className={styles.datePicker}
          selected={selectedDate}
          onChange={date => setSelectedDate(date as Date)}
          dateFormat="yyyy.MM.dd"
        />
        <Button
          backgroundColor="none"
          textColor="var(--gray-1)"
          fontWeight="var(--fw-regular)"
          height={32}
          leftIcon={<ArrowClockwiseIcon />}
        >
          초기화
        </Button>
      </div>
    </div>
  );
};

export default SearchProjectPage;
