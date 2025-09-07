import { useEffect, useRef, useState, useCallback } from 'react';

import { MagnifyingGlassIcon, WarningCircleIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';
import PlayerCard from '@/features/Player/PlayerCard/PlayerCard';
import { useGetApi } from '@/hooks/useGetApi';
import type { playerSearchApiResponse, Player } from '@/schemas/player.schema';
import type { Pagination } from '@/types/pagination.types';

import styles from './SearchPlayerPage.module.scss';

const PAGE_SIZE = 6;
const MAX_AUTO_LOADS = 5;

const SearchPlayerPage = () => {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>(''); // 실제 검색에 사용될 키워드
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: PAGE_SIZE });
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const autoLoadsRef = useRef(0);

  // API 호출
  const { data: responseData, isLoading: isResponseLoading } = useGetApi<playerSearchApiResponse>({
    url: 'api/players/search',
    params: {
      ...(searchKeyword && { keyword: searchKeyword.trim() }),
      ...pagination,
    },
    enabled: !!searchKeyword.trim(), // searchKeyword가 있을 때만 API 호출
  });

  // API 응답 처리
  useEffect(() => {
    if (!responseData?.data) return;

    const { items: newPlayers, pagination: responsePagination } = responseData.data;

    setPlayerList(prev => {
      return pagination.page === 0 ? newPlayers : [...prev, ...newPlayers];
    });

    setHasMore(responsePagination.currentPage < responsePagination.totalPages);
  }, [responseData, pagination.page]);

  const ensureScrollable = useCallback(() => {
    const listEl = document.querySelector(`.${styles.playerListWrapper}`) as HTMLElement | null;
    const isListScrollable = listEl && listEl.scrollHeight > listEl.clientHeight;
    const isPageScrollable = document.documentElement.scrollHeight > window.innerHeight;
    const scrollable = isListScrollable || isPageScrollable;

    if (
      !scrollable &&
      !isResponseLoading &&
      hasMore &&
      autoLoadsRef.current < MAX_AUTO_LOADS &&
      searchKeyword.trim()
    ) {
      autoLoadsRef.current += 1;
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [hasMore, searchKeyword, isResponseLoading]);

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setPlayerList([]);
      setPagination({ page: 0, size: PAGE_SIZE });
      setHasMore(true);
      autoLoadsRef.current = 0;
      return;
    }

    autoLoadsRef.current = 0;
    setPlayerList([]);
    setPagination({ page: 0, size: PAGE_SIZE });
    setHasMore(true);
  }, [searchKeyword]);

  useEffect(() => {
    if (!searchKeyword.trim()) return;

    const timer = setTimeout(() => {
      ensureScrollable();
    }, 100);

    return () => clearTimeout(timer);
  }, [playerList, searchKeyword, ensureScrollable]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !searchKeyword.trim()) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && !isResponseLoading && hasMore && searchKeyword.trim()) {
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
  }, [isResponseLoading, hasMore, searchKeyword]);

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onKeyDownHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchKeyword(keyword.trim());
    }
  };

  return (
    <div className={styles.container}>
      {searchKeyword.trim() ? (
        /* searchKeyword 있을 때 */
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
              onKeyDown={onKeyDownHandle}
            />
          </div>

          <div className={styles.playerListWrapper}>
            {playerList.map(player => (
              <PlayerCard key={`${player.userId}`} player={player} isLoading={isResponseLoading} />
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: 1 }} />
        </>
      ) : (
        /* searchKeyword 없을 때 */
        <div className={styles.searchWrapper}>
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
            onKeyDown={onKeyDownHandle}
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
