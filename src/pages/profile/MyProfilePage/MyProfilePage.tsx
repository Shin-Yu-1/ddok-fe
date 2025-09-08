import EditIntroductionModal from '@/features/Profile/components/modals/EditIntroductionModal';
import ProfileView from '@/features/Profile/components/ProfileView';
import { useProfileData, useProfileEdit } from '@/features/Profile/hooks';

import styles from './MyProfilePage.module.scss';

const MyProfilePage = () => {
  const { profileData, isLoading } = useProfileData(undefined, true);
  const { handleEdit, handleEditPersonalInfo, handleEditIntroduction, closeModal, isModalOpen } =
    useProfileEdit();

  return (
    <main className={styles.myProfilePage}>
      <div className={styles.content}>
        {profileData ? (
          <>
            <ProfileView
              user={profileData}
              isEditable={true}
              onEdit={handleEdit}
              isLoading={isLoading}
              className={styles.profileView}
              onEditPersonalInfo={handleEditPersonalInfo}
              onEditIntroduction={handleEditIntroduction}
            />

            {/* 자기소개 수정 모달 연결 */}
            <EditIntroductionModal
              isOpen={isModalOpen('introduction')}
              onClose={() => closeModal('introduction')}
              user={profileData}
            />
          </>
        ) : (
          <div className={styles.noData}>
            <p>프로필 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyProfilePage;
