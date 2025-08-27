import { useState } from 'react';

import MDEditor from '@uiw/react-md-editor';

import styles from './MarkdownEditor.module.scss';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  mode?: 'editor' | 'viewer';
  className?: string;
  defaultValue?: string;
}

const MarkdownEditor = ({
  value,
  onChange,
  placeholder = '프로젝트에 대한 상세 설명을 마크다운으로 작성해주세요...',
  height = 500,
  mode = 'editor',
  className,
  defaultValue = '값을 입력해주세요',
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // value가 제공되지 않으면 defaultValue 사용
  const currentValue = value ?? defaultValue;

  const handleChange = (val?: string) => {
    if (onChange) {
      onChange(val || '');
    }
  };

  const handleTabClick = (tab: 'write' | 'preview') => {
    setActiveTab(tab);
  };

  // Viewer 모드일 때는 탭 없이 preview만 표시
  if (mode === 'viewer') {
    return (
      <div className={`${styles.editorContainer} ${className || ''}`}>
        <MDEditor
          value={currentValue}
          height={height}
          preview="preview" // preview 고정
          hideToolbar={true} // 툴바 숨김
          visibleDragbar={false}
          data-color-mode="light"
          className={styles.mdEditor}
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
        textareaProps={{
          placeholder,
          style: {
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        }}
        className={styles.mdEditor}
      />
    </div>
  );
};

export default MarkdownEditor;
