import { useCallback, useRef, useState, useEffect } from 'react';

import { MagnifyingGlassIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import SearchCard from '@/components/SearchCard/SearchCard';
import Select from '@/components/Select/Select';
import { AGE_RANGES } from '@/constants/ageRanges';
import { STUDY_TRAITS } from '@/constants/studyTraits';
import type { StudyType, StudyItem } from '@/schemas/study.schema';
import { useAuthStore } from '@/stores/authStore';
import type { Pagination } from '@/types/pagination.types';
import type { TeamStatus } from '@/types/project';

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
// TODO: API 연동 시 제거
export const studyListDummy = [
  {
    studyId: 1,
    title: '구지라지 프로젝트',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 4,
    mode: 'offline',
    address: '서울 마포구',
    studyType: '자격증 취득' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },
  {
    studyId: 2,
    title: '구지라 프로젝트',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 4,
    mode: 'offline',
    address: '서울 마포구',
    studyType: '자소서' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-09-10',
  },
  {
    studyId: 3,
    title: '프론트엔드 면접 대비 스터디',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 6,
    mode: 'online',
    address: 'online',
    studyType: '취업/면접' as StudyType,
    preferredAges: { ageMin: 22, ageMax: 32 },
    expectedMonth: 2,
    startDate: '2025-09-15',
  },
  {
    studyId: 4,
    title: '영어 회화 스터디',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 5,
    mode: 'offline',
    address: '서울 강남구',
    studyType: '어학' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 35 },
    expectedMonth: 4,
    startDate: '2025-09-20',
  },
  {
    studyId: 5,
    title: '자격증 취득 스터디 - 정보처리기사',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 8,
    mode: 'offline',
    address: '부산 해운대구',
    studyType: '자격증 취득' as StudyType,
    preferredAges: { ageMin: 21, ageMax: 36 },
    expectedMonth: 5,
    startDate: '2025-10-05',
  },
  {
    studyId: 6,
    title: '독서 토론 모임',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    capacity: 10,
    mode: 'offline',
    address: '대구 달서구',
    studyType: '취미/교양' as StudyType,
    preferredAges: { ageMin: 25, ageMax: 40 },
    expectedMonth: 6,
    startDate: '2025-06-15',
  },
  {
    studyId: 7,
    title: '데이터 분석 프로젝트',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 7,
    mode: 'online',
    address: 'online',
    studyType: '자기 개발' as StudyType,
    preferredAges: { ageMin: 23, ageMax: 38 },
    expectedMonth: 3,
    startDate: '2025-09-25',
  },
  {
    studyId: 8,
    title: '포트폴리오 제작 스터디',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 6,
    mode: 'offline',
    address: '서울 성동구',
    studyType: '취업/면접' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 32 },
    expectedMonth: 2,
    startDate: '2025-08-30',
  },
  {
    studyId: 9,
    title: '프로그래밍 알고리즘 스터디',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 8,
    mode: 'offline',
    address: '서울 서초구',
    studyType: '자기 개발' as StudyType,
    preferredAges: { ageMin: 22, ageMax: 33 },
    expectedMonth: 4,
    startDate: '2025-09-05',
  },
  {
    studyId: 10,
    title: '프리토킹 영어 회화',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 5,
    mode: 'online',
    address: 'online',
    studyType: '어학' as StudyType,
    preferredAges: { ageMin: 18, ageMax: 28 },
    expectedMonth: 3,
    startDate: '2025-09-08',
  },
  {
    studyId: 11,
    title: '리더십 개발 스터디',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    capacity: 6,
    mode: 'offline',
    address: '대전 유성구',
    studyType: '자기 개발' as StudyType,
    preferredAges: { ageMin: 27, ageMax: 40 },
    expectedMonth: 5,
    startDate: '2025-07-12',
  },
  {
    studyId: 12,
    title: 'JLPT N1 대비 스터디',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 6,
    mode: 'offline',
    address: '서울 종로구',
    studyType: '어학' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 35 },
    expectedMonth: 6,
    startDate: '2025-11-01',
  },
  {
    studyId: 13,
    title: '사진 촬영 기초 스터디',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 8,
    mode: 'offline',
    address: '부산 수영구',
    studyType: '취미/교양' as StudyType,
    preferredAges: { ageMin: 19, ageMax: 29 },
    expectedMonth: 4,
    startDate: '2025-09-28',
  },
  {
    studyId: 14,
    title: '생활습관 개선 챌린지',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    capacity: 10,
    mode: 'online',
    address: 'online',
    studyType: '생활' as StudyType,
    preferredAges: { ageMin: 25, ageMax: 40 },
    expectedMonth: 2,
    startDate: '2025-06-10',
  },
  {
    studyId: 15,
    title: '코딩 부트캠프 준비반',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 12,
    mode: 'offline',
    address: '서울 강동구',
    studyType: '자기 개발' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-09-12',
  },
  {
    studyId: 16,
    title: '취미로 배우는 수채화',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 7,
    mode: 'offline',
    address: '인천 연수구',
    studyType: '취미/교양' as StudyType,
    preferredAges: { ageMin: 23, ageMax: 35 },
    expectedMonth: 5,
    startDate: '2025-08-22',
  },
  {
    studyId: 17,
    title: '프로그래밍 언어 스터디 - Rust',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 6,
    mode: 'online',
    address: 'online',
    studyType: '자기 개발' as StudyType,
    preferredAges: { ageMin: 22, ageMax: 34 },
    expectedMonth: 4,
    startDate: '2025-09-30',
  },
  {
    studyId: 18,
    title: '면접 모의 스터디',
    teamStatus: 'RECRUITING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 6,
    mode: 'offline',
    address: '서울 노원구',
    studyType: '취업/면접' as StudyType,
    preferredAges: { ageMin: 21, ageMax: 30 },
    expectedMonth: 3,
    startDate: '2025-10-02',
  },
  {
    studyId: 19,
    title: '기타 연습 모임',
    teamStatus: 'CLOSED' as TeamStatus,
    bannerImageUrl: '',
    capacity: 5,
    mode: 'offline',
    address: '광주 북구',
    studyType: '취미/교양' as StudyType,
    preferredAges: { ageMin: 20, ageMax: 33 },
    expectedMonth: 2,
    startDate: '2025-06-20',
  },
  {
    studyId: 20,
    title: 'IT 트렌드 리서치 스터디',
    teamStatus: 'ONGOING' as TeamStatus,
    bannerImageUrl: '',
    capacity: 9,
    mode: 'online',
    address: 'online',
    studyType: '기타' as StudyType,
    preferredAges: { ageMin: 24, ageMax: 38 },
    expectedMonth: 5,
    startDate: '2025-09-18',
  },
];
// TODO: API 연동 시 제거
const tempChunk = ({ page, size }: Pagination) => {
  const pageSize = Math.max(1, size | 0);
  const totalItems = studyListDummy.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page | 0), totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);

  const items = studyListDummy.slice(start, end);

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

