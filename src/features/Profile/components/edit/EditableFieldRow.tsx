import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';

import styles from './EditableFieldRow.module.scss';

interface EditableFieldRowProps {
  label: string;
  value: string;
  buttonText: string;
  onEdit: () => void;
  disabled?: boolean;
  inputType?: 'text' | 'password';
}

const EditableFieldRow = ({
  label,
  value,
  buttonText,
  onEdit,
  disabled = false,
  inputType = 'text',
}: EditableFieldRowProps) => {
  // 읽기전용 인풋 클릭 방지
  const handleReadOnlyInputEvents = (e: React.MouseEvent | React.FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target instanceof HTMLElement) {
      e.target.blur();
    }
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldRow}>
        <Input
          type={inputType}
          value={value}
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
        <Button
          variant="secondary"
          onClick={onEdit}
          disabled={disabled}
          className={styles.editButton}
          padding="0 16px"
          height="40px"
          radius="xsm"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default EditableFieldRow;
