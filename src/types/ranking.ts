export interface RankingUser {
  rank?: number;
  userId: number;
  nickname: string;
  mainPosition: string;
  profileImageUrl: string;
  temperature: number;
  chatRoomId: number | null;
  dmRequestPending: boolean;
  mainBadge: {
    type: string;
    tier: string;
  };
  abandonBadge: {
    count: number;
    isGranted: boolean;
  };
  updatedAt: string;
  isMine: boolean;
}

export interface MyRankingUser {
  userId: number;
  nickname: string;
  temperature: number;
  mainPosition: string;
  profileImageUrl: string;
  mainBadge: {
    type: string;
    tier: string;
  };
  abandonBadge: {
    isGranted: boolean;
    count: number;
  };
}

export interface RegionalRankingUser {
  region: string;
  userId: number;
  nickname: string;
  temperature: number;
  mainPosition: string;
  profileImageUrl: string;
  chatRoomId: number | null;
  dmRequestPending: boolean;
  mainBadge: {
    type: string;
    tier: string;
  };
  abandonBadge: {
    count: number;
    isGranted: boolean;
  };
  updatedAt: string;
  isMine: boolean;
}

export interface RankingApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
