import { useState } from 'react';

import MDEditor, { commands } from '@uiw/react-md-editor';

import styles from './MarkdownEditor.module.scss';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  mode?: 'editor' | 'viewer';
  className?: string;
  maxLength?: number;
}

const MarkdownEditor = ({
  value,
  onChange,
  placeholder = '프로젝트에 대한 상세 설명을 마크다운으로 작성해주세요...',
  height = 500,
  mode = 'editor',
  className,
  maxLength = 2000,
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // value가 제공되지 않으면 빈 문자열 사용
  const currentValue = value ?? '';

  const handleChange = (val?: string) => {
    if (onChange) {
      const newValue = val || '';
      // 글자 수 제한 확인
      if (newValue.length <= maxLength) {
        onChange(newValue);
      }
    }
  };

  const handleTabClick = (tab: 'write' | 'preview') => {
    setActiveTab(tab);
  };

  // 테이블 명령어를 제외한 명령어들만 필터링
  const filteredCommands = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.group(
      [
        commands.title1,
        commands.title2,
        commands.title3,
        commands.title4,
        commands.title5,
        commands.title6,
      ],
      {
        name: 'title',
        groupName: 'title',
        buttonProps: { 'aria-label': 'Insert title' },
      }
    ),
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.image,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
  ];

  // Viewer 모드일 때는 탭 없이 preview만 표시
  if (mode === 'viewer') {
    return (
      <div className={`${styles.editorContainer} ${className || ''}`}>
        <MDEditor
          value={currentValue}
          height={height}
          preview="preview"
          hideToolbar={true}
          visibleDragbar={false}
          data-color-mode="light"
        />
      </div>
    );
  }

  // Editor 모드일 때는 탭 헤더와 함께 표시
  return (
    <div className={`${styles.editorContainer} ${className || ''}`}>
      {/* 커스텀 탭 헤더 (Editor 모드에서만) */}
      <div className={styles.tabHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === 'write' ? styles.active : ''}`}
          onClick={() => handleTabClick('write')}
        >
          Write
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'preview' ? styles.active : ''}`}
          onClick={() => handleTabClick('preview')}
        >
          Preview
        </button>
      </div>

      {/* 에디터 */}
      <MDEditor
        value={currentValue}
        onChange={handleChange}
        height={height}
        preview={activeTab === 'write' ? 'edit' : 'preview'}
        hideToolbar={activeTab === 'preview'}
        visibleDragbar={false}
        data-color-mode="light"
        commands={filteredCommands}
        textareaProps={{
          placeholder,
          maxLength,
        }}
      />

      {/* 글자 수 카운터 */}
      <div className={styles.characterCount}>
        <span
          className={
            currentValue.length >= maxLength
              ? styles.maxReached
              : currentValue.length >= maxLength * 0.9
                ? styles.warning
                : ''
          }
        >
          {currentValue.length.toLocaleString()}/{maxLength.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default MarkdownEditor;
