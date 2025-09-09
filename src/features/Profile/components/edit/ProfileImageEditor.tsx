import { CameraIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';

import { useProfileImage } from '../../hooks/useProfileImage';

import styles from './ProfileImageEditor.module.scss';

interface ProfileImageEditorProps {
  profileImageUrl: string;
  nickname: string;
  onImageChange: (file: File) => void | Promise<void>;
  onNicknameEdit: () => void;
  className?: string;
}

const ProfileImageEditor = ({
  profileImageUrl,
  nickname,
  onImageChange,
  onNicknameEdit,
  className,
}: ProfileImageEditorProps) => {
  const { fileInputRef, handleImageClick, handleImageChange } = useProfileImage(onImageChange);

  return (
    <div className={`${styles.profileSection} ${className || ''}`}>
      <div className={styles.profileInfo}>
        <div className={styles.profileImageContainer}>
          <img src={profileImageUrl} alt="프로필 이미지" className={styles.profileImage} />
          <button
            type="button"
            onClick={handleImageClick}
            className={styles.imageEditButton}
            aria-label="프로필 이미지 변경"
          >
            <CameraIcon size={16} weight="bold" />
          </button>
        </div>

        <span className={styles.profileLabel}>{nickname}</span>
      </div>

      <Button
        variant="secondary"
        onClick={onNicknameEdit}
        className={styles.nicknameEditButton}
        height="40px"
        radius="xsm"
      >
        닉네임 변경
      </Button>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProfileImageEditor;
