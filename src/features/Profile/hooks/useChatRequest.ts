import type { CompleteProfileInfo } from '@/types/user';

export const useChatRequest = (user?: CompleteProfileInfo | null) => {
  const handleChatRequest = () => {
    if (!user) return;

    if (user.chatRoomId) {
      // 이미 채팅방이 있는 경우 - 채팅방으로 이동
      console.log('기존 채팅방으로 이동:', user.chatRoomId);
    } else if (user.dmRequestPending) {
      // 채팅 요청 대기 중
      console.log('채팅 요청 대기 중...');
    } else {
      // 새로운 채팅 요청 보내기
      console.log('채팅 요청 보내기:', user.userId);
      // TODO: 실제 채팅 요청 API 호출
    }
  };

  const getChatButtonText = (): string => {
    if (!user) return '채팅하기';

    if (user.chatRoomId) {
      return '채팅하기';
    } else if (user.dmRequestPending) {
      return '요청 대기 중...';
    } else {
      return '채팅 요청';
    }
  };

  return {
    handleChatRequest,
    getChatButtonText,
  };
};
