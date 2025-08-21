import Button from '@/components/Button/Button';

import styles from './ButtonExamplePage.module.scss';

const ButtonExamplePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ButtonExamplePage</h1>

      <h2 className={styles.subtitle}>버튼 색</h2>
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
    </div>
  );
};

export default ButtonExamplePage;
