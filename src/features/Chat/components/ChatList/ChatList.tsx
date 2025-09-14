import { useEffect, useMemo, useRef, useState } from 'react';

import {
  ArrowSquareOutIcon,
  MagnifyingGlassIcon,
  DotsThreeOutlineVerticalIcon,
  PushPinSimpleIcon,
  PushPinSimpleSlashIcon,
  SignOutIcon,
} from '@phosphor-icons/react';
import type { IMessage } from '@stomp/stompjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import OverflowMenu from '@/components/OverflowMenu/OverflowMenu';
import ChatRoomType from '@/features/Chat/enums/ChatRoomType.enum';
import { useGetApi } from '@/hooks/useGetApi';
import type { ChatListApiResponse, ChatListItem } from '@/schemas/chat.schema';
import { useAuthStore } from '@/stores/authStore';
import { useChatUiStore } from '@/stores/chatUiStore';
import type { Pagination } from '@/types/pagination.types';
import { useWebSocketContext } from '@/utils/ws/WebSocketProvider';

import styles from './ChatList.module.scss';

interface ChatProps {
  roomType: ChatRoomType;
}
type ChatAlarm = {
  [key: number]: string;
};
type Payload = {
  createdAt: string;
  roomId: number;
  type: string;
};

const ChatList = ({ roomType }: ChatProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 13 });
  const [chats, setChats] = useState<ChatListItem[] | null>(null);
  const { openRoom } = useChatUiStore();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastLoadedPageRef = useRef<number>(-1);
  const [menuFor, setMenuFor] = useState<ChatListItem | null>(null);
  const [menuPos, setMenuPos] = useState<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }>({});
  const [chatAlarm, setChatAlarm] = useState<ChatAlarm>({});
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuAnchorRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { user, isLoggedIn } = useAuthStore();

  const {
    data: chatRoomResponse,
    isLoading,
    isError,
    refetch,
  } = useGetApi<ChatListApiResponse>({
    url: `/api/chats/${roomType === ChatRoomType.PRIVATE ? 'private' : 'team'}`,
    params: { ...(search && { search }), ...pagination },
  });

  const ws = useWebSocketContext();

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;
    if (!ws.isConnected) return;

    const destination = `/sub/users/${user.id}/notifications`;
    const subId = ws.subscribe(destination, (msg: IMessage) => {
      try {
        const payload: Payload = JSON.parse(msg.body);
        setChatAlarm(prev => ({ ...prev, [payload.roomId]: payload.createdAt }));
      } catch {
        console.error('[알림] 원문:', msg.body);
      }
    });

    return () => {
      if (subId) ws.unsubscribe(subId);
    };
  }, [ws.isConnected, user?.id]);

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

    if (search) {
      setChats(newChats);
      lastLoadedPageRef.current = p.currentPage;

      return;
    }

    // if (p.currentPage === lastLoadedPageRef.current) {
    //   return;
    // } // 중복 로드 방지

    setChats(prev => (p.currentPage === 0 ? newChats : [...(prev ?? []), ...newChats]));
    lastLoadedPageRef.current = p.currentPage;
  }, [chatRoomResponse, search]);

  const handleOpenRoom = (chat: ChatListItem) => {
    openRoom(chat);
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>, chat: ChatListItem) => {
    if (menuFor?.roomId === chat.roomId) {
      setMenuFor(null);

      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const preferBelow = rect.top + rect.height / 2 < window.innerHeight / 2;

    const left = rect.right - 20;

    const pos = preferBelow
      ? { top: rect.bottom - 7, left }
      : { bottom: window.innerHeight - rect.top - 7, left };

    setMenuPos(pos);
    menuAnchorRef.current = e.currentTarget as HTMLElement;
    setMenuFor(chat);
  };

  const closeMenu = () => {
    setMenuFor(null);
    setMenuPos({});
  };

  // 바깥 클릭/ESC로 닫기
  useEffect(() => {
    if (!menuFor) return;
    const onDown = (ev: MouseEvent) => {
      const target = ev.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (menuAnchorRef.current?.contains(target)) return;
      closeMenu();
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') closeMenu();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuFor]);

  // 고정 토글
  const togglePin = (chat: ChatListItem) => {
    console.log(chat.roomId, '고정 토글');
    // setChats(prev =>
    //   prev ? prev.map(c => (c.roomId === chat.roomId ? { ...c, isPinned: !c.isPinned } : c)) : prev
    // );
    // TODO: 채팅방 고정/취소 API 호출
  };

  // 1:1 대화 나가기
  const leaveChat = (chat: ChatListItem) => {
    setChats(prev => (prev ? prev.filter(c => c.roomId !== chat.roomId) : prev));
    // TODO: 채팅방 나가기 API 호출
  };

  // 팀 전용 페이지 이동 (원하는 동작으로 변경)
  const goTeamPage = (chat: ChatListItem) => {
    if (chat.roomType === ChatRoomType.GROUP) {
      navigate(`/team/${chat.teamId}/setting`);
    }
  };

  const menuItems = useMemo(() => {
    if (!menuFor) return [];

    const items = [
      {
        icon: menuFor.isPinned ? <PushPinSimpleSlashIcon /> : <PushPinSimpleIcon />,
        name: menuFor.isPinned ? '고정하기 취소' : '고정하기',
        onClick: () => {
          togglePin(menuFor);
          closeMenu();
        },
      },
    ];

    if (menuFor.roomType === ChatRoomType.PRIVATE) {
      items.push({
        icon: <SignOutIcon />,
        name: '대화 나가기',
        onClick: () => {
          leaveChat(menuFor);
          closeMenu();
        },
      });
    } else {
      items.push({
        icon: <ArrowSquareOutIcon />,
        name: '팀 전용 페이지',
        onClick: () => {
          goTeamPage(menuFor);
          closeMenu();
        },
      });
    }

    return items;
  }, [menuFor]);

  const onSearchInputHandler: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (!e.currentTarget.value) {
      setSearch('');
      refetch();
    }

    if (e.key !== 'Enter') return;

    e.preventDefault();

    const raw = e.currentTarget.value;
    setSearch(raw.trim());
    refetch();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.searchBox}>
        <Input
          type="text"
          placeholder="채팅방 검색"
          onKeyUp={onSearchInputHandler}
          border="1px solid var(--gray-2)"
          focusBorder="1px solid var(--gray-2)"
          leftIcon={<MagnifyingGlassIcon size={20} weight="light" />}
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
                  ('otherUser' in chat ? chat.otherUser.profileImage : chat.owner.profileImage) ||
                  undefined
                }
              />
              <span className={styles.chatName} role="button" onClick={() => handleOpenRoom(chat)}>
                {'otherUser' in chat
                  ? `${chat.otherUser.nickname}${
                      chat.otherUser.temperature != null ? ` (${chat.otherUser.temperature}°C)` : ''
                    }`
                  : (chat.name ?? chat.owner.nickname)}
              </span>
              {(chat.hasUnreadMessages ||
                (chatAlarm[chat.roomId] &&
                  dayjs(chat.updatedAt).isBefore(dayjs(chatAlarm[chat.roomId])) &&
                  !dayjs(chat.updatedAt).isSame(dayjs(chatAlarm[chat.roomId])))) && (
                <span className={styles.unreadMessage}></span>
              )}
            </div>

            <Button size="sm" onClick={e => openMenu(e, chat)} ref={buttonRef}>
              <DotsThreeOutlineVerticalIcon />
            </Button>

            {!!menuFor && (
              <div className={styles.overflowMenuContainer} style={menuPos}>
                <OverflowMenu ref={menuRef} menuItems={menuItems} />
              </div>
            )}
          </div>
        ))}

      {!isLoading && chats?.length === 0 && (
        <div className={styles.chatItem}>
          <span>채팅방이 없습니다.</span>
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
};

export default ChatList;
