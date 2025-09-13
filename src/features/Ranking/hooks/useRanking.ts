import { useEffect, useState, useCallback } from 'react';

import { api } from '@/api/api';
import type {
  RankingApiResponse,
  RankingUser,
  RegionalRankingUser,
  MyRankingUser,
} from '@/types/ranking';

interface UseRankingReturn {
  topUser: RankingUser | null;
  top10Users: RankingUser[];
  regionalUsers: RegionalRankingUser[];
  myRanking: MyRankingUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRanking = (shouldFetchMyRanking: boolean = true): UseRankingReturn => {
  const [topUser, setTopUser] = useState<RankingUser | null>(null);
  const [top10Users, setTop10Users] = useState<RankingUser[]>([]);
  const [regionalUsers, setRegionalUsers] = useState<RegionalRankingUser[]>([]);
  const [myRanking, setMyRanking] = useState<MyRankingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankingData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 기본 API 호출들
      const [topUserRes, top10Res, regionalRes] = await Promise.all([
        api.get<RankingApiResponse<RankingUser>>('/api/players/temperature/rank/top1'),
        api.get<RankingApiResponse<RankingUser[]>>('/api/players/temperature/rank/top10'),
        api.get<RankingApiResponse<RegionalRankingUser[]>>('/api/players/temperature/rank/region'),
      ]);

      // 내 랭킹은 별도로 호출 (로그인한 경우에만)
      let myRankingRes;
      if (shouldFetchMyRanking) {
        myRankingRes = await api.get<RankingApiResponse<MyRankingUser>>(
          '/api/players/temperature/rank/me'
        );
      }

      // 데이터 설정
      setTopUser(topUserRes.data.data || null);
      setTop10Users(top10Res.data.data || []);
      setRegionalUsers(regionalRes.data.data || []);
      setMyRanking(myRankingRes?.data.data || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
      setError(message);
      console.error('Ranking data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [shouldFetchMyRanking]);

  useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

  return {
    topUser,
    top10Users,
    regionalUsers,
    myRanking,
    loading,
    error,
    refetch: fetchRankingData,
  };
};
