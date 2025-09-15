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
  // 전화번호 포맷팅 (010-1234-5678)
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';

    // 숫자만 추출
    const numbers = phone.replace(/\D/g, '');

    // 이미 포맷된 경우 그대로 반환
    if (phone.includes('-')) {
      return phone;
    }

    // 포맷 적용
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 생년월일 포맷팅 (YYYY.MM.DD)
  const formatBirthDate = (birthDate: string): string => {
    if (!birthDate) return '';

    // 이미 포맷된 경우 그대로 반환
    if (birthDate.includes('.')) {
      return birthDate;
    }

    // ISO 날짜 형식(YYYY-MM-DD)을 점으로 변경
    if (birthDate.includes('-')) {
      return birthDate.replace(/-/g, '.');
    }

    return birthDate;
  };
  // 비밀번호 표시 값 계산
  const getPasswordDisplay = () => {
    if (userInfo.isSocial) {
      return ''; // 소셜 로그인 시 빈칸
    }
    return '*'.repeat(userInfo.password?.length || 8);
  };

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
            value={formatBirthDate(userInfo.birthDate)}
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
        value={formatPhoneNumber(userInfo.phoneNumber)}
        buttonText="전화번호 변경"
        onEdit={onPhoneEdit}
        disabled={userInfo.isSocial}
      />

      {/* 비밀번호 */}
      <EditableFieldRow
        label="비밀번호"
        value={getPasswordDisplay()}
        buttonText="비밀번호 변경"
        inputType="text"
        onEdit={onPasswordEdit}
        disabled={userInfo.isSocial}
      />
    </div>
  );
};

export default PersonalInfoForm;
