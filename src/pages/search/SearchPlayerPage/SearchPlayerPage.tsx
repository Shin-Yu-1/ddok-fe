import { useEffect, useRef, useState } from 'react';

import {
  MagnifyingGlassIcon,
  WarningCircleIcon,
  DotsThreeVerticalIcon,
} from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Thermometer from '@/components/Thermometer/thermometer';
import type { Pagination } from '@/features/Chat/types/Pagination.types';
import type { Player } from '@/schemas/player.schema';
// import { useGetApi } from '@/hooks/useGetApi';
// import type { playerListApiResponse, Player } from '@/schemas/player.schema';

import styles from './SearchPlayerPage.module.scss';

type temp = {
  items: {
    userId: number;
    category: string;
    nickname: string;
    profileImageUrl: string;
    mainBadge: unknown;
    abandonBadge: unknown;
    mainPosition: string;
    address: string;
    temperature: number;
    isMine: boolean;
    chatRoomId: number;
    dmRequestPending: boolean;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

const PROFILE = 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png';

const playerListDummy: Player[] = [
  {
    userId: 1,
    category: 'soccer',
    nickname: '골때리는수비수',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'MVP', tier: 'Gold' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'DF',
    address: '서울 강남구',
    temperature: 70,
    isMine: true,
    chatRoomId: 101,
    dmRequestPending: false,
  },
  {
    userId: 2,
    category: 'basketball',
    nickname: '리바운드왕',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Rebounder', tier: 'Silver' },
    abandonBadge: { isGranted: true, count: 1 },
    mainPosition: 'C',
    address: '서울 마포구',
    temperature: 37.1,
    isMine: false,
    chatRoomId: 102,
    dmRequestPending: true,
  },
  {
    userId: 3,
    category: 'tennis',
    nickname: '백핸드장인',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Baseline', tier: 'Bronze' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'Singles',
    address: '경기 성남시',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 103,
    dmRequestPending: false,
  },
  {
    userId: 4,
    category: 'badminton',
    nickname: '스매시마스터',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Attacker', tier: 'Gold' },
    abandonBadge: { isGranted: true, count: 2 },
    mainPosition: 'Doubles',
    address: '서울 송파구',
    temperature: 99.0,
    isMine: false,
    chatRoomId: 104,
    dmRequestPending: false,
  },
  {
    userId: 5,
    category: 'soccer',
    nickname: '플메장인',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Playmaker', tier: 'Silver' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'MF',
    address: '서울 영등포구',
    temperature: 37.0,
    isMine: false,
    chatRoomId: 105,
    dmRequestPending: true,
  },
  {
    userId: 6,
    category: 'running',
    nickname: '러너스하이',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Pacer', tier: 'Gold' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: '10K',
    address: '부산 해운대구',
    temperature: 20,
    isMine: false,
    chatRoomId: 106,
    dmRequestPending: false,
  },
  {
    userId: 7,
    category: 'baseball',
    nickname: '클러치히터',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Slugger', tier: 'Silver' },
    abandonBadge: { isGranted: true, count: 1 },
    mainPosition: '1B',
    address: '대구 수성구',
    temperature: 36.7,
    isMine: false,
    chatRoomId: 107,
    dmRequestPending: false,
  },
  {
    userId: 8,
    category: 'golf',
    nickname: '퍼팅요정',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'GreenMaster', tier: 'Bronze' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'Right',
    address: '인천 연수구',
    temperature: 36.4,
    isMine: false,
    chatRoomId: 108,
    dmRequestPending: false,
  },
  {
    userId: 9,
    category: 'table-tennis',
    nickname: '스핀장난아님',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Spinner', tier: 'Silver' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'Shakehand',
    address: '광주 서구',
    temperature: 37.2,
    isMine: false,
    chatRoomId: 109,
    dmRequestPending: true,
  },
  {
    userId: 10,
    category: 'volleyball',
    nickname: '블로킹기계',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Blocker', tier: 'Gold' },
    abandonBadge: { isGranted: true, count: 3 },
    mainPosition: 'MB',
    address: '대전 유성구',
    temperature: 36.8,
    isMine: false,
    chatRoomId: 110,
    dmRequestPending: false,
  },
  {
    userId: 11,
    category: 'soccer',
    nickname: '폭격기',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Striker', tier: 'Gold' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'FW',
    address: '경기 고양시',
    temperature: 37.3,
    isMine: false,
    chatRoomId: 111,
    dmRequestPending: false,
  },
  {
    userId: 12,
    category: 'basketball',
    nickname: '딥쓰리장착',
    profileImageUrl: PROFILE,
    mainBadge: { type: 'Shooter', tier: 'Bronze' },
    abandonBadge: { isGranted: false, count: 0 },
    mainPosition: 'SG',
    address: '울산 남구',
    temperature: 36.5,
    isMine: false,
    chatRoomId: 112,
    dmRequestPending: false,
  },
];

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
    mainBadge: p.mainBadge as unknown,
    abandonBadge: p.abandonBadge as unknown,
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

const SearchPlayerPage = () => {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, size: 6 });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // // // API
  // const { data: playerListResponse, isLoading } = useGetApi<playerListApiResponse>({
  //   url: `/api/players/search`,
  //   params: { keyword, ...pagination },
  // });

  // TODO: API 연결 시 삭제
  let tempList: temp | null = null;

  if (keyword) {
    tempList = tempChunk(pagination);
  }

  // keyword 변경 시 playerList, pagination 초기화
  useEffect(() => {
    setPlayerList([]);
    setPagination({ page: 1, size: 10 });

    // TODO: API 연결 시 삭제
    const { items: newPlayers, pagination: p } = tempChunk(pagination);
    setPlayerList(prev => (p.currentPage === 0 ? newPlayers : [...(prev ?? []), ...newPlayers]));
  }, [keyword]);

  useEffect(() => {
    // const res = playerListResponse?.data;
    const res = tempList; // TODO: API 연결 시 삭제
    if (!res) return;

    const { items: newPlayers, pagination: p } = res;

    if (!newPlayers) return;
    console.log(newPlayers);

    setPlayerList(prev => (p.currentPage === 0 ? newPlayers : [...(prev ?? []), ...newPlayers]));
  }, []);

  const isLastPage =
    (tempChunk(pagination)?.pagination?.currentPage ?? 0) >=
    (tempChunk(pagination)?.pagination?.totalPages ?? 1) - 1;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      entries => {
        const first = entries[0];
        // if (first.isIntersecting && !isLoading && !isLastPage) {
        if (first.isIntersecting && !isLastPage) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
    // }, [isLoading, isLastPage]);
  }, [isLastPage]);

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value); // TODO: keyword 저장
    // console.log(e.target.value);
  };

  return (
    <div className={styles.container}>
      {keyword ? (
        /* keyword 있을 때 */
        <>
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
            leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />} // TODO: iconSize Up 20->30
            onChange={onChangeHandle}
          ></Input>

          <div>
            {playerList.map(player => (
              <div key={player.userId} className={styles.playerCard}>
                <div className={styles.playerTempWrapper}>
                  <Thermometer temperature={player.temperature} />
                  <span>{player.temperature}℃</span>
                  <Button size="sm" textColor={'var(--gray-1)'} backgroundColor="none" padding="0%">
                    <DotsThreeVerticalIcon />
                  </Button>
                </div>
                <img
                  src={player.profileImageUrl}
                  alt={`${player.nickname} 프로필`}
                  className={styles.profileImage}
                />
                <h3 className={styles.nickname}>{player.nickname}</h3>
                <span className={styles.line}></span>
                <div className={styles.playerInfo}>
                  <p className={styles.details}>{player.address}</p>
                  <p className={styles.details}>{player.mainPosition}</p>
                </div>
              </div>
            ))}
          </div>
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
            leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />} // TODO: iconSize Up 20->30
            onChange={onChangeHandle}
          ></Input>
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
