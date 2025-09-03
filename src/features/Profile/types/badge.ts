// 온도 구간 타입
export type TemperatureLevel =
  | 'freezing' // 0-10
  | 'cold' // 11-29
  | 'cool' // 30-49
  | 'warm' // 50-69
  | 'hot' // 70-89
  | 'burning'; // 90-100

// 개별 뱃지 정보
export interface Badge {
  type: 'complete' | 'leader_complete' | 'login';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// 포기 뱃지 정보
export interface AbandonBadge {
  isGranted: boolean;
  count: number;
}
