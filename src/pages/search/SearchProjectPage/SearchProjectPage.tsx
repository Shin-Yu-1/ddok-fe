import { useCallback, useRef, useState, useEffect } from 'react';

import { MagnifyingGlassIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import SearchCard from '@/components/SearchCard/SearchCard';
import Select from '@/components/Select/Select';
import { AGE_RANGES } from '@/constants/ageRanges';
import { POSITIONS } from '@/constants/positions';
import type { ProjectItem } from '@/schemas/project.schema';
import { useAuthStore } from '@/stores/authStore';
import type { Pagination } from '@/types/pagination.types';
import type { TeamStatus } from '@/types/project';

import styles from './SearchProjectPage.module.scss';

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
// TODO: API 연동 시 제거
const projectListDummy = [
  {
    projectId: 1,
    title: '구지라지 프로젝트',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['백엔드', '프론트엔드'],
    capacity: 4,
    mode: 'offline',
    address: '서울 마포구',
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },
  {
    projectId: 2,
    title: '구라라지 프로젝트',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['백엔드', '프론트엔드'],
    capacity: 4,
    mode: 'online',
    address: 'online',
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },
  {
    projectId: 3,
    title: '구라지라 프로젝트',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    positions: ['백엔드', '프론트엔드'],
    capacity: 4,
    mode: 'online',
    address: 'online',
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },
  {
    projectId: 4,
    title: 'AI 챗봇 플랫폼 개발',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['머신러닝', '서버', 'QA'],
    capacity: 6,
    mode: 'offline',
    address: '서울 강남구',
    preferredAges: { ageMin: 23, ageMax: 35 },
    expectedMonth: 5,
    startDate: '2025-10-01',
  },
  {
    projectId: 5,
    title: '게임 클라이언트 엔진 리팩토링',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['게임', '풀스택'],
    capacity: 5,
    mode: 'online',
    address: 'online',
    preferredAges: { ageMin: 18, ageMax: 29 },
    expectedMonth: 8,
    startDate: '2025-08-20',
  },
  {
    projectId: 6,
    title: '모바일 뱅킹 앱 보안 강화',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    positions: ['보안', '모바일', '데브옵스'],
    capacity: 7,
    mode: 'offline',
    address: '부산 해운대구',
    preferredAges: { ageMin: 25, ageMax: 40 },
    expectedMonth: 4,
    startDate: '2025-06-15',
  },
  {
    projectId: 7,
    title: '데이터 분석 파이프라인 구축',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['데이터 엔지니어', '백엔드', '프론트엔드'],
    capacity: 8,
    mode: 'offline',
    address: '대전 유성구',
    preferredAges: { ageMin: 22, ageMax: 38 },
    expectedMonth: 6,
    startDate: '2025-11-05',
  },
  {
    projectId: 8,
    title: '스타트업 SaaS 웹서비스 런칭',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['기획자', 'PM', '프론트엔드', '디자이너'],
    capacity: 10,
    mode: 'hybrid',
    address: '서울 성동구',
    preferredAges: { ageMin: 21, ageMax: 32 },
    expectedMonth: 10,
    startDate: '2025-07-30',
  },
  {
    projectId: 9,
    title: '자동화 테스트 시스템 구축',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    positions: ['QA', '풀스택', '데브옵스'],
    capacity: 6,
    mode: 'offline',
    address: '인천 연수구',
    preferredAges: { ageMin: 26, ageMax: 36 },
    expectedMonth: 9,
    startDate: '2025-05-15',
  },
  {
    projectId: 10,
    title: '클라우드 인프라 최적화',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['서버', '데브옵스', '보안'],
    capacity: 5,
    mode: 'online',
    address: 'online',
    preferredAges: { ageMin: 24, ageMax: 33 },
    expectedMonth: 3,
    startDate: '2025-12-01',
  },
  {
    projectId: 11,
    title: '헬스케어 플랫폼 앱 개발',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['모바일', '백엔드', 'QA'],
    capacity: 6,
    mode: 'offline',
    address: '서울 서초구',
    preferredAges: { ageMin: 23, ageMax: 34 },
    expectedMonth: 6,
    startDate: '2025-09-20',
  },
  {
    projectId: 12,
    title: '자동차 IoT 시스템 구축',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['데브옵스', '서버', '보안'],
    capacity: 9,
    mode: 'offline',
    address: '울산 남구',
    preferredAges: { ageMin: 28, ageMax: 45 },
    expectedMonth: 12,
    startDate: '2025-08-10',
  },
  {
    projectId: 13,
    title: '전자상거래 추천 알고리즘 연구',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['머신러닝', '데이터 엔지니어'],
    capacity: 7,
    mode: 'online',
    address: 'online',
    preferredAges: { ageMin: 25, ageMax: 38 },
    expectedMonth: 9,
    startDate: '2025-10-15',
  },
  {
    projectId: 14,
    title: '게임 서버 인프라 구축',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    positions: ['게임', '서버', '데브옵스'],
    capacity: 8,
    mode: 'offline',
    address: '광주 북구',
    preferredAges: { ageMin: 22, ageMax: 35 },
    expectedMonth: 5,
    startDate: '2025-06-01',
  },
  {
    projectId: 15,
    title: '핀테크 서비스 UI/UX 개선',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['디자이너', '기획자', '프론트엔드'],
    capacity: 6,
    mode: 'hybrid',
    address: '서울 강동구',
    preferredAges: { ageMin: 21, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-07-25',
  },
  {
    projectId: 16,
    title: 'AI 음성인식 시스템 개발',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['머신러닝', '데이터 엔지니어'],
    capacity: 5,
    mode: 'offline',
    address: '대구 달서구',
    preferredAges: { ageMin: 25, ageMax: 40 },
    expectedMonth: 7,
    startDate: '2025-09-05',
  },
  {
    projectId: 17,
    title: '스마트홈 자동화 서비스',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    positions: ['모바일', '풀스택', 'QA'],
    capacity: 8,
    mode: 'offline',
    address: '수원 영통구',
    preferredAges: { ageMin: 27, ageMax: 38 },
    expectedMonth: 4,
    startDate: '2025-05-10',
  },
  {
    projectId: 18,
    title: 'AI 기반 이미지 분석 솔루션',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['머신러닝', '백엔드', '프론트엔드'],
    capacity: 7,
    mode: 'online',
    address: 'online',
    preferredAges: { ageMin: 23, ageMax: 33 },
    expectedMonth: 8,
    startDate: '2025-11-10',
  },
  {
    projectId: 19,
    title: '대규모 웹서비스 트래픽 최적화',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['데브옵스', '서버', '보안'],
    capacity: 9,
    mode: 'hybrid',
    address: '서울 용산구',
    preferredAges: { ageMin: 25, ageMax: 37 },
    expectedMonth: 10,
    startDate: '2025-07-15',
  },
  {
    projectId: 20,
    title: '메타버스 플랫폼 기획 및 개발',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    positions: ['게임', '기획자', '디자이너'],
    capacity: 12,
    mode: 'offline',
    address: '성남 분당구',
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 12,
    startDate: '2025-12-20',
  },
];
// TODO: API 연동 시 제거
const tempChunk = ({ page, size }: Pagination) => {
  const pageSize = Math.max(1, size | 0);
  const totalItems = projectListDummy.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page | 0), totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);

  const items = projectListDummy.slice(start, end);

  return {
    items,
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalItems,
    },
  };
};

