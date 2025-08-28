import { useEffect, useRef, useState } from 'react';

import { MagnifyingGlassIcon, DotsThreeOutlineVerticalIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { useGetApi } from '@/hooks/useGetApi';
import type { ChatListApiResponse, ChatListItem } from '@/schemas/chat.schema';

import ChatRoomType from '../enums/ChatRoomType.enum';

import styles from './ChatList.module.scss';

interface ChatProps {
  roomType: ChatRoomType;
}

type Pagination = {
  page: number;
  size: number;
};

const ChatList = ({ roomType }: ChatProps) => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 13 });
  const [chats, setChats] = useState<ChatListItem[] | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastLoadedPageRef = useRef<number>(-1);

  const {
    data: chatRoomResponse,
    isLoading,
    isError,
  } = useGetApi<ChatListApiResponse>({
    url: `/api/chats/${roomType === ChatRoomType.PRIVATE ? 'private' : 'team'}`,
    params: { ...(search && { search }), ...pagination },
  });

  const isLastPage =
    (chatRoomResponse?.data?.pagination?.currentPage ?? 0) >=
    (chatRoomResponse?.data?.pagination?.totalPages ?? 1) - 1;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && !isLoading && !isLastPage) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [isLoading, isLastPage]);

  useEffect(() => {
    setChats(null);
    setSearch('');
    setPagination(prev => ({ ...prev, page: 0 }));
    lastLoadedPageRef.current = -1;
  }, [roomType]);

  useEffect(() => {
    const res = chatRoomResponse?.data;
    if (!res) return;

    const { chats: newChats, pagination: p } = res;
    if (!newChats) return;
    if (p.currentPage === lastLoadedPageRef.current) return;

    setChats(prev => (p.currentPage === 0 ? newChats : [...(prev ?? []), ...newChats]));
    lastLoadedPageRef.current = p.currentPage;
  }, [chatRoomResponse]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.searchBox}>
        <Input
          type="text"
          placeholder="채팅방 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          border="1px solid var(--gray-2)"
          focusBorder="1px solid var(--gray-2)"
          leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />}
        />
      </div>

      {isError && (
        <div className={`${styles.chatItem} ${styles.chatError}`}>
          <span>조회할 수 없습니다.</span>
        </div>
      )}

      {!isLoading &&
        chats?.map(chat => (
          <div className={styles.chatItem} key={chat.roomId}>
            <div className={styles.chatInfo}>
              <img
                className={styles.profileImage}
                src={
                  'otherUser' in chat
                    ? chat.otherUser.profileImage || undefined
                    : chat.owner.profileImage || undefined
                }
              />
              <span className={styles.chatName} role="button">
                {'otherUser' in chat ? chat.otherUser.nickname : (chat.name ?? chat.owner.nickname)}
              </span>
            </div>

            <Button size="sm">
              <DotsThreeOutlineVerticalIcon />
            </Button>
          </div>
        ))}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};

export default ChatList;
