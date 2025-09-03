import { CaretDown } from '@phosphor-icons/react';
import { Select } from 'radix-ui';

import styles from './PostStatusSelector.module.scss';

type TeamStatus = 'RECRUITING' | 'ONGOING' | 'CLOSED';
type PostType = 'project' | 'study';

interface PostStatusSelectorProps {
  /** 현재 상태 값 */
  value: TeamStatus;
  /** 상태 변경 핸들러 (수정 모드에서만 사용) */
  onChange?: (status: TeamStatus) => void;
  /** 수정 가능 여부 */
  editable?: boolean;
  /** 게시물 타입 (프로젝트 또는 스터디) */
  postType: PostType;
}

const PostStatusSelector = ({
  value,
  onChange,
  editable = false,
  postType,
}: PostStatusSelectorProps) => {
  const getStatusText = (status: TeamStatus): string => {
    if (status === 'RECRUITING') {
      return '모집 중';
    }
    if (status === 'ONGOING') {
      return postType === 'project' ? '프로젝트 진행 중' : '스터디 진행 중';
    }
    if (status === 'CLOSED') {
      return postType === 'project' ? '프로젝트 종료' : '스터디 종료';
    }
    return '';
  };

  const getStatusClass = (status: TeamStatus): string => {
    switch (status) {
      case 'RECRUITING':
        return styles.recruiting;
      case 'ONGOING':
        return styles.ongoing;
      case 'CLOSED':
        return styles.closed;
      default:
        return '';
    }
  };

  if (!editable) {
    return (
      <div className={styles.container}>
        <div className={`${styles.statusButton} ${getStatusClass(value)} ${styles.fixed}`}>
          {getStatusText(value)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statusGroup}>
        <div className={`${styles.statusButton} ${getStatusClass(value)}`}>
          {getStatusText(value)}
        </div>

        <Select.Root value={value} onValueChange={newValue => onChange?.(newValue as TeamStatus)}>
          <Select.Trigger className={styles.dropdownTrigger} aria-label="상태 변경">
            <CaretDown size={14} color="var(--gray-1)" />
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className={styles.dropdownContent}
              position="popper"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <Select.Viewport className={styles.dropdownViewport}>
                <Select.Item value="RECRUITING" className={styles.dropdownItem}>
                  <Select.ItemText>모집 중</Select.ItemText>
                </Select.Item>
                <Select.Item value="ONGOING" className={styles.dropdownItem}>
                  <Select.ItemText>
                    {postType === 'project' ? '프로젝트 진행 중' : '스터디 진행 중'}
                  </Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
};

export default PostStatusSelector;
