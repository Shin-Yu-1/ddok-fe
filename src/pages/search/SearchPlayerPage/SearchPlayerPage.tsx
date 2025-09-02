import { useEffect, useRef, useState } from 'react';

import {
  MagnifyingGlassIcon,
  WarningCircleIcon,
  DotsThreeVerticalIcon,
} from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Thermometer from '@/components/Thermometer/Thermometer';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import Badge from '@/features/Badge/Component/Badge';
import type { Pagination } from '@/features/Chat/types/Pagination.types';
import type { Player } from '@/schemas/player.schema';
// import { useGetApi } from '@/hooks/useGetApi';
// import type { playerListApiResponse, Player } from '@/schemas/player.schema';

import styles from './SearchPlayerPage.module.scss';

// TODO: API 연동 시 제거
type playerListDummy = {
  userId: number;
  category: string;
  nickname: string;
  profileImageUrl: string;
  mainBadge: { type: BadgeType; tier: BadgeTier }[];
  abandonBadge: { isGranted: boolean; count: number };
  mainPosition: string;
  address: string;
  temperature: number;
  isMine: boolean;
  chatRoomId: number;
  dmRequestPending: boolean;
};

// TODO: API 연동 시 제거
const PROFILE = 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png';

// TODO: API 연동 시 제거
const playerListDummy = [
  {
    userId: 1,
    category: '프론트',
    nickname: '골때리는아르마딜로',
    profileImageUrl: PROFILE,
    mainBadge: [
      { type: BadgeType.COMPLETE, tier: BadgeTier.GOLD },
      { type: BadgeType.LOGIN, tier: BadgeTier.GOLD },
    ],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '프론트',
    address: '서울 강남구',
    temperature: 90,
    isMine: true,
    chatRoomId: 101,
    dmRequestPending: false,
  },
  {
    userId: 2,
    category: '백엔드',
    nickname: '누구인가누가아소릴내었어',
    profileImageUrl: PROFILE,
    mainBadge: [
      { type: BadgeType.COMPLETE, tier: BadgeTier.SILVER },
      { type: BadgeType.LOGIN, tier: BadgeTier.BRONZE },
      { type: BadgeType.LEADER_COMPLETE, tier: BadgeTier.GOLD },
    ],
    abandonBadge: { isGranted: true, count: 1 },
    mainPosition: '백엔드',
    address: '서울 마포구',
    temperature: 80,
    isMine: false,
    chatRoomId: 102,
    dmRequestPending: true,
  },
  {
    userId: 3,
    category: '디자이너',
    nickname: '배겐도장인',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '디자이너',
    address: '경기 성남시',
    temperature: 70,
    isMine: false,
    chatRoomId: 103,
    dmRequestPending: false,
  },
  {
    userId: 4,
    category: '프론트',
    nickname: '후론트만',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.GOLD }],
    abandonBadge: { isGranted: true, count: 2 },
    mainPosition: '프론트',
    address: '서울 송파구',
    temperature: 60,
    isMine: false,
    chatRoomId: 104,
    dmRequestPending: false,
  },
  {
    userId: 5,
    category: '백엔드',
    nickname: '백룸',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.SILVER }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '백엔드',
    address: '서울 영등포구',
    temperature: 50,
    isMine: false,
    chatRoomId: 105,
    dmRequestPending: true,
  },
  {
    userId: 6,
    category: '기획자',
    nickname: '골룸',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.GOLD }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '기획자',
    address: '부산 해운대구',
    temperature: 40,
    isMine: false,
    chatRoomId: 106,
    dmRequestPending: false,
  },
  {
    userId: 7,
    category: '서버',
    nickname: '클러치히터',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.SILVER }],
    abandonBadge: { isGranted: true, count: 1 },
    mainPosition: '서버',
    address: '대구 수성구',
    temperature: 30,
    isMine: false,
    chatRoomId: 107,
    dmRequestPending: false,
  },
  {
    userId: 8,
    category: '프론트',
    nickname: '파팅피팅푸팅',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '프론트',
    address: '인천 연수구',
    temperature: 20,
    isMine: false,
    chatRoomId: 108,
    dmRequestPending: false,
  },
  {
    userId: 9,
    category: '디자이너',
    nickname: '스핀장난아님',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.SILVER }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '디자이너',
    address: '광주 서구',
    temperature: 10,
    isMine: false,
    chatRoomId: 109,
    dmRequestPending: true,
  },
  {
    userId: 10,
    category: '백엔드',
    nickname: '블로킹기계',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.GOLD }],
    abandonBadge: { isGranted: true, count: 3 },
    mainPosition: '백엔드',
    address: '대전 유성구',
    temperature: 1,
    isMine: false,
    chatRoomId: 110,
    dmRequestPending: false,
  },
  {
    userId: 11,
    category: '데브옵스',
    nickname: '폭격기',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.GOLD }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '데브옵스',
    address: '경기 고양시',
    temperature: 37.3,
    isMine: false,
    chatRoomId: 111,
    dmRequestPending: false,
  },
  {
    userId: 12,
    category: '백엔드',
    nickname: '제이슨상하차',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '백엔드',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 13,
    category: '프론트',
    nickname: '제이슨배달기사',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.GOLD }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '프론트',
    address: '경기 고양시',
    temperature: 37.3,
    isMine: false,
    chatRoomId: 111,
    dmRequestPending: false,
  },
  {
    userId: 14,
    category: '기획자',
    nickname: '제이슨판매자',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'SG',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 15,
    category: 'AI',
    nickname: '제이슨생성자',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'AI',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 16,
    category: '프론트',
    nickname: '고마해라마이바깠다이가',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '프론트',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 17,
    category: '백엔드',
    nickname: '드엔백',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '백엔드',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 18,
    category: '디자이너',
    nickname: '너이자디',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '디자이너',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 19,
    category: '서버',
    nickname: '쟤있슨',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '디자이너',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
  {
    userId: 20,
    category: '백엔드',
    nickname: '갓푸린',
    profileImageUrl: PROFILE,
    mainBadge: [{ type: BadgeType.COMPLETE, tier: BadgeTier.BRONZE }],
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '백엔드',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
];

// TODO: API 연동 시 제거
const tempChunk = ({ page, size }: Pagination) => {
  const pageSize = Math.max(1, size | 0);
  const totalItems = playerListDummy.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page | 0), totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);

  const items = playerListDummy.slice(start, end).map(p => ({
    userId: p.userId,
    category: p.category,
    nickname: p.nickname,
    profileImageUrl: p.profileImageUrl,
    mainBadge: p.mainBadge,
    abandonBadge: p.abandonBadge as {
      isGranted: boolean;
      count: number;
    },
    mainPosition: p.mainPosition,
    address: p.address,
    temperature: p.temperature,
    isMine: p.isMine,
    chatRoomId: p.chatRoomId,
    dmRequestPending: p.dmRequestPending,
  }));

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

