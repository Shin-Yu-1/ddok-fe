import { useRef, useState, useEffect } from 'react';

import { MagnifyingGlassIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import DatePicker from 'react-datepicker';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import SearchCard from '@/components/SearchCard/SearchCard';
import Select from '@/components/Select/Select';
import { AGE_RANGES } from '@/constants/ageRanges';
import { STUDY_TRAITS } from '@/constants/studyTraits';
import { useGetApi } from '@/hooks/useGetApi';
import type { StudyItem, StudySearchApiResponse, StudyType } from '@/schemas/study.schema';
import { useAuthStore } from '@/stores/authStore';
import type { Pagination } from '@/types/pagination.types';

import styles from './SearchStudyPage.module.scss';

type FilterOption = {
  [key: string]: string | number | StudyType | null;
};

const statusOptions = [
  { label: '전체', value: '' },
  { label: '모집 중', value: 'RECRUITING' },
  { label: '프로젝트 진행 중', value: 'ONGOING' },
  { label: '프로젝트 종료', value: 'CLOSED' },
];
const capacityOptions = [
  { label: '1명', value: 1 },
  { label: '2명', value: 2 },
  { label: '3명', value: 3 },
  { label: '4명', value: 4 },
  { label: '5명', value: 5 },
  { label: '6명', value: 6 },
  { label: '7명', value: 7 },
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
  const [submittedParams, setSubmittedParams] = useState<Record<string, string | number>>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [filterOption, setFilterOption] = useState<FilterOption>({
    status: null, // 진행 여부
    type: null, // 스터디 유형
    capacity: null, // 모집 입원
    mode: null, // 진행 방식
    ageMin: null, // 희망 나이대(이상)
    ageMax: null, // 희망 나이대(미만)
    expectedMonth: null, // 예상 개월 수
    startDate: null,
  });
  const [age, setAge] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(new Date());
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
    params: submittedParams,
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

  /* 옵션 세팅 */
  const studyOptions = STUDY_TRAITS.reduce(
    (acc, cur) => {
      acc.push({ label: cur.name, value: cur.name as StudyType });
      return acc;
    },
    [] as { label: string; value: StudyType | null }[]
  );
  studyOptions.splice(0, 0, { label: '전체', value: null });

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

  const handleChangeAge = (value: number | null) => {
    setAge(value);

    const findValue = AGE_RANGES.find(item => item.id === value)?.value;

    setFilterOption(prev => ({
      ...prev,
      ageMin: findValue ? findValue.min : null,
      ageMax: findValue ? findValue.max : null,
    }));
  };

  const handleChangeOptionValue = (key: string, value: string | number | null) => {
    setFilterOption(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClickReset = () => {
    setKeyword('');
    setFilterOption({
      status: null,
      type: null,
      capacity: null,
      mode: null,
      age: null,
      ageMin: null,
      ageMax: null,
      expectedMonth: null,
    });
    setStartDate(new Date());
  };

  const buildParams = () => {
    const validFilters = Object.entries(filterOption).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value as string | number;
        }
        return acc;
      },
      {} as Record<string, string | number>
    );

    const start = dayjs(startDate).locale('ko').format('YYYY-MM-DD');

    return {
      ...(keyword && { keyword }),
      ...validFilters,
      startDate: start,
      page: 0,
      size: PAGE_SIZE,
    };
  };

  const handleClickSearch = () => {
    autoLoadsRef.current = 0;
    setStudyList([]);
    setHasMore(true);

    setSubmittedParams(buildParams());
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
              value={filterOption.type as StudyType | null | undefined}
              onChange={v => handleChangeOptionValue('type', v)}
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
              width={114}
              height={32}
              options={ageRangeOptions}
              value={age as number | null | undefined}
              onChange={v => handleChangeAge(v)}
            />
            <Select
              placeholder="예상 기간"
              width={118}
              height={32}
              options={periodOptions}
              value={filterOption.expectedMonth as number | null | undefined}
              onChange={v => handleChangeOptionValue('expectedMonth', v)}
            />
            <DatePicker
              locale={ko}
              className={styles.datePicker}
              selected={startDate}
              onChange={date => setStartDate(date || new Date())}
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
