import { useState } from 'react';

import { ArrowLeftIcon } from '@phosphor-icons/react';
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
    updateProfileImage,
    updateNickname,
    updatePhoneNumber,
    updatePassword,
    verifyPassword,
    withdrawUser,
  } = useEditMyInfo();

  // 모달 상태
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'phone' | 'password' | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNicknameEdit = () => {
    setShowNicknameModal(true);
  };

  const handleNicknameSave = async (nickname: string) => {
    await updateNickname(nickname);
    setShowNicknameModal(false);
  };

  const handlePhoneEdit = () => {
    setPendingAction('phone');
    setShowPasswordConfirmModal(true);
  };

  const handlePasswordEdit = () => {
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

      setPendingAction(null);
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordConfirmCancel = () => {
    setShowPasswordConfirmModal(false);
    setPendingAction(null);
  };

  const handlePhoneSave = async (phoneNumber: string) => {
    await updatePhoneNumber(phoneNumber);
    setShowPhoneModal(false);
  };

  const handlePasswordSave = async (newPassword: string) => {
    await updatePassword(newPassword);
    setShowPasswordModal(false);
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
      try {
        await withdrawUser();
        // 탈퇴 성공 시 로그인 페이지로 이동
        navigate('/auth/signin');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

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
            <ArrowLeftIcon size={24} weight="regular" />
            돌아가기
          </button>
          <h1 className={styles.title}>개인 정보 변경</h1>
        </div>

        {/* 프로필 이미지 및 닉네임 */}
        <ProfileImageEditor
          profileImageUrl={userInfo.profileImageUrl}
          nickname={userInfo.nickname}
          onImageChange={updateProfileImage}
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
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isLoading}
            className={styles.withdrawButton}
          >
            탈퇴하기
          </button>

          <Button
            variant="danger"
            onClick={handleWithdraw}
            disabled={isLoading}
            className={styles.withdrawMainButton}
            height="48px"
            fullWidth
          >
            탈퇴하기
          </Button>
        </div>
      </div>

      {/* 닉네임 편집 모달 */}
      <EditNicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        currentNickname={userInfo.nickname}
        onSave={handleNicknameSave}
        isLoading={isLoading}
      />

      {/* 비밀번호 확인 모달 */}
      <PasswordConfirmModal
        isOpen={showPasswordConfirmModal}
        onClose={handlePasswordConfirmCancel}
        onConfirm={handlePasswordConfirm}
        isLoading={isLoading}
        title="비밀번호를 입력해주세요"
        subtitle={`${pendingAction === 'phone' ? '전화번호' : '비밀번호'} 변경을 위해 현재 비밀번호를 입력해주세요.`}
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
