import { useState } from 'react';

import Button from '@/components/Button/Button';
import TechStackSearchInput from '@/components/TechStackSearchInput/TechStackSearchInput';
import { TECH_STACKS } from '@/constants/techStacks';

import styles from './TechStackSelector.module.scss';

interface TechStackSelectorProps {
  selectedTechStack: number[];
  onTechStackToggle: (techId: number) => void;
}

const TechStackSelector = ({ selectedTechStack, onTechStackToggle }: TechStackSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 선택된 기술 스택들 가져오기
  const selectedTechStacks = TECH_STACKS.filter(tech => selectedTechStack.includes(tech.id));

  // 검색된 기술 스택 필터링 (선택되지 않은 것들만)
  const searchedTechStacks = searchTerm.trim()
    ? TECH_STACKS.filter(tech => {
        const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase());
        const notSelected = !selectedTechStack.includes(tech.id);
        return matchesSearch && notSelected;
      })
    : [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleTechStackSelect = (techId: number) => {
    onTechStackToggle(techId);
  };

  const handleTechStackRemove = (techId: number) => {
    onTechStackToggle(techId);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 기술 스택을 선택해주세요</h2>
      <TechStackSearchInput onSearch={handleSearch} placeholder="기술 검색하기" />

      {/* 검색어가 있을 때만 검색 결과 표시 */}
      {searchTerm.trim() && (
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
                  onClick={() => handleTechStackSelect(tech.id)}
                  onKeyDown={handleButtonKeyDown}
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
      )}

      {/* 선택된 기술 스택들 */}
      {selectedTechStacks.length > 0 && (
        <div className={styles.selectedSection}>
          <p className={styles.sectionSubtitle}>선택된 기술 스택</p>
          <div className={styles.techStackContainer}>
            {selectedTechStacks.map(tech => (
              <Button
                key={`selected-${tech.id}`}
                variant="primary"
                radius="xxsm"
                size="sm"
                onClick={() => handleTechStackRemove(tech.id)}
                className={`${styles.techButton}`}
              >
                <span className={styles.techName}>{tech.name}</span>
                <span className={styles.icon}>✕</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackSelector;
