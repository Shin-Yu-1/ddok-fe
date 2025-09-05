import { useRef, useState, useEffect } from 'react';

import { MagnifyingGlassIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import SearchCard from '@/components/SearchCard/SearchCard';
import Select from '@/components/Select/Select';
import { AGE_RANGES } from '@/constants/ageRanges';
import { STUDY_TRAITS } from '@/constants/studyTraits';
import { useGetApi } from '@/hooks/useGetApi';
import type { StudyItem, StudySearchApiResponse } from '@/schemas/study.schema';
import { useAuthStore } from '@/stores/authStore';
import type { Pagination } from '@/types/pagination.types';

import styles from './SearchStudyPage.module.scss';

type FilterOption = {
  [key: string]: string | number | null;
};

// TODO: API 연동 시 수정
const statusOptions = [
  { label: '전체', value: '0' },
  { label: '모집 중', value: '1' },
  { label: '프로젝트 진행 중', value: '2' },
  { label: '프로젝트 종료', value: '3' },
];
// TODO: API 연동 시 수정
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
// TODO: API 연동 시 수정
const modeOptions = [
  { label: '오프라인', value: 'offline' },
  { label: '온라인', value: 'online' },
];
// TODO: API 연동 시 수정
const periodOptions = [
  { label: '1개월 이하', value: 1 },
  { label: '2개월', value: 2 },
  { label: '3개월', value: 3 },
  { label: '4개월', value: 4 },
  { label: '5개월 이상', value: 5 },
];

const PAGE_SIZE = 6;
const MAX_AUTO_LOADS = 5;

const SearchStudyPage = () => {
  const { isLoggedIn } = useAuthStore();
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: PAGE_SIZE });
  const [keyword, setKeyword] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>({
    status: null, // 진행 여부
    studyType: null, // 스터디 주제
    capacity: null, // 모집 입원
    mode: null, // 진행 방식
    age: null,
    'age-min': null, // 희망 나이대(이상)
    'age-max': null, // 희망 나이대(미만)
    period: null, // 예상 기간
    'expected-month': null, // 종료 예정일(?)
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [studyList, setStudyList] = useState<StudyItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoLoadsRef = useRef(0);
  const {
    data: responseData,
    isLoading,
    refetch,
  } = useGetApi<StudySearchApiResponse>({
    url: 'api/studies/search',
    params: { ...(keyword && { keyword }), ...pagination },
  });

  useEffect(() => {
    if (responseData?.data?.items) {
      setStudyList((prev: StudyItem[]) => {
        const safeNewProjects = responseData?.data?.items || [];
        const existingIds = new Set(prev.map(item => item.studyId));
        const filteredNewProjects = safeNewProjects.filter(item => !existingIds.has(item.studyId));
        return [...prev, ...filteredNewProjects];
      });
    }

    if (responseData?.data?.pagination) {
      const responsePagination = responseData?.data?.pagination;
      setHasMore(responsePagination.currentPage < responsePagination.totalPages);

      setPagination({
        page: responsePagination.currentPage,
        size: responsePagination.pageSize,
      });
    }
  }, [responseData]);

  // 무한 스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          hasMore &&
          !isLoading &&
          autoLoadsRef.current < MAX_AUTO_LOADS
        ) {
          autoLoadsRef.current += 1;
          // loadProjects(pagination.page + 1, false);
          refetch();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoading, pagination.page]);

  // 초기 데이터 로드
  // useEffect(() => {
  //   loadProjects(1, true);
  // }, []);

  /* 옵션 세팅 */
  const studyOptions = STUDY_TRAITS.reduce(
    (acc, cur) => {
      acc.push({ label: cur.name, value: cur.id });
      return acc;
    },
    [] as { label: string; value: number }[]
  );
  studyOptions.splice(0, 0, { label: '전체', value: 0 });

  const ageRangeOptions = (() => {
    const options: { label: string; value: number }[] = [];
    let hasOver50 = false;

    for (const cur of AGE_RANGES) {
      if (cur.id < 50) {
        options.push({ label: cur.label, value: cur.id });
      } else if (!hasOver50) {
        options.push({ label: '50대 이상', value: cur.id });
        hasOver50 = true;
      }
    }

    return options;
  })();

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

  const handleClickReset = () => {
    setKeyword('');
    setFilterOption({
      status: null,
      position: null,
      capacity: null,
      mode: null,
      age: null,
      'age-min': null,
      'age-max': null,
      period: null,
      'expected-month': null,
    });
    setSelectedDate(new Date());
    // 초기화 후 첫 페이지부터 다시 로드
    autoLoadsRef.current = 0;
    setStudyList([]); // 기존 데이터 초기화
    setHasMore(true);
    setPagination({ page: 1, size: PAGE_SIZE });
    refetch();
  };

  const handleClickSearch = () => {
    // TODO: 추후 API 요청
    console.log(keyword);
    console.log(filterOption);
    console.log(selectedDate);

    // 검색 시 첫 페이지부터 다시 로드
    autoLoadsRef.current = 0;
    setStudyList([]); // 기존 데이터 초기화
    setHasMore(true);
    setPagination({ page: 1, size: PAGE_SIZE });
    refetch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>스터디</h1>

        {isLoggedIn && (
          <Button size="md" variant="secondary" radius="xsm">
            모집글 작성하기
          </Button>
        )}
      </div>
      <div className={styles.searchWrapper}>
        <div className={styles.inputWrapper}>
          <Input
            type="text"
            width={'916px'}
            height={40}
            value={keyword}
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
        <div className={styles.filterOptionsWrapper}>
          <div className={styles.optionsGroup}>
            <Select
              placeholder="진행 여부"
              width={154}
              height={32}
              options={statusOptions}
              value={filterOption.status as string | null | undefined}
              onChange={v => handleChangeOptionValue('status', v)}
            />
            <Select
              placeholder="스터디 유형"
              width={122}
              height={32}
              options={studyOptions}
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
              onChange={date => setSelectedDate(date || new Date())}
              dateFormat="yyyy.MM.dd"
            />
          </div>
          <Button
            backgroundColor="none"
            textColor="var(--gray-1)"
            fontWeight="var(--fw-regular)"
            height={32}
            padding={'0px'}
            leftIcon={<ArrowClockwiseIcon />}
            onClick={handleClickReset}
          >
            초기화
          </Button>
        </div>
      </div>

      <div className={styles.cardListWrapper}>
        {studyList.length == 0 && <span className={styles.warning}>스터디가 없습니다.</span>}
        {studyList.map(item => (
          <SearchCard
            key={item.studyId}
            item={{ ...item, bannerImageUrl: item.bannerImageUrl || '' }}
          />
        ))}
      </div>
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};

export default SearchStudyPage;
