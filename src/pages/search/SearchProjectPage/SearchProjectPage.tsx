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
import { POSITIONS } from '@/constants/positions';
import { useGetApi } from '@/hooks/useGetApi';
import type { ProjectItem, ProjectSearchApiResponse } from '@/schemas/project.schema';
import { useAuthStore } from '@/stores/authStore';
import type { Pagination } from '@/types/pagination.types';

import styles from './SearchProjectPage.module.scss';

type FilterOption = {
  [key: string]: string | number | null;
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

const PAGE_SIZE = 2;
const MAX_AUTO_LOADS = 5;

const SearchProjectPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: PAGE_SIZE });
  const [submittedParams, setSubmittedParams] = useState<Record<string, string | number>>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [keyword, setKeyword] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>({
    status: null,
    position: null,
    capacity: null,
    mode: null,
    ageMin: null,
    ageMax: null,
    expectedMonth: null,
    startDate: null,
  });
  const [age, setAge] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<null | Date>(null);
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoLoadsRef = useRef(0);
  const isFetchingRef = useRef(false);
  const lastLoadedPageRef = useRef(-1);
  const paramsChangedRef = useRef(false);

  const { data: responseData, isLoading } = useGetApi<ProjectSearchApiResponse>({
    url: 'api/projects/search',
    params: submittedParams,
  });

  // API 응답 처리
  useEffect(() => {
    if (!responseData?.data?.items) return;

    const newItems = responseData.data.items;
    const responsePagination = responseData.data.pagination;

    if (paramsChangedRef.current || responsePagination.currentPage === 0) {
      setProjectList(newItems);
      paramsChangedRef.current = false;
    } else {
      setProjectList(prev => {
        const existingIds = new Set(prev.map(item => item.projectId));
        const filteredNewItems = newItems.filter(item => !existingIds.has(item.projectId));
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
    const timer = setTimeout(() => {
      ensureScrollable();
    }, 100);

    return () => clearTimeout(timer);
  }, [projectList, ensureScrollable]);

  const positionOptions = POSITIONS.reduce(
    (acc, cur) => {
      acc.push({ label: cur.name, value: cur.name });
      return acc;
    },
    [] as { label: string; value: string | null }[]
  );
  positionOptions.splice(0, 0, { label: '전체', value: null });

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
      position: null,
      capacity: null,
      mode: null,
      ageMin: null,
      ageMax: null,
      expectedMonth: null,
    });
    setAge(null);
    setStartDate(null);
  };

  const handleClickCard = (item: ProjectItem | null) => {
    if (item) {
      navigate(`/detail/project/${item.projectId}`);
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
    setProjectList([]);
    setHasMore(true);

    const newParams = buildParams();
    setSubmittedParams(newParams);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>프로젝트</h1>

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
          />

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
              placeholder="모집 포지션"
              width={150}
              height={32}
              options={positionOptions}
              value={filterOption.position as string | null | undefined}
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
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일 선택"
            />
          </div>
          <Button
            backgroundColor="none"
            textColor="var(--gray-1)"
            fontWeight="var(--fw-regular)"
            height={32}
            leftIcon={<ArrowClockwiseIcon />}
            onClick={handleClickReset}
          >
            초기화
          </Button>
        </div>
      </div>

      <div className={styles.cardListWrapper}>
        {projectList.map(item => (
          <SearchCard
            clickHandle={item => handleClickCard(item as ProjectItem)}
            item={{ ...item, bannerImageUrl: item.bannerImageUrl || '' }}
          />
        ))}

        {/* 로딩 상태 표시 */}
        {isLoading && (
          <>
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <SearchCard key={index} isLoading={true} item={null} />
            ))}
          </>
        )}

        {/* 검색 결과가 없을 때 */}
        {!isLoading && projectList.length === 0 && (
          <span className={styles.warning}>프로젝트가 없습니다.</span>
        )}
      </div>

      {/* 무한 스크롤을 위한 센티널 */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};

export default SearchProjectPage;
