import type { TeamApplicantListData } from '../schemas/teamApplicantsListSchema';

export const teamApplicantsMockData: TeamApplicantListData = {
  pagination: {
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 2,
  },
  teamId: 2,
  teamType: 'PROJECT',
  recruitmentId: 33,
  isLeader: true,
  items: [
    {
      applicantId: 101,
      appliedPosition: '프론트엔드',
      status: 'PENDING',
      appliedAt: '2025-09-02T12:00:00',
      isMine: false,
      user: {
        userId: 11,
        nickname: '이름최대열두자여서채워봄',
        profileImageUrl: '/src/assets/images/avatar.png',
        temperature: 20.1,
        mainPosition: 'backend',
        chatRoomId: null,
        dmRequestPending: false,
        mainBadge: {
          type: 'login',
          tier: 'bronze',
        },
        abandonBadge: {
          isGranted: true,
          count: 5,
        },
      },
    },
  ],
};
