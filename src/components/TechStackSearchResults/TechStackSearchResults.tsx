import Button from '@/components/Button/Button';
import { TECH_STACKS } from '@/constants/techStacks';

import styles from './TechStackSearchResults.module.scss';

interface TechStackSearchResultsProps {
  searchTerm: string;
  selectedTechStack: number[];
  onTechStackSelect: (techId: number) => void;
  onButtonKeyDown: (e: React.KeyboardEvent) => void;
}

const TechStackSearchResults = ({
  searchTerm,
  selectedTechStack,
  onTechStackSelect,
  onButtonKeyDown,
}: TechStackSearchResultsProps) => {
  // 검색된 기술 스택 필터링 (선택되지 않은 것들만)
  const searchedTechStacks = searchTerm.trim()
    ? TECH_STACKS.filter(tech => {
        const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase());
        const notSelected = !selectedTechStack.includes(tech.id);
        return matchesSearch && notSelected;
      })
    : [];

  if (!searchTerm.trim()) {
    return null;
  }

  return (
    <div className={styles.searchSection}>
      <p className={styles.sectionSubtitle}>'{searchTerm}' 검색 결과</p>
      {searchedTechStacks.length > 0 ? (
        <div className={styles.techStackContainer}>
          {searchedTechStacks.map(tech => (
            <Button
              key={`search-${tech.id}`}
              variant="primary"
              radius="xxsm"
              size="sm"
              onClick={() => onTechStackSelect(tech.id)}
              onKeyDown={onButtonKeyDown}
              className={`${styles.techButton}`}
            >
              <span className={styles.techName}>{tech.name}</span>
              <span className={styles.icon}>+</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TechStackSearchResults;
