import { create } from 'zustand';

interface ChatUiState {
  selectedRoomId: number | null;
  openRoom: (id: number) => void;
  closeRoom: () => void;

  // 리스트 스크롤 복원용 (선택)
  listScrollTop: number;
  setListScrollTop: (v: number) => void;
}

export const useChatUiStore = create<ChatUiState>(set => ({
  selectedRoomId: null,
  openRoom: id => set({ selectedRoomId: id }),
  closeRoom: () => set({ selectedRoomId: null }),
  listScrollTop: 0,
  setListScrollTop: v => set({ listScrollTop: v }),
}));
