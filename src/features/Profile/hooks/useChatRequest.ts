import { useState } from 'react';

import { createDmRequest } from '@/api/chat';
import ChatRoomType from '@/features/Chat/enums/ChatRoomType.enum';
import { useChatUiStore } from '@/stores/chatUiStore';
import type { CompleteProfileInfo } from '@/types/user';

interface UseChatRequestOptions {
  onSuccess?: () => void;
}

export const useChatRequest = (
  user?: CompleteProfileInfo | null,
  options?: UseChatRequestOptions
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localDmRequestPending, setLocalDmRequestPending] = useState(false);
  const { openRoom } = useChatUiStore();

  const handleChatRequest = async () => {
    if (!user) return;

    if (user.chatRoomId) {
      // 이미 채팅방이 있는 경우 - 채팅방 사이드바 열기
      console.log('기존 채팅방으로 이동:', user.chatRoomId);

      // ChatListItem 형태로 변환하여 채팅방 열기
      const chatRoom = {
        roomId: user.chatRoomId,
        roomType: ChatRoomType.PRIVATE as const,
        isPinned: false,
        otherUser: {
          id: user.userId,
          nickname: user.nickname || '사용자',
          profileImage: user.profileImage || null,
          temperature: user.temperature || 36.5,
        },
        updatedAt: new Date().toISOString(),
      };

      openRoom(chatRoom);
    } else if (user.dmRequestPending || localDmRequestPending) {
      // 채팅 요청 대기 중
      console.log('채팅 요청 대기 중...');
    } else {
      // 새로운 채팅 요청 보내기
      try {
        setIsLoading(true);
        setError(null);

        console.log('채팅 요청 보내기:', user.userId);
        const result = await createDmRequest(user.userId.toString());

        console.log('채팅 요청 성공:', result);

        // 로컬 상태를 즉시 업데이트하여 UI 반영
        setLocalDmRequestPending(true);

        // 성공 시 콜백 호출
        options?.onSuccess?.();
      } catch (err) {
        console.error('채팅 요청 실패:', err);
        setError('채팅 요청에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

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