const PAGE_SIZE = 6;
const MAX_AUTO_LOADS = 5;

const SearchProjectPage = () => {
  const { isLoggedIn } = useAuthStore();
  const [pagination, setPagination] = useState<Pagination>({ page: 1, size: PAGE_SIZE });
  const [keyword, setKeyword] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>({
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
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoLoadsRef = useRef(0);
  const isFetchingRef = useRef(false);

  const loadProjects = useCallback(async (page: number, isNewSearch: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const { items: newProjects, pagination: responsePagination } = tempChunk({
        page,
        size: PAGE_SIZE,
      });

      setProjectList(prev => (isNewSearch ? newProjects : [...prev, ...newProjects]));

      setHasMore(responsePagination.currentPage < responsePagination.totalPages);

      setPagination({
        page: responsePagination.currentPage,
        size: responsePagination.pageSize,
      });
    } catch (error) {
      console.error('플레이어 목록 로드 실패:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, []);

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
          loadProjects(pagination.page + 1, false);
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
  }, [loadProjects, hasMore, isLoading, pagination.page]);

  useEffect(() => {
    loadProjects(1, true);
  }, []);

  /* 옵션 세팅 */
  const positionOptions = POSITIONS.reduce(
    (acc, cur) => {
      acc.push({ label: cur.name, value: cur.id });
      return acc;
    },
    [] as { label: string; value: number }[]
  );
  positionOptions.splice(0, 0, { label: '전체', value: 0 });

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
    setPagination({ page: 1, size: PAGE_SIZE });
    loadProjects(1, true);
  };

  const handleClickSearch = () => {
    // TODO: 추후 API 요청
    console.log(keyword);
    console.log(filterOption);
    console.log(selectedDate);

    // TODO: 초기화 버튼 클릭 시 동작 확인 후 주석 또는 코드 제거
    // autoLoadsRef.current = 0;
    // setPagination({ page: 1, size: PAGE_SIZE });
    // loadProjects(1, true);
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
          ></Input>

          <Button size="md" variant="secondary" radius="xsm" onClick={handleClickSearch}>
            검색하기
          </Button>
        </div>
        <div className={styles.filterOptionsWrapper}>
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
            onChange={date => setSelectedDate(date || new Date())}
            dateFormat="yyyy.MM.dd"
          />
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
            key={item.projectId}
            item={{ ...item, bannerImageUrl: item.bannerImageUrl || '' }}
          />
        ))}
      </div>
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};

export default SearchProjectPage;
