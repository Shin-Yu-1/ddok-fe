import { useEffect, useRef, useState } from 'react';

import { ArrowUUpLeftIcon, UserIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import type { Pagination } from '@/features/Chat/types/Pagination.types';
import { useGetApi } from '@/hooks/useGetApi';
import type { ChatMessageApiResponse, ChatListItem, ChatMessage } from '@/schemas/chat.schema';

import ChatRoomType from '../enums/ChatRoomType.enum';

import styles from './ChatRoom.module.scss';

interface ChatRoomProps {
  chat: ChatListItem;
  onBack: () => void;
}

const ChatRoom = ({ chat, onBack }: ChatRoomProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 10 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);

  const { data: chatMessageResponse } = useGetApi<ChatMessageApiResponse>({
    url: `/api/chats/${chat.roomId}/messages`,
    params: { ...(search && { search }), ...pagination },
  });

  useEffect(() => {
    if (chatMessageResponse?.data?.messages) {
      const fetchedMessages = chatMessageResponse.data.messages;

      // 최신 메시지 하단에 렌더
      setMessages(prev => [...fetchedMessages.reverse(), ...prev]);

      const { currentPage, totalPages } = chatMessageResponse.data.pagination;
      setHasMore(currentPage + 1 < totalPages);
    }
  }, [chatMessageResponse]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

  const handleScroll = () => {
    const container = messagesRef.current;
    if (!container || isFetching || !hasMore) return;

    if (container.scrollTop < 100) {
      setIsFetching(true);
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  return (
    <div className={styles.container}>
      {/* Header: 고정, 불투명 */}
      <header className={styles.chatRoomHeader}>
        <span className={styles.title}>
          {chat.roomType === ChatRoomType.PRIVATE ? '1:1 채팅' : '팀 채팅'}
        </span>

        <Button onClick={onBack} size="sm" padding={'0px'}>
          <ArrowUUpLeftIcon className={styles.headerIcon} />
        </Button>
      </header>

      <main className={styles.chatRoomMain}>
        <div className={styles.messages} ref={messagesRef}>
          <div className={styles.subHeader}>
            <div className={styles.subHeaderMeta}>
              <img
                className={styles.profileImage}
                src={
                  'otherUser' in chat
                    ? chat.otherUser.profileImage || undefined
                    : chat.owner.profileImage || undefined
                }
                alt=""
              />
              <div className={styles.subHeaderTitle}>
                <h3 className={styles.roomName}>
                  {'otherUser' in chat
                    ? chat.otherUser.nickname
                    : (chat.name ?? chat.owner.nickname)}
                </h3>
              </div>
            </div>

            <Button
              leftIcon={<UserIcon className={styles.icon} />}
              fontSize="xxsmall"
              padding="0px"
            >
              {'otherUser' in chat ? 2 : chat.memberCount}명
            </Button>
          </div>

          {/* 메시지 목록 */}
          {messages.map(msg => (
            <div className={styles.message} key={msg.messageId}>
              <strong className={styles.sender}>{msg.senderNickname}</strong>
              <span className={styles.text}>: {msg.contentText}</span>
            </div>
          ))}
        </div>

        {/* 입력창(아래 고정) */}
        <div className={styles.inputBar}>
          <input className={styles.input} type="text" />
        </div>
      </main>
    </div>
  );
};

export default ChatRoom;
