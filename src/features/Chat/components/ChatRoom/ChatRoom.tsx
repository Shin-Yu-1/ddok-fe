import { useEffect, useMemo, useRef, useState } from 'react';

import { ArrowUUpLeftIcon, UserIcon, MagicWandIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import ChatMessageItem from '@/features/Chat/components/ChatRoom/ChatMessageItem';
import type { Pagination } from '@/features/Chat/types/Pagination.types';
import { useGetApi } from '@/hooks/useGetApi';
import type {
  ChatMessageApiResponse,
  ChatRoomMemberApiResponse,
  ChatListItem,
  ChatMessage,
} from '@/schemas/chat.schema';
import { useAuthStore } from '@/stores/authStore';

import ChatRoomType from '../../enums/ChatRoomType.enum';

import styles from './ChatRoom.module.scss';

interface ChatRoomProps {
  chat: ChatListItem;
  onBack: () => void;
}

const ChatRoom = ({ chat, onBack }: ChatRoomProps) => {
  const [search] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 5 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { user } = useAuthStore();

  const messagesRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  // 스크롤 위치 판별
  const isNearTop = (c: HTMLElement) => c.scrollTop <= 80;
  const isNearBottom = (c: HTMLElement) => c.scrollHeight - c.scrollTop - c.clientHeight < 80;

  // API
  const { data: chatMessageResponse } = useGetApi<ChatMessageApiResponse>({
    url: `/api/chats/${chat.roomId}/messages`,
    params: { ...(search && { search }), ...pagination },
  });

  const { data: chatMemberResponse } = useGetApi<ChatRoomMemberApiResponse>({
    url: `/api/chats/${chat.roomId}/members`,
  });

  // 방이 바뀌면 초기화
  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    setIsFetching(false);
    setPagination({ page: 0, size: 5 });

    stickToBottomRef.current = true;
  }, [chat.roomId]);

  // 멤버 맵 캐싱
  const memberByUserId = useMemo(() => {
    const members = chatMemberResponse?.data?.members ?? [];
    return new Map(members.map(m => [m.userId, m]));
  }, [chatMemberResponse?.data?.members]);

  // 정렬/병합 유틸
  const toAsc = (arr: ChatMessage[]) =>
    [...arr].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const mergeUniqueAppendAsc = (prev: ChatMessage[], incomingAsc: ChatMessage[]) => {
    const seen = new Set(prev.map(m => m.messageId));
    const add = incomingAsc.filter(m => !seen.has(m.messageId));
    return [...prev, ...add];
  };

  const prependWithScrollPreserve = (olderAsc: ChatMessage[]) => {
    const c = messagesRef.current;
    if (!c) {
      setMessages(prev => [...olderAsc, ...prev]);
      return;
    }
    const prevScrollHeight = c.scrollHeight;
    const prevScrollTop = c.scrollTop;

    setMessages(prev => [...olderAsc, ...prev]);

    requestAnimationFrame(() => {
      const newScrollHeight = c.scrollHeight;
      c.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
    });
  };

  const scrollToBottom = () => {
    const c = messagesRef.current;
    if (!c) return;
    c.scrollTop = c.scrollHeight;
  };

  // 메시지 응답 처리
  useEffect(() => {
    const res = chatMessageResponse?.data;
    if (!res) return;

    const { messages: fetched, pagination: p } = res;
    const maxPageIndex = Math.max(0, p.totalPages - 1);

    if (!fetched?.length) {
      setIsFetching(false);
      setHasMore(p.currentPage < maxPageIndex);
      return;
    }

    const incomingAsc = toAsc(fetched);

    if (p.currentPage === 0) {
      setMessages(prev => mergeUniqueAppendAsc(prev, incomingAsc));
      requestAnimationFrame(() => {
        if (stickToBottomRef.current) scrollToBottom();
      });
    } else {
      prependWithScrollPreserve(incomingAsc);
    }

    setHasMore(p.currentPage < maxPageIndex);
    setIsFetching(false);
  }, [chatMessageResponse]);

  const onScroll = () => {
    const c = messagesRef.current;
    if (!c) return;

    stickToBottomRef.current = isNearBottom(c);

    if (isFetching || !hasMore) return;
    if (isNearTop(c)) {
      setIsFetching(true);
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = e => {
    if (e.ctrlKey) return;
    const c = messagesRef.current;
    if (!c || isFetching || !hasMore) return;
    if (e.deltaY < 0 && isNearTop(c)) {
      setIsFetching(true);
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.chatRoomHeader}>
        <span className={styles.title}>
          {chat.roomType === ChatRoomType.PRIVATE ? '1:1 채팅' : '팀 채팅'}
        </span>

        <Button onClick={onBack} size="sm" padding={'0px'}>
          <ArrowUUpLeftIcon className={styles.headerIcon} />
        </Button>
      </header>

      <main className={styles.chatRoomMain}>
        <div className={styles.messages} ref={messagesRef} onScroll={onScroll} onWheel={onWheel}>
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

          <div className={styles.messageListWrapper}>
            {messages.map(msg => (
              <ChatMessageItem
                key={msg.messageId}
                messageItem={msg}
                memberInfo={memberByUserId.get(msg.senderId)!}
                isMyMessage={msg.senderId === user?.id}
              />
            ))}
          </div>
        </div>

        {/* 입력창 */}
        <div className={styles.inputBar}>
          <Button
            padding={'0px'}
            width={30}
            height={30}
            radius={'xxsm'}
            backgroundColor={'var(--yellow-1)'}
          >
            <MagicWandIcon className={styles.aiButtonIcon} />
          </Button>

          <textarea className={styles.chatInputField} name="" id="" disabled={!!search}></textarea>
        </div>
      </main>
    </div>
  );
};

export default ChatRoom;
