import { useState } from 'react';

import { X } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import User from '@/features/Team/components/UserRow/UserRow';

import type { MemberType } from '../../schemas/teamMemberSchema';

import styles from './SelectMemberModal.module.scss';

interface SelectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberType[];
  onSelectMember: (member: MemberType) => void;
}

const SelectMemberModal = ({
  isOpen,
  onClose,
  members,
  onSelectMember,
}: SelectMemberModalProps) => {
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  const handleMemberSelect = (member: MemberType) => {
    setSelectedMember(member);
  };

  const handleConfirm = () => {
    if (selectedMember) {
      onSelectMember(selectedMember);
      onClose();
      setSelectedMember(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedMember(null);
  };

  if (!isOpen) return null;

  // 자신을 제외한 팀원들만 필터링
  const evaluatableMembers = members.filter(member => !member.isMine);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 모달 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>평가할 팀원 선택</h2>
              <Button
                backgroundColor="transparent"
                width={24}
                height={24}
                padding="0px"
                onClick={handleClose}
                style={{ flexShrink: 0 }}
              >
                <X size={24} weight="light" color="var(--black-1)" />
              </Button>
            </div>
            <p className={styles.subtitle}>평가하고 싶은 팀원을 선택해주세요.</p>
          </div>
        </div>

        {/* 팀원 리스트 */}
        <div className={styles.content}>
          {evaluatableMembers.length === 0 ? (
            <div className={styles.empty}>평가할 수 있는 팀원이 없습니다.</div>
          ) : (
            <div className={styles.memberList}>
              {evaluatableMembers.map(member => (
                <div
                  key={member.memberId}
                  className={`${styles.memberItem} ${
                    selectedMember?.memberId === member.memberId ? styles.selected : ''
                  }`}
                  onClick={() => handleMemberSelect(member)}
                >
                  <User user={member.user} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className={styles.footer}>
          <div className={styles.buttonGroup}>
            <Button
              onClick={handleClose}
              backgroundColor="var(--gray-2)"
              textColor="var(--black-1)"
              radius="sm"
              fontSize="var(--fs-xsmall)"
              className={styles.cancelButton}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              backgroundColor="var(--blue-1)"
              textColor="var(--white-3)"
              radius="sm"
              fontSize="var(--fs-xsmall)"
              className={styles.confirmButton}
              disabled={!selectedMember}
            >
              평가하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectMemberModal;
