import { useState } from 'react';

import Button from '@/components/Button/Button';

import styles from './ButtonExamplePage.module.scss';

const ButtonExamplePage = () => {
  // 조건부 variant 예시를 위한 상태들
  const [isToggled, setIsToggled] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isActive, setIsActive] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'my'>('user');

  // 상태에 따른 버튼 variant 결정 함수
  const getStatusButtonVariant = () => {
    switch (status) {
      case 'loading':
        return 'outline';
      case 'success':
        return 'secondary';
      case 'error':
        return 'danger';
      default:
        return 'ghost';
    }
  };

  const handleStatusChange = () => {
    const statuses: Array<'idle' | 'loading' | 'success' | 'error'> = [
      'idle',
      'loading',
      'success',
      'error',
    ];
    const currentIndex = statuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setStatus(statuses[nextIndex]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ButtonExamplePage</h1>

      {/* 스타일 우선순위 설명 */}

      <h2 className={styles.subtitle}>스타일 적용 우선순위</h2>
      <div className={styles.priorityInfo}>
        <ol className={styles.orderedList}>
          <li>
            <strong>1. SCSS 프리셋</strong> - variant, size, radius 등
          </li>
          <li>
            <strong>2. className</strong> - clsx에서 나중에 와서 프리셋을 덮어쓸 수 있음
          </li>
          <li>
            <strong>3. 개별 props</strong> - width, height, fontSize 등 - 인라인 스타일
          </li>
          <li>
            <strong>4. style prop</strong> - 최종 오버라이드 - 인라인 스타일
          </li>
        </ol>
        <p>1,2,3,4가 모두 있을 경우 → 4번 style prop이 최종 승리</p>
        <p>예: fontSize="18px"가 fontSizePreset="small"보다 우선 적용</p>
      </div>

      <h2 className={styles.subtitle}>버튼 색</h2>
      <div className={styles.guideBox}>
        <p className={styles.guideTitle}>
          <strong>색 가이드</strong>
        </p>
        <ul className={styles.unorderedList}>
          <li>
            <code>primary</code>: (기본) gray-3, 1px 라인 + white-2 배경 + black-4 글자 /
            (호버일때)yellow-1, 1px 라인 + white-2 배경 + black-4 글자 / (활성화일때)yellow-1 배경 +
            white-3 글자
          </li>
          <li>
            <code>secondary</code>: (기본)black-3 배경 + white-3 글자 / (호버일때) black-3-hover
            배경 / (활성화일때) black-3-active 배경
          </li>
          <li>
            <code>outline</code>: (기본) gray-1, 1px 라인 + white-3 배경 + black-4 글자 / (호버일때)
            yellow-1 배경 + white-3 글자 / (활성화일때) yellow-1, 1.5px 라인 + white-3 배경 +
            black-4 글자
          </li>
          <li>
            <code>ghost</code>: (기본) gray-2 배경 + white-3 글자/ (호버일때) gray-2-hover 배경 /
            (활성화일때) gray-2-active 배경
          </li>
          <li>
            <code>danger</code>: (기본) red-1 배경 + white-3 글자 /(호버일때)red-1-hover 배경 /
            (활성화일때) red-1-active 배경
          </li>
        </ul>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button>기본 버튼</Button>
        <Button variant="primary">Primary 버튼</Button>
        <Button variant="secondary">Secondary 버튼</Button>
        <Button variant="outline">Outline 버튼</Button>
        <Button variant="ghost">Ghost 버튼</Button>
        <Button variant="danger">Danger 버튼</Button>
      </div>

      <br />
      <h2 className={styles.subtitle}>버튼 크기별 radius</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Small 크기들 */}
        <h3 className={styles.h3title}>Small B</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="primary" size="sm" radius="none">
            Small None
          </Button>
          <Button variant="primary" size="sm" radius="xxsm">
            Small XXSM
          </Button>
          <Button variant="primary" size="sm" radius="xsm">
            Small XSM
          </Button>
          <Button variant="primary" size="sm" radius="sm">
            Small SM
          </Button>
          <Button variant="primary" size="sm" radius="md">
            Small MD
          </Button>
          <Button variant="primary" size="sm" radius="full">
            Small Full
          </Button>
        </div>

        {/* Medium 크기들 */}
        <h3 className={styles.h3title}>Medium B</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="outline" size="md" radius="none">
            Medium None
          </Button>
          <Button variant="outline" size="md" radius="xxsm">
            Medium XXSM
          </Button>
          <Button variant="outline" size="md" radius="xsm">
            Medium XSM
          </Button>
          <Button variant="outline" size="md" radius="sm">
            Medium SM
          </Button>
          <Button variant="outline" size="md" radius="md">
            Medium MD
          </Button>
          <Button variant="outline" size="md" radius="full">
            Medium Full
          </Button>
        </div>

        {/* Large 크기들 */}
        <h3 className={styles.h3title}>Large B</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="secondary" size="lg" radius="none">
            Large None
          </Button>
          <Button variant="secondary" size="lg" radius="xxsm">
            Large XXSM
          </Button>
          <Button variant="secondary" size="lg" radius="xsm">
            Large XSM
          </Button>
          <Button variant="secondary" size="lg" radius="sm">
            Large SM
          </Button>
          <Button variant="secondary" size="lg" radius="md">
            Large MD
          </Button>
          <Button variant="secondary" size="lg" radius="full">
            Large Full
          </Button>
        </div>
      </div>

      <br />
      <h2 className={styles.subtitle}>버튼 폰트 크기 및 굵기</h2>
      <div className={styles.guideBox}>
        <p className={styles.guideTitle}>
          <strong>텍스트 스타일 커스터마이징</strong>
        </p>
        <ul className={styles.unorderedList}>
          <li>
            <code>fontSizePreset</code>: 디자인 시스템 정의된 크기 사용 (권장)
          </li>
          <li>
            <code>fontSize</code>: 직접 크기 지정 (px, rem 등)
          </li>
          <li>
            <code>fontWeightPreset</code>: 일관된 폰트 굵기 적용
          </li>
          <li>프리셋 사용 시 디자인 일관성 유지가 되지만,, 맞는게 없다면 새로 추가 가넝</li>
        </ul>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 폰트 크기 변화 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="primary" fontSizePreset="xxxsmall">
            12px 텍스트
          </Button>
          <Button variant="primary" fontSizePreset="xxsmall">
            14px 텍스트
          </Button>
          <Button variant="primary" fontSizePreset="xsmall">
            16px 텍스트
          </Button>
          <Button variant="primary" fontSizePreset="small">
            20px 텍스트
          </Button>
          <Button variant="primary" fontSizePreset="medium">
            24px 텍스트
          </Button>
          <Button variant="primary" fontSizePreset="large">
            28px 텍스트
          </Button>
        </div>

        {/* 폰트 굵기 변화 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="outline" fontWeightPreset="regular">
            Regular (400)
          </Button>
          <Button variant="outline" fontWeightPreset="medium">
            Medium (500)
          </Button>
          <Button variant="outline" fontWeightPreset="semibold">
            Semibold (600)
          </Button>
          <Button variant="outline" fontWeightPreset="bold">
            Bold (700)
          </Button>
        </div>

        <br />
        <h2 className={styles.subtitle}>버튼 조합 예시</h2>
        {/* 조합 예시 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="danger" fontSizePreset="large" fontWeightPreset="bold">
            큰 굵은 글씨
          </Button>
          <Button variant="ghost" fontSizePreset="xxxsmall" fontWeightPreset="regular">
            작은 얇은 글씨
          </Button>
        </div>
      </div>

      <br />
      <h2 className={styles.subtitle}>버튼 로딩 및 비활성화</h2>
      <div className={styles.guideBox}>
        <p className={styles.guideTitle}>
          <strong>상태별 버튼 처리</strong>
        </p>
        <ul className={styles.unorderedList}>
          <li>
            <code>isLoading</code>: 비동기 작업 진행 중 (클릭 방지)
          </li>
          <li>
            <code>disabled</code>: 조건 미충족 시 버튼 비활성화
          </li>
          <li>로딩 중에는 텍스트를 "처리 중..." 등으로 변경 권장</li>
          <li>두 상태 모두 사용자 액션을 차단함</li>
        </ul>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 로딩 상태 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="primary" isLoading>
            저장 중...
          </Button>
          <Button variant="outline" isLoading>
            업로드 중...
          </Button>
          <Button variant="danger" isLoading>
            삭제 중...
          </Button>
        </div>

        {/* 비활성화 상태 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button variant="primary" disabled>
            비활성화됨
          </Button>
          <Button variant="outline" disabled>
            클릭 불가
          </Button>
          <Button variant="danger" disabled>
            삭제 불가
          </Button>
        </div>
      </div>

      <br />
      <h2 className={styles.subtitle}>버튼 전체 너비</h2>
      <div className={styles.guideBox}>
        <p className={styles.guideTitle}>
          <strong>레이아웃에 따른 너비 설정</strong>
        </p>
        <ul className={styles.unorderedList}>
          <li>
            <code>fullWidth</code>: 부모 컨테이너 전체 너비 사용
          </li>
          <li>폼 하단의 제출 버튼에 주로 사용</li>
        </ul>
      </div>
      {/* 전체 너비 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Button variant="primary" fullWidth>
          전체 너비 버튼
        </Button>
        <Button variant="outline" fullWidth>
          Full Width Button
        </Button>
      </div>

      <br />
      <h2 className={styles.subtitle}>조건부 버튼 색상 변경 예시</h2>
      <div className={styles.guideBox}>
        <p className={styles.guideTitle}>
          <strong>실제 프로젝트에서의 동적 버튼 활용</strong>
        </p>
        <ul className={styles.unorderedList}>
          <li>
            상태에 따라 variant를 동적으로 변경하여 사용 가능(한지 사실 내가 테스트 한 용도 ㅎ)
          </li>
          <li>권한이나 조건에 따라 버튼의 역할과 스타일을 구분</li>
          <li>복잡한 조건 조합으로 세밀한 UX 제어 가넝</li>
        </ul>
      </div>

      {/* 예시 1: 토글 상태에 따른 variant 변경 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 className={styles.h3title}>1. 토글 상태에 따른 변경</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              variant={isToggled ? 'secondary' : 'ghost'}
              onClick={() => setIsToggled(!isToggled)}
            >
              {isToggled ? '활성화됨' : '비활성화됨'}
            </Button>
            <span>현재 상태: {isToggled ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        {/* 예시 2: 여러 상태에 따른 variant 변경 */}
        <div>
          <h3 className={styles.h3title}>2. 처리 상태에 따른 변경</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button variant={getStatusButtonVariant()} onClick={handleStatusChange}>
              {status === 'idle' && '시작하기'}
              {status === 'loading' && '처리 중...'}
              {status === 'success' && '완료!'}
              {status === 'error' && '오류 발생'}
            </Button>
            <span>현재 상태: {status}</span>
          </div>
        </div>

        {/* 예시 3: 사용자 권한에 따른 variant 변경 */}
        <div>
          <h3 className={styles.h3title}>3. 사용자 권한에 따른 변경</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              variant={userRole === 'my' ? 'danger' : 'outline'}
              onClick={() => setUserRole(userRole === 'my' ? 'user' : 'my')}
            >
              {userRole === 'my' ? '자기 프로필' : '유저 프로필'}
            </Button>
            <span>현재 권한: {userRole}</span>
          </div>
        </div>

        {/* 예시 4: 복합 조건 */}
        <div>
          <h3 className={styles.h3title}>4. 복합 조건에 따른 변경</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              variant={
                isActive && userRole === 'my'
                  ? 'secondary'
                  : isActive
                    ? 'primary'
                    : userRole === 'my'
                      ? 'outline'
                      : 'ghost'
              }
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? '활성' : '비활성'} + {userRole}
            </Button>
            <span>
              활성: {isActive ? 'YES' : 'NO'}, 권한: {userRole}
            </span>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default ButtonExamplePage;
