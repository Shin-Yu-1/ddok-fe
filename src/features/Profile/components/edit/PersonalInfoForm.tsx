import Input from '@/components/Input/Input';

import type { UserEditInfo } from '../../hooks/useEditMyInfo';

import EditableFieldRow from './EditableFieldRow';
import styles from './PersonalInfoForm.module.scss';

interface PersonalInfoFormProps {
  userInfo: UserEditInfo;
  onPhoneEdit: () => void;
  onPasswordEdit: () => void;
  className?: string;
}

const PersonalInfoForm = ({
  userInfo,
  onPhoneEdit,
  onPasswordEdit,
  className,
}: PersonalInfoFormProps) => {
  // 읽기전용 인풋 클릭 방지
  const handleReadOnlyInputEvents = (e: React.MouseEvent | React.FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target instanceof HTMLElement) {
      e.target.blur();
    }
  };

  return (
    <div className={`${styles.formSection} ${className || ''}`}>
      {/* 이름 */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>이름</label>
        <div className={styles.fieldRow}>
          <Input
            type="text"
            value={userInfo.username}
            readOnly
            className={styles.readOnlyInput}
            width="100%"
            height="40px"
            border="1px solid var(--gray-3)"
            backgroundColor="var(--gray-4)"
            tabIndex={-1}
            onFocus={handleReadOnlyInputEvents}
            onClick={handleReadOnlyInputEvents}
            onMouseDown={handleReadOnlyInputEvents}
            style={{
              cursor: 'default',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* 생년월일 */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>생년월일</label>
        <div className={styles.fieldRow}>
          <Input
            type="text"
            value={userInfo.birthDate}
            readOnly
            className={styles.readOnlyInput}
            width="100%"
            height="40px"
            border="1px solid var(--gray-3)"
            backgroundColor="var(--gray-4)"
            tabIndex={-1}
            onFocus={handleReadOnlyInputEvents}
            onClick={handleReadOnlyInputEvents}
            onMouseDown={handleReadOnlyInputEvents}
            style={{
              cursor: 'default',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>이메일</label>
        <div className={styles.fieldRow}>
          <Input
            type="email"
            value={userInfo.email}
            readOnly
            className={styles.readOnlyInput}
            width="100%"
            height="40px"
            border="1px solid var(--gray-3)"
            backgroundColor="var(--gray-4)"
            tabIndex={-1}
            onFocus={handleReadOnlyInputEvents}
            onClick={handleReadOnlyInputEvents}
            onMouseDown={handleReadOnlyInputEvents}
            style={{
              cursor: 'default',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* 전화번호 */}
      <EditableFieldRow
        label="전화번호"
        value={userInfo.phoneNumber}
        buttonText="전화번호 변경"
        onEdit={onPhoneEdit}
        disabled={userInfo.isSocial}
      />

      {/* 비밀번호 */}
      <EditableFieldRow
        label="비밀번호"
        value="**********"
        buttonText="비밀번호 변경"
        inputType="password"
        onEdit={onPasswordEdit}
        disabled={userInfo.isSocial}
      />
    </div>
  );
};

export default PersonalInfoForm;
