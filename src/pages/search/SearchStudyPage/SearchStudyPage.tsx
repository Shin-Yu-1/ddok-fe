import { useRef, useState, useEffect, useCallback } from 'react';

import { MagnifyingGlassIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

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

const STATUS_OPTIONS = [
  { label: '전체', value: '' },
  { label: '모집 중', value: 'RECRUITING' },
  { label: '스터디 진행 중', value: 'ONGOING' },
  { label: '스터디 종료', value: 'CLOSED' },
];

const CAPACITY_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  label: `${i + 1}명`,
  value: i + 1,
}));

const MODE_OPTIONS = [
  { label: '오프라인', value: 'offline' },
  { label: '온라인', value: 'online' },
];

const PERIOD_OPTIONS = [
  { label: '1개월 이하', value: 1 },
  { label: '2개월', value: 2 },
  { label: '3개월', value: 3 },
  { label: '4개월', value: 4 },
  { label: '5개월 이상', value: 5 },
];

const PAGE_SIZE = 6;
const MAX_AUTO_LOADS = 5;

const SearchStudyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: PAGE_SIZE });
  const [keyword, setKeyword] = useState('');
  const [submittedParams, setSubmittedParams] = useState<Record<string, string | number>>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [filterOption, setFilterOption] = useState<FilterOption>({
    status: null,
    type: null,
    capacity: null,
    mode: null,
    ageMin: null,
    ageMax: null,
    expectedMonth: null,
    startDate: null,
  });
  const [age, setAge] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<null | Date>(null);
  const [studyList, setStudyList] = useState<StudyItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoLoadsRef = useRef(0);
  const isFetchingRef = useRef(false);
  const lastLoadedPageRef = useRef(-1);
  const paramsChangedRef = useRef(false);

  const { data: responseData, isLoading } = useGetApi<StudySearchApiResponse>({
    url: 'api/studies/search',
    params: submittedParams,
  });

  const studyOptions = [
    { label: '전체', value: null },
    ...STUDY_TRAITS.map(trait => ({ label: trait.name, value: trait.name as StudyType })),
  ];

  const ageRangeOptions = (() => {
    const options: { label: string; value: number }[] = [];
    let hasOver50 = false;

    for (const range of AGE_RANGES) {
      if (range.id < 50) {
        options.push({ label: range.label, value: range.id });
      } else if (!hasOver50) {
        options.push({ label: '50대 이상', value: range.id });
        hasOver50 = true;
      }
    }

    return options;
  })();

  useEffect(() => {
    if (!responseData?.data?.items) return;

    const newItems = responseData.data.items;
    const responsePagination = responseData.data.pagination;

    if (paramsChangedRef.current || responsePagination.currentPage === 0) {
      setStudyList(newItems);
      paramsChangedRef.current = false;
    } else {
      setStudyList(prev => {
        const existingIds = new Set(prev.map(item => item.studyId));
        const filteredNewItems = newItems.filter(item => !existingIds.has(item.studyId));
        return [...prev, ...filteredNewItems];
      });
    }

    setHasMore(responsePagination.currentPage < responsePagination.totalPages - 1);
    setPagination({
      page: responsePagination.currentPage,
      size: responsePagination.pageSize,
    });

    lastLoadedPageRef.current = responsePagination.currentPage;
    isFetchingRef.current = false;
  }, [responseData]);

  const ensureScrollable = useCallback(() => {
    const listEl = document.querySelector(`.${styles.cardListWrapper}`) as HTMLElement | null;
    const isListScrollable = listEl && listEl.scrollHeight > listEl.clientHeight;
    const isPageScrollable = document.documentElement.scrollHeight > window.innerHeight;
    const scrollable = isListScrollable || isPageScrollable;

    if (!scrollable && !isFetchingRef.current && hasMore && autoLoadsRef.current < MAX_AUTO_LOADS) {
      autoLoadsRef.current += 1;
      isFetchingRef.current = true;

      const nextPage = pagination.page + 1;
      const updatedParams = {
        ...submittedParams,
        page: nextPage,
      };

      setSubmittedParams(updatedParams);
    }
  }, [hasMore, pagination.page, submittedParams]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !isFetchingRef.current &&
          autoLoadsRef.current < MAX_AUTO_LOADS
        ) {
          autoLoadsRef.current += 1;
          isFetchingRef.current = true;

          const nextPage = pagination.page + 1;
          const updatedParams = {
            ...submittedParams,
            page: nextPage,
          };

          setSubmittedParams(updatedParams);
        }
      },
      {
        root: null,
        rootMargin: '100px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, pagination.page, submittedParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ensureScrollable();
    }, 100);

    return () => clearTimeout(timer);
  }, [studyList, ensureScrollable]);

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleChangeAge = (value: number | null) => {
    setAge(value);

    const findValue = AGE_RANGES.find(item => item.id === value)?.value;

    setFilterOption(prev => ({
      ...prev,
      ageMin: findValue?.min ?? null,
      ageMax: findValue?.max ?? null,
    }));
  };

  const handleChangeOptionValue = (key: string, value: string | number | null) => {
    console.log(key, value);
    setFilterOption(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    const raw = e.currentTarget.value;
    setKeyword(raw.trim());
    handleClickSearch();
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
    setAge(null);
    setStartDate(null);
  };

  const handleClickCard = (item: StudyItem | null) => {
    if (item) {
      navigate(`/detail/study/${item.studyId}`);
    }
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

    const start = startDate ? dayjs(startDate).locale('ko').format('YYYY-MM-DD') : null;

    return {
      ...(keyword && { keyword }),
      ...validFilters,
      ...(start && { startDate: start }),
      page: 0,
      size: PAGE_SIZE,
    };
  };

  const handleClickSearch = () => {
    autoLoadsRef.current = 0;
    isFetchingRef.current = false;
    lastLoadedPageRef.current = -1;
    paramsChangedRef.current = true;
    setStudyList([]);
    setHasMore(true);
    setPagination(prev => ({ ...prev, page: 0 }));

    const newParams = buildParams();
    setSubmittedParams(newParams);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>스터디</h1>

        {isLoggedIn && (
          <Button
            size="md"
            variant="secondary"
            radius="xsm"
            onClick={() => {
              navigate('/create/study');
            }}
          >
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
            leftIcon={<MagnifyingGlassIcon size={20} weight="light" />}
            onChange={handleChangeKeyword}
            onKeyDown={handleEnter}
          />

          <Button size="md" variant="secondary" radius="xsm" onClick={handleClickSearch}>
            검색하기
          </Button>
        </div>

        <div className={styles.filterOptionsWrapper}>
          <div className={styles.optionsGroup}>
            <Select
              placeholder="진행 여부"
              width={140}
              height={32}
              options={STATUS_OPTIONS}
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
              options={CAPACITY_OPTIONS}
              value={filterOption.capacity as number | null | undefined}
              onChange={v => handleChangeOptionValue('capacity', v)}
            />
            <Select
              placeholder="진행 방식"
              width={108}
              height={32}
              options={MODE_OPTIONS}
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
              options={PERIOD_OPTIONS}
              value={filterOption.expectedMonth as number | null | undefined}
              onChange={v => handleChangeOptionValue('expectedMonth', v)}
            />
            <DatePicker
              locale={ko}
              className={styles.datePicker}
              selected={startDate}
              onChange={date => setStartDate(date || new Date())}
              dateFormat="yyy-MM-dd"
              placeholderText="시작일 선택"
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
        {studyList.map(item => (
          <SearchCard
            clickHandle={item => handleClickCard(item as StudyItem)}
            key={item.studyId}
            item={{ ...item, bannerImageUrl: item.bannerImageUrl || '' }}
          />
        ))}

        {isLoading && (
          <>
            {Array.from({ length: 2 }, (_, index) => (
              <SearchCard key={index} isLoading={true} item={null} />
            ))}
          </>
        )}

        {!isLoading && studyList.length === 0 && (
          <span className={styles.warning}>스터디가 없습니다.</span>
        )}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};

export default SearchStudyPage;
