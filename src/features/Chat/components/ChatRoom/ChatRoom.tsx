import { useEffect, useMemo, useRef, useState } from 'react';

import { ArrowUUpLeftIcon, UserIcon, MagicWandIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import Button from '@/components/Button/Button';
import OverflowMenu from '@/components/OverflowMenu/OverflowMenu';
import ChatMessageItem from '@/features/Chat/components/ChatRoom/ChatMessageItem';
import type { Pagination } from '@/features/Chat/types/Pagination.types';
import { useGetApi } from '@/hooks/useGetApi';
import { useWebSocket } from '@/hooks/useWebSocket';
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

// 메시지 + 날짜구분자 리스트 생성
type RenderItem =
  | { kind: 'date'; id: string; label: string }
  | { kind: 'msg'; id: number; msg: ChatMessage };

const dateKey = (iso: string) => dayjs(iso).format('YYYY-MM-DD');

// 구분자 라벨(오늘/어제/그 외)
const dateLabel = (iso: string) => {
  const d = dayjs(iso);

  return d.format('YYYY년 MM월 DD일');
};

const ChatRoom = ({ chat, onBack }: ChatRoomProps) => {
  const [search] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 5 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { user } = useAuthStore();
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }>({});
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const messagesRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef<Set<number>>(new Set()); // 중복 메시지 방지

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

  // WebSocket 연결
  const websocket = useWebSocket({
    path: '/ws/chats-ws',
    reconnectDelay: 5000,
    debug: true,
  });

  useEffect(() => {
    websocket.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    seenIdsRef.current.clear();
    setMessages([]);
    setHasMore(true);
    setIsFetching(false);
    setPagination({ page: 0, size: 5 });
  }, [chat.roomId]);

  // 방 구독 (웹소켓)
  useEffect(() => {
    if (!websocket.isConnected) return;

    const subscriptionId = websocket.subscribe({
      destination: `/sub/chats/${chat.roomId}`,
      onMessage: msg => {
        try {
          const incoming = JSON.parse(msg.body) as ChatMessage;

          if (seenIdsRef.current.has(incoming.messageId)) return;

          seenIdsRef.current.add(incoming.messageId);

          const c = messagesRef.current;
          const wasAtBottom = c ? isNearBottom(c) : true;

          setMessages(prev => [...prev, incoming]);

          if (wasAtBottom) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const container = messagesRef.current;
                if (container) {
                  container.scrollTop = container.scrollHeight;
                }
              });
            });
          }
        } catch (e) {
          console.error('소켓 메시지 파싱 실패:', e);
        }
      },
    });

    return () => {
      if (subscriptionId) websocket.unsubscribe(subscriptionId);
    };
  }, [websocket.isConnected, websocket, chat.roomId]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!isMemberMenuOpen) return;
      const inAnchor = anchorRef.current?.contains(e.target as Node);
      const inMenu = menuRef.current?.contains(e.target as Node);
      if (!inAnchor && !inMenu) setIsMemberMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMemberMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMemberMenuOpen]);

  const memberByUserId = useMemo(() => {
    const members = chatMemberResponse?.data?.members ?? [];
    return new Map(members.map(m => [m.userId, m]));
  }, [chatMemberResponse?.data?.members]);

  const itemsToRender = useMemo<RenderItem[]>(() => {
    const out: RenderItem[] = [];
    let prevDay: string | null = null;

    for (const m of messages) {
      const k = dateKey(m.createdAt);
      if (k !== prevDay) {
        out.push({ kind: 'date', id: `date-${k}`, label: dateLabel(m.createdAt) });
        prevDay = k;
      }
      out.push({ kind: 'msg', id: m.messageId, msg: m });
    }
    return out;
  }, [messages]);

  const memberMenuItems = useMemo(
    () =>
      Array.from(memberByUserId.values()).map(m => ({
        name: m.nickname,
        onClick: () => setIsMemberMenuOpen(false), // TODO: 멤버 클릭 시 동작
      })),
    [memberByUserId]
  );
  console.log(memberMenuItems, isMemberMenuOpen);

  const toAsc = (arr: ChatMessage[]) =>
    [...arr].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const appendUniqueAsc = (incomingAsc: ChatMessage[]) => {
    const seen = seenIdsRef.current;
    const add = incomingAsc.filter(m => !seen.has(m.messageId));
    if (add.length === 0) return;
    add.forEach(m => seen.add(m.messageId));
    setMessages(prev => [...prev, ...add]);
  };

  const prependWithScrollPreserve = (olderAsc: ChatMessage[]) => {
    const seen = seenIdsRef.current;
    const unique = olderAsc.filter(m => !seen.has(m.messageId));
    if (unique.length === 0) return;
    unique.forEach(m => seen.add(m.messageId));

    const c = messagesRef.current;
    if (!c) {
      setMessages(prev => [...unique, ...prev]);
      return;
    }
    // 현재 뷰포트 하단 기준 보정
    const prevBottom = c.scrollHeight - c.scrollTop;

    setMessages(prev => [...unique, ...prev]);

    requestAnimationFrame(() => {
      if (!messagesRef.current) return;
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight - prevBottom;
    });
  };

  const scrollToBottom = () => {
    const c = messagesRef.current;
    if (!c) return;
    c.scrollTop = c.scrollHeight;
  };

  // 메시지 응답 처리(페이지네이션)
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
      appendUniqueAsc(incomingAsc);
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    } else {
      prependWithScrollPreserve(incomingAsc);
    }

    setHasMore(p.currentPage < maxPageIndex);
    setIsFetching(false);
  }, [chatMessageResponse]);

  // 스크롤 핸들러 (페이지네이션용)
  const onScroll = () => {
    const c = messagesRef.current;

    if (!c) return;
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

  const sendMessage = (input: string) => {
    websocket.publish({
      destination: `/pub/chats/${chat.roomId}/send`,
      payload: { contentType: 'TEXT', contentText: input },
    });
  };

  const onEnterPress: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key !== 'Enter') return;

    if (e.shiftKey) return;

    e.preventDefault();
    const raw = e.currentTarget.value;
    const payload = raw.replace(/\r/g, '');

    // 공백/개행만 있으면 전송 안 함
    if (!/\S/.test(payload)) {
      e.currentTarget.value = '';
      return;
    }

    sendMessage(payload);
    e.currentTarget.value = '';

    requestAnimationFrame(() => {
      const c = messagesRef.current;
      if (c) c.scrollTop = c.scrollHeight;
    });
  };

  const openMemberMenu = () => {
    console.log('openMemberMenu');
    const el = anchorRef.current;

    if (!el) return;

    const r = el.getBoundingClientRect();
    setMenuPos({ top: r.bottom + window.scrollY, left: r.left + window.scrollX + 10 });
    console.log(r, r.bottom + window.scrollY + 6, r.left + window.scrollX);

    setIsMemberMenuOpen(true);
  };

  return (
    <div className={styles.container}>
      {isMemberMenuOpen && (
        <div className={styles.overflowWrapper} ref={menuRef} style={menuPos}>
          <OverflowMenu menuItems={memberMenuItems} />
        </div>
      )}

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
                  ('otherUser' in chat ? chat.otherUser.profileImage : chat.owner.profileImage) ||
                  ''
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
            <div ref={anchorRef}>
              <Button
                leftIcon={<UserIcon className={styles.icon} />}
                fontSize="xxsmall"
                padding="0px"
                backgroundColor={'none'}
                onClick={openMemberMenu}
              >
                {'otherUser' in chat ? 2 : chat.memberCount}명
              </Button>
            </div>
          </div>

          <div className={styles.messageListWrapper}>
            {!!itemsToRender &&
              itemsToRender.map(item =>
                item.kind === 'date' ? (
                  <div key={item.id} className={styles.dateDivider}>
                    <span>{item.label}</span>
                  </div>
                ) : (
                  <ChatMessageItem
                    key={item.id}
                    messageItem={item.msg}
                    memberInfo={memberByUserId.get(item.msg.senderId)!}
                    isMyMessage={item.msg.senderId === user?.id}
                  />
                )
              )}
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

          <textarea
            className={styles.chatInputField}
            onKeyUp={onEnterPress}
            disabled={!!search}
          ></textarea>
        </div>
      </main>
    </div>
  );
};

export default ChatRoom;