const SearchStudyPage = () => {
  const { isLoggedIn } = useAuthStore();
  const [pagination, setPagination] = useState<Pagination>({ page: 1, size: PAGE_SIZE });
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
  const [projectList, setProjectList] = useState<StudyItem[]>([]);
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

      setProjectList(prev => {
        if (isNewSearch) {
          return newProjects;
        } else {
          // 중복 제거를 위해 기존 항목의 ID들을 Set으로 관리
          const existingIds = new Set(prev.map(item => item.studyId));
          const filteredNewProjects = newProjects.filter(item => !existingIds.has(item.studyId));
          return [...prev, ...filteredNewProjects];
        }
      });

      // 더 이상 로드할 데이터가 없는지 확인
      setHasMore(responsePagination.currentPage < responsePagination.totalPages);

      // pagination 상태 업데이트
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

  // 초기 데이터 로드
  useEffect(() => {
    loadProjects(1, true);
  }, []);

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
    setProjectList([]); // 기존 데이터 초기화
    setHasMore(true);
    setPagination({ page: 1, size: PAGE_SIZE });
    loadProjects(1, true);
  };

  const handleClickSearch = () => {
    // TODO: 추후 API 요청
    console.log(keyword);
    console.log(filterOption);
    console.log(selectedDate);

    // 검색 시 첫 페이지부터 다시 로드
    autoLoadsRef.current = 0;
    setProjectList([]); // 기존 데이터 초기화
    setHasMore(true);
    setPagination({ page: 1, size: PAGE_SIZE });
    loadProjects(1, true);
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
        {projectList.map(item => (
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
