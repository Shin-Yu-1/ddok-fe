import { useEffect, useState } from 'react';

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

type paginationType = {
  page: number;
  size: number;
};

const ChatList = ({ roomType }: ChatProps) => {
  const [search, setSearch] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pagination, setPagination] = useState<paginationType>({
    page: 0,
    size: 10,
  });
  const [chats, setChats] = useState<ChatListItem[] | null>(null);

  const {
    data: chatRoomResponse,
    isLoading,
    isError,
  } = useGetApi<ChatListApiResponse>({
    url: `/api/chats/${roomType === ChatRoomType.PRIVATE ? 'private' : 'team'}`,
    params: { ...(search && { search }), ...pagination },
  });

  useEffect(() => {
    setChats(null);
    setSearch('');
  }, [roomType]);

  useEffect(() => {
    if (chatRoomResponse?.data?.chats) {
      setChats(chatRoomResponse.data.chats);
    }
  }, [chatRoomResponse]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.searchBox}>
        <Input
          type="text"
          placeholder="채팅방 검색"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
          }}
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
                    ? (chat.otherUser.profileImage ?? '')
                    : (chat.owner.profileImage ?? '')
                }
                alt=""
              />

              <span className={styles.chatName}>
                {'otherUser' in chat ? chat.otherUser.nickname : (chat.name ?? chat.owner.nickname)}
              </span>
            </div>

            <Button size="sm">
              <DotsThreeOutlineVerticalIcon />
            </Button>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
