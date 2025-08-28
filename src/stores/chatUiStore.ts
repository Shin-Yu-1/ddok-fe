import { create } from 'zustand';

import type { ChatListItem } from '@/schemas/chat.schema';

interface ChatUiState {
  selectedRoom: ChatListItem | null;
  openRoom: (chat: ChatListItem) => void;
  closeRoom: () => void;

  // 리스트 스크롤 복원용 (선택)
  listScrollTop: number;
  setListScrollTop: (v: number) => void;
}

export const useChatUiStore = create<ChatUiState>(set => ({
  selectedRoom: null,
  openRoom: chat => set({ selectedRoom: chat }),
  closeRoom: () => set({ selectedRoom: null }),
  listScrollTop: 0,
  setListScrollTop: v => set({ listScrollTop: v }),
}));
