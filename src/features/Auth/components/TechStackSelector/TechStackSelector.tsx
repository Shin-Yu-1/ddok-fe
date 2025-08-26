import Button from '@/components/Button/Button';
import { TECH_STACKS } from '@/constants/techStacks';

import styles from './TechStackSelector.module.scss';

interface TechStackSelectorProps {
  selectedTechStack: number[];
  techSearch: string;
  onTechSearchChange: (value: string) => void;
  onTechStackToggle: (techId: number) => void;
}

const TechStackSelector = ({
  selectedTechStack,
  techSearch,
  onTechSearchChange,
  onTechStackToggle,
}: TechStackSelectorProps) => {
  // 검색된 기술 스택 필터링
  const filteredTechStacks = techSearch.trim()
    ? TECH_STACKS.filter(tech => tech.name.toLowerCase().includes(techSearch.toLowerCase()))
    : [];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 기술 스택을 선택해주세요</h2>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="기술 검색하기"
          value={techSearch}
          onChange={e => onTechSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.techStackContainer}>
        {filteredTechStacks.map(tech => (
          <Button
            key={tech.id}
            variant={selectedTechStack.includes(tech.id) ? 'primary' : 'outline'}
            radius="sm"
            size="sm"
            onClick={() => onTechStackToggle(tech.id)}
            className={styles.techButton}
          >
            {tech.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TechStackSelector;
