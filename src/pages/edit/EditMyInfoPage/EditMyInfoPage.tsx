import { useState, useEffect } from 'react';

import { ArrowBendUpLeftIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import EditNicknameModal from '@/features/Profile/components/edit/modals/EditNicknameModal';
import EditPasswordModal from '@/features/Profile/components/edit/modals/EditPasswordModal';
import EditPhoneModal from '@/features/Profile/components/edit/modals/EditPhoneModal';
import PasswordConfirmModal from '@/features/Profile/components/edit/modals/PasswordConfirmModal';
import PersonalInfoForm from '@/features/Profile/components/edit/PersonalInfoForm';
import ProfileImageEditor from '@/features/Profile/components/edit/ProfileImageEditor';
import { useEditMyInfo } from '@/features/Profile/hooks/useEditMyInfo';

import styles from './EditMyInfoPage.module.scss';

const EditMyInfoPage = () => {
  const navigate = useNavigate();
  const {
    userInfo,
    isLoading,
    isAuthenticated,
    updateProfileImage,
    updateNickname,
    updatePhoneNumber,
    updatePassword,
    verifyPassword,
    withdrawUser,
    clearAuthentication,
  } = useEditMyInfo();

  // 모달 상태
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'phone' | 'password' | 'initial' | null>(null);

  // 페이지 진입 시 초기 비밀번호 확인
  useEffect(() => {
    if (!isAuthenticated && !showPasswordConfirmModal) {
      setPendingAction('initial');
      setShowPasswordConfirmModal(true);
    }
  }, [isAuthenticated, showPasswordConfirmModal]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNicknameEdit = () => {
    if (!isAuthenticated) {
      setPendingAction('initial');
      setShowPasswordConfirmModal(true);
      return;
    }
    setShowNicknameModal(true);
  };

  const handleNicknameSave = async (nickname: string) => {
    try {
      await updateNickname(nickname);
      setShowNicknameModal(false);
    } catch (error) {
      console.error('닉네임 저장 실패:', error);
      alert('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handlePhoneEdit = () => {
    if (!isAuthenticated) {
      setPendingAction('initial');
      setShowPasswordConfirmModal(true);
      return;
    }
    setPendingAction('phone');
    setShowPasswordConfirmModal(true);
  };

  const handlePasswordEdit = () => {
    if (!isAuthenticated) {
      setPendingAction('initial');
      setShowPasswordConfirmModal(true);
      return;
    }
    setPendingAction('password');
    setShowPasswordConfirmModal(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    try {
      const isValid = await verifyPassword(password);
      if (!isValid) {
        alert('현재 비밀번호가 일치하지 않습니다.');
        return;
      }

      setShowPasswordConfirmModal(false);

      // 확인 완료 후 해당 모달 열기
      if (pendingAction === 'phone') {
        setShowPhoneModal(true);
      } else if (pendingAction === 'password') {
        setShowPasswordModal(true);
      }
      // 'initial'인 경우는 단순히 인증만 하고 끝

      setPendingAction(null);
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordConfirmCancel = () => {
    setShowPasswordConfirmModal(false);

    // 초기 인증을 거부한 경우 이전 페이지로 돌아가기
    if (pendingAction === 'initial') {
      navigate(-1);
    }

    setPendingAction(null);
  };

  const handlePhoneSave = async (phoneNumber: string) => {
    try {
      await updatePhoneNumber(phoneNumber);
      setShowPhoneModal(false);
    } catch (error) {
      console.error('전화번호 저장 실패:', error);
      alert('전화번호 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handlePasswordSave = async (newPassword: string) => {
    try {
      await updatePassword(newPassword);
      setShowPasswordModal(false);

      // 비밀번호 변경 후 재인증 필요 알림
      alert('비밀번호가 변경되었습니다. 보안을 위해 다시 인증해주세요.');
      clearAuthentication();
    } catch (error) {
      console.error('비밀번호 저장 실패:', error);
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleProfileImageChange = async (file: File) => {
    if (!isAuthenticated) {
      setPendingAction('initial');
      setShowPasswordConfirmModal(true);
      return;
    }

    try {
      await updateProfileImage(file);
    } catch (error) {
      console.error('프로필 이미지 변경 실패:', error);
      alert('프로필 이미지 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleWithdraw = async () => {
    if (!isAuthenticated) {
      setPendingAction('initial');
      setShowPasswordConfirmModal(true);
      return;
    }

    const confirmed = window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
      try {
        await withdrawUser();
        alert('회원 탈퇴가 완료되었습니다.');
        // 탈퇴 성공 시 로그인 페이지로 이동
        navigate('/auth/signin');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  // 사용자 정보가 없는 경우 로딩 또는 인증 요구
  if (!userInfo && !showPasswordConfirmModal) {
    return (
      <main className={styles.editMyInfoPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
              aria-label="뒤로가기"
            >
              <ArrowBendUpLeftIcon size={16} weight="bold" />
              돌아가기
            </button>
            <h1 className={styles.title}>개인 정보 변경</h1>
          </div>

          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>개인정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.editMyInfoPage}>
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
            aria-label="뒤로가기"
          >
            <ArrowBendUpLeftIcon size={16} weight="bold" />
            돌아가기
          </button>
          <h1 className={styles.title}>개인 정보 변경</h1>
        </div>

        {userInfo && (
          <>
            {/* 프로필 이미지 및 닉네임 */}
            <ProfileImageEditor
              profileImageUrl={userInfo.profileImageUrl}
              nickname={userInfo.nickname}
              onImageChange={handleProfileImageChange}
              onNicknameEdit={handleNicknameEdit}
            />

            {/* 개인정보 폼 */}
            <PersonalInfoForm
              userInfo={userInfo}
              onPhoneEdit={handlePhoneEdit}
              onPasswordEdit={handlePasswordEdit}
            />

            {/* 하단 버튼 */}
            <div className={styles.bottomSection}>
              <label className={styles.withdrawButton}>탈퇴하기</label>

              <Button
                variant="danger"
                onClick={handleWithdraw}
                disabled={isLoading}
                className={styles.withdrawMainButton}
                height="40px"
                radius="xsm"
              >
                탈퇴하기
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 닉네임 편집 모달 */}
      {userInfo && (
        <EditNicknameModal
          isOpen={showNicknameModal}
          onClose={() => setShowNicknameModal(false)}
          currentNickname={userInfo.nickname}
          onSave={handleNicknameSave}
          isLoading={isLoading}
        />
      )}

      {/* 비밀번호 확인 모달 */}
      <PasswordConfirmModal
        isOpen={showPasswordConfirmModal}
        onClose={handlePasswordConfirmCancel}
        onConfirm={handlePasswordConfirm}
        isLoading={isLoading}
        title="비밀번호를 입력해주세요"
        subtitle={
          pendingAction === 'initial'
            ? '개인정보 확인을 위해 현재 비밀번호를 입력해주세요.'
            : `${pendingAction === 'phone' ? '전화번호' : '비밀번호'} 변경을 위해 현재 비밀번호를 입력해주세요.`
        }
      />

      {/* 전화번호 편집 모달 */}
      <EditPhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSave={handlePhoneSave}
        isLoading={isLoading}
      />

      {/* 비밀번호 편집 모달 */}
      <EditPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordSave}
        isLoading={isLoading}
      />
    </main>
  );
};

export default EditMyInfoPage;
