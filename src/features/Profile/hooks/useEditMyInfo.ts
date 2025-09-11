import { useState, useCallback, useEffect } from 'react';

import { personalInfoApi } from '@/api/personalInfoApi';

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
  const [userInfo, setUserInfo] = useState<UserEditInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reauthToken, setReauthToken] = useState<string | null>(null);

  // 페이지 로드 시 개인정보 조회 (accessToken만 사용 - 비밇번호 확인 없이 페이지 넘어가기로 변경됐어욤)
  useEffect(() => {
    const loadUserSettings = async () => {
      setIsLoading(true);
      try {
        const userSettings = await personalInfoApi.getUserSettings();

        // 응답 데이터를 UserEditInfo 형태로 변환
        const editInfo: UserEditInfo = {
          userId: userSettings.userId,
          profileImageUrl: userSettings.profileImageUrl,
          username: userSettings.username,
          nickname: userSettings.nickname,
          birthDate: userSettings.birthDate,
          email: userSettings.email,
          phoneNumber: userSettings.phoneNumber,
          password: userSettings.password,
          isSocial: userSettings.isSocial || false,
        };

        setUserInfo(editInfo);
      } catch (error) {
        console.error('개인정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  // 비밀번호 확인 및 reauthToken 발급 (전화번호/비밀번호 변경, 회원탈퇴 시에만)
  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await personalInfoApi.verifyPassword(password);
      setReauthToken(response.reauthToken);
      return true;
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 프로필 이미지 업데이트 (accessToken만 사용)
  const updateProfileImage = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const newImageUrl = await personalInfoApi.updateProfileImage(file);

      setUserInfo(prev => (prev ? { ...prev, profileImageUrl: newImageUrl } : null));

      console.log('프로필 이미지 업로드 성공:', newImageUrl);
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 닉네임 업데이트 (accessToken만 사용)
  const updateNickname = useCallback(
    async (nickname: string) => {
      setIsLoading(true);
      try {
        const updatedInfo = await personalInfoApi.updateNickname(nickname);

        const editInfo: UserEditInfo = {
          userId: updatedInfo.userId,
          profileImageUrl: updatedInfo.profileImageUrl,
          username: updatedInfo.username,
          nickname: updatedInfo.nickname,
          birthDate: updatedInfo.birthDate,
          email: updatedInfo.email,
          phoneNumber: updatedInfo.phoneNumber,
          password: updatedInfo.password,
          isSocial: userInfo?.isSocial || false,
        };

        setUserInfo(editInfo);
        console.log('닉네임 수정 성공:', nickname);
      } catch (error) {
        console.error('닉네임 수정 실패:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userInfo?.isSocial]
  );

  // 전화번호 업데이트 (accessToken + reauthToken 사용)
  const updatePhoneNumber = useCallback(
    async (phoneNumber: string) => {
      if (!reauthToken) {
        throw new Error('인증 토큰이 없습니다. 비밀번호를 다시 확인해주세요.');
      }

      setIsLoading(true);
      try {
        // API는 하이픈 없는 형태를 기대하므로 제거
        const cleanPhoneNumber = phoneNumber.replace(/-/g, '');
        const updatedInfo = await personalInfoApi.updatePhone(cleanPhoneNumber, reauthToken);

        const editInfo: UserEditInfo = {
          userId: updatedInfo.userId,
          profileImageUrl: updatedInfo.profileImageUrl,
          username: updatedInfo.username,
          nickname: updatedInfo.nickname,
          birthDate: updatedInfo.birthDate,
          email: updatedInfo.email,
          phoneNumber: updatedInfo.phoneNumber,
          password: updatedInfo.password,
          isSocial: userInfo?.isSocial || false,
        };

        setUserInfo(editInfo);
        console.log('전화번호 수정 성공:', phoneNumber);
      } catch (error) {
        console.error('전화번호 수정 실패:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [reauthToken, userInfo?.isSocial]
  );

  // 비밀번호 업데이트 (accessToken + reauthToken 사용)
  const updatePassword = useCallback(
    async (newPassword: string) => {
      if (!reauthToken) {
        throw new Error('인증 토큰이 없습니다. 비밀번호를 다시 확인해주세요.');
      }

      setIsLoading(true);
      try {
        await personalInfoApi.updatePassword(newPassword, newPassword, reauthToken);

        // 비밀번호 변경 후에는 새로운 인증이 필요하므로 reauthToken 초기화
        setReauthToken(null);

        setUserInfo(prev => (prev ? { ...prev, password: '********' } : null));

        console.log('비밀번호 수정 성공');
      } catch (error) {
        console.error('비밀번호 수정 실패:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [reauthToken]
  );

  // 회원 탈퇴 (소셜: accessToken만, 일반: accessToken + reauthToken)
  const withdrawUser = useCallback(async () => {
    // 소셜 로그인이 아닌 경우에만 reauthToken 필요
    if (!userInfo?.isSocial && !reauthToken) {
      throw new Error('인증 토큰이 없습니다. 비밀번호를 다시 확인해주세요.');
    }

    setIsLoading(true);
    try {
      // 소셜 로그인인 경우 reauthToken 없이 호출
      await personalInfoApi.deleteAccount(
        userInfo?.isSocial ? undefined : reauthToken || undefined
      );

      // 탈퇴 성공 시 상태 초기화
      setUserInfo(null);
      setReauthToken(null);

      console.log('회원 탈퇴 성공');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [reauthToken, userInfo?.isSocial]);

  // reauthToken 만료 시 초기화
  useEffect(() => {
    if (reauthToken) {
      // reauthToken은 단기간 유효하므로 30분 후 자동 초기화
      const timer = setTimeout(
        () => {
          setReauthToken(null);
          console.log('reauthToken 만료로 인한 자동 초기화');
        },
        30 * 60 * 1000
      ); // 30분

      return () => clearTimeout(timer);
    }
  }, [reauthToken]);

  return {
    userInfo,
    isLoading,
    isAuthenticated: !!reauthToken,
    updateProfileImage,
    updateNickname,
    updatePhoneNumber,
    updatePassword,
    verifyPassword,
    withdrawUser,
    clearAuthentication: () => {
      setReauthToken(null);
    },
  };
};
