import { useState, useEffect, useCallback } from 'react';

import { CheckIcon, CopyIcon, MagicWandIcon, XCircleIcon } from '@phosphor-icons/react';

import { api } from '@/api/api';
import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import { DDtoast } from '@/features/toast';
import type {
  CreateProjectData,
  UpdateProjectData,
  ProjectAIRequest,
  AIWriteResponse as ProjectAIResponse,
} from '@/types/project';
import type {
  CreateStudyData,
  UpdateStudyData,
  StudyAIRequest,
  AIWriteResponse as StudyAIResponse,
} from '@/types/study';

import styles from './AIWriteModal.module.scss';

interface ValidationStatus {
  title: boolean;
  expectedStart: boolean;
  expectedMonth: boolean;
  mode: boolean;
  location: boolean;
  capacity: boolean;
  studyType?: boolean; // 스터디 전용
  positions?: boolean; // 프로젝트 전용
  leaderPosition?: boolean; // 프로젝트 전용
}

type FormData = CreateProjectData | UpdateProjectData | CreateStudyData | UpdateStudyData;

interface AIWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContent: (content: string) => void;
  formData: FormData;
  postType: 'project' | 'study';
}

type Step = 'validation' | 'prompt' | 'result';

const AIWriteModal = ({
  isOpen,
  onClose,
  onApplyContent,
  formData,
  postType,
}: AIWriteModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('validation');
  const [promptInput, setPromptInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    title: false,
    expectedStart: false,
    expectedMonth: false,
    mode: false,
    location: false,
    capacity: false,
  });
  const [isCopied, setIsCopied] = useState(false);

  // 유효성 검사 함수
  const checkValidation = useCallback(() => {
    if (!formData) return;

    const status: ValidationStatus = {
      title: !!formData.title?.trim(),
      expectedStart: !!formData.expectedStart,
      expectedMonth: formData.expectedMonth >= 1,
      mode: !!formData.mode,
      location: formData.mode === 'online' || !!formData.location,
      capacity: formData.capacity >= 1 && formData.capacity <= 7,
    };

    if (postType === 'study') {
      const studyData = formData as CreateStudyData | UpdateStudyData;
      status.studyType = !!studyData.studyType?.trim();
    } else if (postType === 'project') {
      const projectData = formData as CreateProjectData | UpdateProjectData;
      status.positions = Array.isArray(projectData.positions) && projectData.positions.length > 0;
      status.leaderPosition = !!projectData.leaderPosition?.trim();
    }

    setValidationStatus(status);
  }, [formData, postType]);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('validation');
      setPromptInput('');
      setAiResult('');
      setIsCopied(false);
      checkValidation();
    }
  }, [isOpen, checkValidation]);

  // 모든 필수 항목이 유효한지 확인
  const isAllValid = () => {
    const baseValid = Object.values(validationStatus).every(Boolean);
    return baseValid;
  };

  // AI API 호출
  const handleAIRequest = async () => {
    if (!promptInput.trim()) {
      DDtoast({
        mode: 'custom',
        type: 'warning',
        userMessage: 'AI에게 요청할 내용을 입력해주세요.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = postType === 'project' ? '/api/projects/ai' : '/api/studies/ai';

      let requestData: ProjectAIRequest | StudyAIRequest;

      if (postType === 'project') {
        const projectData = formData as CreateProjectData | UpdateProjectData;
        requestData = {
          title: projectData.title,
          expectedStart: projectData.expectedStart,
          expectedMonth: projectData.expectedMonth,
          mode: projectData.mode,
          location: projectData.mode === 'offline' ? projectData.location : null,
          preferredAges: projectData.preferredAges,
          capacity: projectData.capacity,
          traits: projectData.traits || [],
          positions: projectData.positions || [],
          leaderPosition: projectData.leaderPosition,
          detail: promptInput,
        } as ProjectAIRequest;
      } else {
        const studyData = formData as CreateStudyData | UpdateStudyData;
        requestData = {
          title: studyData.title,
          expectedStart: studyData.expectedStart,
          expectedMonth: studyData.expectedMonth,
          mode: studyData.mode,
          location: studyData.mode === 'offline' ? studyData.location : null,
          preferredAges: studyData.preferredAges,
          capacity: studyData.capacity,
          traits: studyData.traits || [],
          studyType: studyData.studyType,
          detail: promptInput,
        } as StudyAIRequest;
      }

      const response = await api.post<ProjectAIResponse | StudyAIResponse>(endpoint, requestData);

      if (response.data.data?.detail) {
        setAiResult(response.data.data.detail);
        setCurrentStep('result');
      } else {
        throw new Error('AI 응답에서 내용을 찾을 수 없습니다.');
      }
    } catch (apiError) {
      DDtoast({
        mode: 'server-first',
        type: 'error',
        userMessage: 'AI 글 작성 중 오류가 발생했습니다.',
        apiResponse: apiError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 결과 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(aiResult);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '복사에 실패했습니다.',
      });
    }
  };

  // 결과 적용하고 모달 닫기
  const handleApply = () => {
    onApplyContent(aiResult);
    onClose();
  };

  // 다시 하기
  const handleRetry = () => {
    setCurrentStep('prompt');
    setAiResult('');
    setIsCopied(false);
  };

  const renderValidationItem = (label: string, isValid: boolean) => (
    <div className={styles.validationItem}>
      {isValid ? (
        <CheckIcon size={16} color="var(--green-1)" weight="bold" />
      ) : (
        <XCircleIcon size={16} color="var(--red-1)" weight="bold" />
      )}
      <span className={`${styles.validationText} ${isValid ? styles.valid : styles.invalid}`}>
        {label}: {isValid ? '문제 없음' : '입력 필요'}
      </span>
    </div>
  );

  const renderValidationStep = () => (
    <div className={styles.validationStep}>
      <div className={styles.description}>
        AI가 좋은 글을 작성하려면 기본 정보가 필요합니다. 아래 항목들을 확인해주세요.
      </div>

      <div className={styles.validationList}>
        {renderValidationItem('제목', validationStatus.title)}
        {renderValidationItem('시작 예정일', validationStatus.expectedStart)}
        {renderValidationItem('예상 기간', validationStatus.expectedMonth)}
        {renderValidationItem('모임 형태', validationStatus.mode)}
        {renderValidationItem('지역 정보', validationStatus.location)}
        {renderValidationItem('모집 인원', validationStatus.capacity)}

        {postType === 'study' &&
          renderValidationItem('스터디 유형', validationStatus.studyType || false)}
        {postType === 'project' && (
          <>
            {renderValidationItem('모집 포지션', validationStatus.positions || false)}
            {renderValidationItem('리더 포지션', validationStatus.leaderPosition || false)}
          </>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="secondary"
          onClick={() => setCurrentStep('prompt')}
          disabled={!isAllValid()}
        >
          다음 단계
        </Button>
      </div>
    </div>
  );

  const renderPromptStep = () => (
    <div className={styles.promptStep}>
      <div className={styles.description}>
        AI에게 어떤 내용으로 글을 작성해달라고 요청하시겠어요?
      </div>

      <textarea
        className={styles.promptTextarea}
        value={promptInput}
        onChange={e => setPromptInput(e.target.value)}
        placeholder={`예시: "${postType === 'project' ? '웹 개발 프로젝트' : '자바스크립트 스터디'}를 함께할 팀원을 모집합니다. 초보자도 환영하며, 서로 도우면서 성장할 수 있는 분들을 찾습니다."`}
        rows={6}
        disabled={isLoading}
      />

      <div className={styles.buttonGroup}>
        <Button variant="outline" onClick={() => setCurrentStep('validation')}>
          이전
        </Button>
        <Button
          variant="secondary"
          onClick={handleAIRequest}
          disabled={isLoading || !promptInput.trim()}
        >
          {isLoading ? (
            <>
              <MagicWandIcon size={16} className={styles.loadingIcon} />
              AI 작성 중...
            </>
          ) : (
            <>
              <MagicWandIcon size={16} />
              AI로 글 작성하기
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderResultStep = () => (
    <div className={styles.resultStep}>
      <div className={styles.description}>AI가 작성한 글입니다. 마음에 드시면 적용하세요!</div>

      <div className={styles.copyButtonContainer}>
        <Button variant="outline" size="sm" onClick={handleCopy} className={styles.copyButton}>
          {isCopied ? (
            <>
              <CheckIcon size={14} />
              복사됨
            </>
          ) : (
            <>
              <CopyIcon size={14} />
              복사하기
            </>
          )}
        </Button>
      </div>

      <div className={styles.resultContainer}>
        <div className={styles.resultContent}>{aiResult}</div>
      </div>

      <div className={styles.buttonGroup}>
        <Button variant="outline" onClick={handleRetry}>
          다시 하기
        </Button>
        <Button variant="secondary" onClick={handleApply}>
          글에 적용하기
        </Button>
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (currentStep) {
      case 'validation':
        return 'AI 글 작성 - 정보 확인';
      case 'prompt':
        return 'AI 글 작성 - 요청하기';
      case 'result':
        return 'AI 글 작성 - 결과';
      default:
        return 'AI 글 작성';
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      disableBackdropClose={isLoading}
      disableEscapeClose={isLoading}
    >
      {currentStep === 'validation' && renderValidationStep()}
      {currentStep === 'prompt' && renderPromptStep()}
      {currentStep === 'result' && renderResultStep()}
    </BaseModal>
  );
};

export default AIWriteModal;
