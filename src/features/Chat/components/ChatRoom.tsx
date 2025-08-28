import { useEffect, useRef, useState } from 'react';

import type { Pagination } from '@/features/Chat/types/Pagination.types';
import { useGetApi } from '@/hooks/useGetApi';
import type { ChatMessageApiResponse, ChatListItem, ChatMessage } from '@/schemas/chat.schema';

import styles from './ChatRoom.module.scss';

interface ChatRoomProps {
  chat: ChatListItem;
}

const ChatRoom = ({ chat }: ChatRoomProps) => {
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
    <>
      <header>
        {'otherUser' in chat ? chat.otherUser.nickname : (chat.name ?? chat.owner.nickname)}
      </header>
      <main>
        <div className={styles.contentsWrapper} ref={messagesRef}>
          {messages.map(msg => (
            <div key={msg.messageId}>
              <strong>{msg.senderNickname}</strong>: {msg.contentText}
            </div>
          ))}
        </div>
        <div className={styles.inputWrapper}>
          <input type="text" />
        </div>
      </main>

      <span>{chat.roomId} CHAT ROOM</span>
    </>
  );
};

export default ChatRoom;