const SearchPlayerPage = () => {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [keyword, setKeyword] = useState<string>(''); // null 대신 빈 문자열로 초기화
  const [pagination, setPagination] = useState<Pagination>({ page: 1, size: PAGE_SIZE });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoLoadsRef = useRef(0);
  const isFetchingRef = useRef(false);

  // keyword 변경 시 playerList, pagination 초기화
  useEffect(() => {
    if (!keyword.trim()) {
      setPlayerList([]);
      setPagination({ page: 1, size: PAGE_SIZE });
      setHasMore(true);
      autoLoadsRef.current = 0;
      return;
    }

    // 키워드가 있을 때 첫 페이지 로드
    autoLoadsRef.current = 0;
    setPlayerList([]);
    setPagination({ page: 1, size: PAGE_SIZE });
    setHasMore(true);
    loadPlayers(1, true);
  }, [keyword]);

  // 페이지 변경 시 추가 로드 (키워드가 있을 때만)
  useEffect(() => {
    if (!keyword.trim() || pagination.page <= 1) return;
    loadPlayers(pagination.page, false);
  }, [pagination.page]);

  // 스크롤 가능하도록 보장
  useEffect(() => {
    if (!keyword.trim()) return;

    const timer = setTimeout(() => {
      ensureScrollable();
    }, 100);

    return () => clearTimeout(timer);
  }, [playerList, keyword]);

  const loadPlayers = async (page: number, isNewSearch: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const { items: newPlayers, pagination: responsePagination } = tempChunk({
        page,
        size: PAGE_SIZE,
      });

      setPlayerList(prev => (isNewSearch ? newPlayers : [...prev, ...newPlayers]));

      // 더 이상 로드할 데이터가 없는지 확인
      setHasMore(responsePagination.currentPage < responsePagination.totalPages);
    } catch (error) {
      console.error('플레이어 목록 로드 실패:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  const ensureScrollable = () => {
    const listEl = document.querySelector(`.${styles.playerListWrapper}`) as HTMLElement | null;
    const isListScrollable = listEl && listEl.scrollHeight > listEl.clientHeight;
    const isPageScrollable = document.documentElement.scrollHeight > window.innerHeight;
    const scrollable = isListScrollable || isPageScrollable;

    if (
      !scrollable &&
      !isFetchingRef.current &&
      hasMore &&
      autoLoadsRef.current < MAX_AUTO_LOADS &&
      keyword.trim()
    ) {
      autoLoadsRef.current += 1;
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  // Intersection Observer 설정
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !keyword.trim()) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && hasMore && keyword.trim()) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }));
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
  }, [isLoading, hasMore, keyword]);

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className={styles.container}>
      {keyword.trim() ? (
        /* keyword 있을 때 */
        <>
          <div className={styles.keywordWrapper}>
            <Input
              type="text"
              width={'476px'}
              height={66}
              value={keyword}
              fontSize="var(--fs-xsmall)"
              placeholder="플레이어의 닉네임, 포지션, 장소를 검색하세요"
              border="1px solid var(--gray-2)"
              focusBorder="1px solid var(--gray-2)"
              backgroundColor="var(--white-3)"
              leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />}
              onChange={onChangeHandle}
            />
          </div>

          <div className={styles.playerListWrapper}>
            {playerList.map(player => (
              <div key={player.userId} className={styles.playerCard}>
                <div className={styles.playerTemperatureWrapper}>
                  <Thermometer temperature={player.temperature} />
                  <span className={styles.temperature}>{player.temperature}℃</span>
                  <Button size="sm" textColor={'var(--gray-1)'} backgroundColor="none" padding="0%">
                    <DotsThreeVerticalIcon className={styles.buttonIcon} />
                  </Button>
                </div>
                <div className={styles.profileImage}>
                  <img src={player.profileImageUrl} alt={`${player.nickname} 프로필`} />
                </div>
                <h3 className={styles.nickname}>{player.nickname}</h3>
                <div className={styles.line}>
                  <div className={styles.badgeWrapper}>
                    {player.mainBadge.map(badge => (
                      <Badge key={`${badge.type}${badge.tier}`} heightSize={16} mainBadge={badge} />
                    ))}
                  </div>
                </div>
                <div className={styles.playerInfo}>
                  <p className={styles.details}>{player.address}</p>
                  <p className={styles.details}>{player.mainPosition}</p>
                </div>
              </div>
            ))}

            {/* 스켈레톤 UI */}
            {isLoading && (
              <>
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div key={`skeleton-${index}`} className={styles.skeletonCard}>
                    <div className={styles.skeletonTemperatureWrapper}>
                      <div className={styles.skeletonThermometer}></div>
                      <div className={styles.skeletonTemperature}></div>
                      <div className={styles.skeletonButton}></div>
                    </div>
                    <div className={styles.skeletonProfileImage}></div>
                    <div className={styles.skeletonNickname}></div>
                    <div className={styles.skeletonBadgeWrapper}>
                      <div className={styles.skeletonBadge}></div>
                      <div className={styles.skeletonBadge}></div>
                    </div>
                    <div className={styles.skeletonPlayerInfo}>
                      <div className={styles.skeletonDetails}></div>
                      <div className={styles.skeletonDetails}></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Intersection Observer용 센티널 */}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </>
      ) : (
        /* keyword 없을 때 */
        <div className={styles.searchWrapper}>
          <Input
            type="text"
            width={'476px'}
            height={66}
            fontSize="var(--fs-xsmall)"
            placeholder="플레이어의 닉네임, 포지션, 장소를 검색하세요"
            border="1px solid var(--gray-2)"
            focusBorder="1px solid var(--gray-2)"
            backgroundColor="var(--white-3)"
            leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />}
            onChange={onChangeHandle}
          />
          <div className={styles.infoWrapper}>
            <WarningCircleIcon />
            <span>
              통합 검색을 이용해 보세요! 검색 결과는 닉네임 오름차순으로 정렬되어 표시됩니다.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPlayerPage;
