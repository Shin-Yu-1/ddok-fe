import { useState, useCallback } from 'react';

import { createDmRequest } from '@/api/chat';
import ChatRoomType from '@/features/Chat/enums/ChatRoomType.enum';
import { useSidebarState } from '@/features/Sidebar/hooks/useSidebarState';
import type { ChatListItem } from '@/schemas/chat.schema';
import { useChatUiStore } from '@/stores/chatUiStore';
import type { CompleteProfileInfo } from '@/types/user';

interface UseChatRequestOptions {
  onSuccess?: () => void;
}

// 프로필 정보로부터 ChatListItem 생성
const createChatListItemFromProfile = (user: CompleteProfileInfo): ChatListItem => {
  return {
    roomId: user.chatRoomId!,
    roomType: ChatRoomType.PRIVATE,
    isPinned: false,
    otherUser: {
      id: user.userId,
      nickname: user.nickname,
      profileImage: user.profileImage || null,
      temperature: user.temperature,
    },
    updatedAt: new Date().toISOString(),
  };
};

export const useChatRequest = (
  user?: CompleteProfileInfo | null,
  options?: UseChatRequestOptions
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localDmRequestPending, setLocalDmRequestPending] = useState(false);
  const { setActiveSection, setActiveSubSection } = useSidebarState();
  const { openRoom } = useChatUiStore();

  const handleChatRequest = useCallback(async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 채팅방이 존재하는지 확인
      if (user.chatRoomId) {
        // 사이드바 상태를 직접 설정하여 채팅 섹션과 개인 채팅을 한번에 활성화
        setActiveSection('chat');
        setActiveSubSection('personal-chat');

        // 사이드바 상태가 업데이트된 후 채팅방을 열도록 지연
        setTimeout(() => {
          const chatItem = createChatListItemFromProfile(user);
          openRoom(chatItem);
        }, 50);
        return;
      }

      // 채팅방이 없으면 채팅 요청 생성
      await createDmRequest(user.userId.toString());
      setLocalDmRequestPending(true);

      // 옵션에서 성공 콜백이 있으면 실행
      options?.onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅 요청에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, setActiveSection, setActiveSubSection, openRoom, options]);

  const getChatButtonText = (): string => {
    if (!user) return '채팅하기';

    if (isLoading) {
      return '요청 중...';
    }

    if (user.chatRoomId) {
      return '채팅하기';
    } else if (user.dmRequestPending || localDmRequestPending) {
      return '요청 대기 중...';
    } else {
      return '채팅 요청';
    }
  };

  const getChatButtonDisabled = (): boolean => {
    // 로딩 중이면 비활성화
    if (isLoading) return true;

    // 채팅방이 이미 존재하면 dmRequestPending 상태와 관계없이 활성화
    if (user?.chatRoomId) return false;

    // 채팅방이 없고 DM 요청 대기 중이면 비활성화
    return (user?.dmRequestPending ?? false) || localDmRequestPending;
  };

  return {
    handleChatRequest,
    getChatButtonText,
    getChatButtonDisabled,
    isLoading,
    error,
  };
};
