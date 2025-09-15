import { useEffect, useRef, useState } from 'react';

import { MagnifyingGlassIcon, WarningCircleIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';
import PlayerCard from '@/features/Player/PlayerCard/PlayerCard';
import { useGetApi } from '@/hooks/useGetApi';
import type { playerSearchApiResponse, Player } from '@/schemas/player.schema';

import styles from './SearchPlayerPage.module.scss';

const PAGE_SIZE = 6;

const SearchPlayerPage = () => {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: responseData, isLoading } = useGetApi<playerSearchApiResponse>({
    url: 'api/players/search',
    params: {
      ...(searchKeyword && { keyword: searchKeyword.trim() }),
      page: currentPage,
      size: PAGE_SIZE,
    },
    enabled: !!searchKeyword.trim(),
  });

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setPlayerList([]);
      setCurrentPage(0);
      setHasMore(true);
      setIsLoadingMore(false);
      return;
    }

    setPlayerList([]);
    setCurrentPage(0);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [searchKeyword]);

  // API 응답 처리
  useEffect(() => {
    if (!responseData?.data || !searchKeyword.trim()) return;

    const { items: newPlayers, pagination } = responseData.data;

    if (pagination.currentPage === 0) {
      setPlayerList(newPlayers);
    } else {
      setPlayerList(prev => [...prev, ...newPlayers]);
    }

    setHasMore(pagination.currentPage + 1 < pagination.totalPages);
    setIsLoadingMore(false);
  }, [responseData, searchKeyword]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !searchKeyword.trim() || !hasMore || isLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsLoadingMore(true);
          setCurrentPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchKeyword, hasMore, isLoading, isLoadingMore, currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = keyword.trim();
      if (trimmed) {
        setSearchKeyword(trimmed);
      }
    }
  };

  return (
    <div className={`${styles.container} ${searchKeyword ? '' : styles.default}`}>
      {searchKeyword.trim() ? (
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
              leftIcon={<MagnifyingGlassIcon size={20} weight="light" />}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>

          <div className={styles.playerListWrapper}>
            {playerList.map((player, index) => (
              <PlayerCard
                key={`${player.userId}-${index}`}
                player={player}
                isLoading={isLoading && currentPage === 0}
              />
            ))}
          </div>

          {/* 빈 결과 메시지 */}
          {!isLoading && !isLoadingMore && playerList.length === 0 && (
            <div className={styles.emptyItemWrapper}>
              <span>해당되는 플레이어가 없네요. 다른 키워드로 검색해보세요.</span>
            </div>
          )}

          {/* 무한 스크롤 센티넬 */}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </>
      ) : (
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
            leftIcon={<MagnifyingGlassIcon size={20} weight="light" />}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className={styles.infoWrapper}>
            <WarningCircleIcon />
            <span>통합 검색을 이용해 보세요!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPlayerPage;
