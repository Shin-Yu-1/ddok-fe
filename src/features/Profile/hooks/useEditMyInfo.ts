import { useState, useCallback } from 'react';

import { useAuthStore } from '@/stores/authStore';

export interface UserEditInfo {
  userId: number;
  profileImageUrl: string;
  username: string;
  nickname: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  password: string;
  isSocial?: boolean;
}

export const useEditMyInfo = () => {
  const { user } = useAuthStore();

  // 요구사항에 맞는 데이터
  const [userInfo, setUserInfo] = useState<UserEditInfo>({
    userId: user?.id || 1,
    profileImageUrl: user?.profileImageUrl || '/src/assets/images/avatar.png',
    username: user?.username || '곽두철',
    nickname: '낮잠자는 개발자',
    birthDate: '2000.08.12',
    email: user?.email || 'User@email.com',
    phoneNumber: '010-1234-5678',
    password: 'Test1234!',
    isSocial: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 프로필 이미지 업데이트
  const updateProfileImage = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      // 임시 미리보기
      const reader = new FileReader();
      reader.onload = e => {
        setUserInfo(prev => ({
          ...prev,
          profileImageUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);

      console.log('프로필 이미지 업로드:', file);
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 닉네임 업데이트
  const updateNickname = useCallback(async (nickname: string) => {
    setIsLoading(true);
    try {
      setUserInfo(prev => ({ ...prev, nickname }));
      console.log('닉네임 수정:', nickname);
    } catch (error) {
      console.error('닉네임 수정 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 전화번호 업데이트
  const updatePhoneNumber = useCallback(async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      setUserInfo(prev => ({ ...prev, phoneNumber }));
      console.log('전화번호 수정:', phoneNumber);
    } catch (error) {
      console.error('전화번호 수정 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 비밀번호 업데이트
  const updatePassword = useCallback(async (newPassword: string) => {
    setIsLoading(true);
    try {
      setUserInfo(prev => ({ ...prev, password: newPassword }));
      console.log('비밀번호 수정:', newPassword);
    } catch (error) {
      console.error('비밀번호 수정 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 비밀번호 확인
  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        // 현재 비밀번호와 비교
        const isValid = password === userInfo.password;
        console.log('비밀번호 확인:', password, '결과:', isValid);
        return isValid;
      } catch (error) {
        console.error('비밀번호 확인 실패:', error);
        throw error;
      }
    },
    [userInfo.password]
  );

  // 회원 탈퇴
  const withdrawUser = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('회원 탈퇴 처리');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    userInfo,
    isLoading,
    updateProfileImage,
    updateNickname,
    updatePhoneNumber,
    updatePassword,
    verifyPassword,
    withdrawUser,
  };
};
