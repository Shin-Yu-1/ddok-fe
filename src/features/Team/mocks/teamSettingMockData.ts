import type { TeamSettingData } from '../schemas/teamSettingSchema';

export const teamSettingMockData: TeamSettingData = {
  pagination: {
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 5,
  },
  teamId: 2,
  teamType: 'PROJECT',
  teamTitle: '똑DDOK!',
  recruitmentId: 33,
  isLeader: true,
  items: [
    {
      memberId: 201,
      decidedPosition: '풀스택',
      role: 'LEADER',
      joinedAt: '2025-09-01T12:30:00',
      isMine: false,
      user: {
        userId: 11,
        nickname: '용',
        profileImageUrl: 'https://~',
        temperature: 36.5,
        mainPosition: '풀스택',
        chatRoomId: null,
        dmRequestPending: false,
        mainBadge: {
          type: 'login',
          tier: 'gold',
        },
        abandonBadge: {
          isGranted: false,
          count: 0,
        },
      },
    },
    {
      memberId: 202,
      decidedPosition: '디자이너',
      role: 'MEMBER',
      joinedAt: '2025-09-01T13:10:00',
      isMine: true,
      user: {
        userId: 12,
        nickname: '은',
        profileImageUrl: 'https://~',
        temperature: 36.7,
        mainPosition: '프론트엔드',
        chatRoomId: null,
        dmRequestPending: false,
        mainBadge: {
          type: 'login',
          tier: 'silver',
        },
        abandonBadge: {
          isGranted: true,
          count: 2,
        },
      },
    },
  ],
};
