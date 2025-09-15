import { useState } from 'react';

import { ArrowBendUpLeftIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/api/auth';
import EditNicknameModal from '@/features/Profile/components/edit/modals/EditNicknameModal';
import EditPasswordModal from '@/features/Profile/components/edit/modals/EditPasswordModal';
import EditPhoneModal from '@/features/Profile/components/edit/modals/EditPhoneModal';
import PasswordConfirmModal from '@/features/Profile/components/edit/modals/PasswordConfirmModal';
import PersonalInfoForm from '@/features/Profile/components/edit/PersonalInfoForm';
import ProfileImageEditor from '@/features/Profile/components/edit/ProfileImageEditor';
import { useEditMyInfo } from '@/features/Profile/hooks/useEditMyInfo';
import { DDtoast } from '@/features/toast';

import styles from './EditMyInfoPage.module.scss';

type PendingActionType = 'phone' | 'password' | null;

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
  } = useEditMyInfo();

  // 모달 상태
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingActionType>(null);

  const handleBack = () => {
    navigate(-1);
  };

  // 닉네임 수정 (바로 가능)
  const handleNicknameEdit = () => {
    setShowNicknameModal(true);
  };

  // 백엔드 에러 메시지 처리 추가
  const handleNicknameSave = async (nickname: string) => {
    try {
      await updateNickname(nickname);
      setShowNicknameModal(false);
    } catch (error) {
      console.error('닉네임 저장 실패:', error);
      const errorMessage = getErrorMessage(error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: errorMessage,
      });
    }
  };

  // 전화번호 수정 (소셜 로그인 시 비활성화, 비밀번호 확인 필요)
  const handlePhoneEdit = () => {
    if (userInfo?.isSocial) return; // 소셜 로그인 시 실행하지 않음

    setPendingAction('phone');
    setShowPasswordConfirmModal(true);
  };

  // 비밀번호 수정 (소셜 로그인 시 비활성화, 비밀번호 확인 필요)
  const handlePasswordEdit = () => {
    if (userInfo?.isSocial) return; // 소셜 로그인 시 실행하지 않음

    setPendingAction('password');
    setShowPasswordConfirmModal(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    try {
      const isValid = await verifyPassword(password);
      if (!isValid) {
        DDtoast({
          mode: 'custom',
          type: 'error',
          userMessage: '현재 비밀번호가 일치하지 않습니다. 다시 시도해주세요.',
        });
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
      const errorMessage = getErrorMessage(error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: errorMessage,
      });
    }
  };

  const handlePasswordConfirmCancel = () => {
    setShowPasswordConfirmModal(false);
    setPendingAction(null);
  };

  const handlePhoneSave = async (phoneNumber: string) => {
    try {
      await updatePhoneNumber(phoneNumber);
      setShowPhoneModal(false);
    } catch (error) {
      console.error('전화번호 저장 실패:', error);
      const errorMessage = getErrorMessage(error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: errorMessage,
      });
    }
  };

  const handlePasswordSave = async (newPassword: string) => {
    try {
      await updatePassword(newPassword);
      setShowPasswordModal(false);
    } catch (error) {
      console.error('비밀번호 저장 실패:', error);
      const errorMessage = getErrorMessage(error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: errorMessage,
      });
    }
  };

  const handleProfileImageChange = async (file: File) => {
    try {
      await updateProfileImage(file);
    } catch (error) {
      console.error('프로필 이미지 변경 실패:', error);
      const errorMessage = getErrorMessage(error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: errorMessage,
      });
    }
  };

  // 사용자 정보가 없는 경우 로딩
  if (!userInfo) {
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

  // 비밀번호 확인 모달 제목 생성
  const getPasswordModalSubtitle = (): string => {
    if (pendingAction === 'phone') {
      return '전화번호 변경을 위해 현재 비밀번호를 입력해주세요.';
    }
    if (pendingAction === 'password') {
      return '비밀번호 변경을 위해 현재 비밀번호를 입력해주세요.';
    }
    return '현재 비밀번호를 입력해주세요.';
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
            <ArrowBendUpLeftIcon size={16} weight="bold" />
            돌아가기
          </button>
          <h1 className={styles.title}>개인 정보 변경</h1>
        </div>

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
        subtitle={getPasswordModalSubtitle()}
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
