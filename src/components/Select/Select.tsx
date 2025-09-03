import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CaretUpIcon } from '@phosphor-icons/react';

import styles from './Select.module.scss';

type CSSVariables = React.CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

export type SelectOption<V = string> = {
  label: string;
  value: V;
  disabled?: boolean;
};

export interface SelectProps<V = string> {
  options: SelectOption<V>[];
  value?: V | null;
  onChange?: (value: V | null, option: SelectOption<V> | null) => void;

  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;

  width?: number | string;
  height?: number | string;
  dropdownMaxHeight?: number | string;

  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  noOptionsText?: string;
}

// px 단위 변환 유틸
const toCssSize = (v?: number | string, fallback?: string) => {
  if (v === undefined || v === null) return fallback;
  return typeof v === 'number' ? `${v}px` : v;
};

const Select = <V,>({
  options,
  value = null,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  searchable = false,
  clearable = false,

  width,
  height,
  dropdownMaxHeight = 260,

  fullWidth = false,
  className,
  name,
  id,
  noOptionsText = '옵션이 없습니다',
}: SelectProps<V>) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const selectedOption = useMemo(
    () => options.find(o => o.value === value) ?? null,
    [options, value]
  );

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, searchable, query]);

  const announceChange = useCallback(
    (opt: SelectOption<V> | null) => {
      onChange?.(opt ? opt.value : null, opt);
    },
    [onChange]
  );

  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
  }, []);

  const toggleMenu = useCallback(() => {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [open, openMenu, closeMenu]);

  const handleSelect = useCallback(
    (opt: SelectOption<V>) => {
      if (opt.disabled) return;
      announceChange(opt);
      closeMenu();
    },
    [announceChange, closeMenu]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      announceChange(null);
    },
    [announceChange]
  );

  // 외부 클릭 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) closeMenu();
    };
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, closeMenu]);

  // 키보드 이벤트
  useEffect(() => {
    if (!open) return;
    const items = filtered.filter(o => !o.disabled);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        closeMenu();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(items.length, 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = items[activeIndex < 0 ? 0 : activeIndex];
        if (target) handleSelect(target);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, filtered, activeIndex, handleSelect, closeMenu]);

  // 활성화된 항목 가시성
  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(`li[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const cssVars: CSSVariables = {
    '--select-width': fullWidth ? '100%' : toCssSize(width, 'auto'),
    '--trigger-height': toCssSize(height, '44px'),
    '--dropdown-max-height': toCssSize(dropdownMaxHeight, '260px'),
  };

  return (
    <div
      ref={containerRef}
      className={[
        styles.select,
        fullWidth ? styles.fullWidth : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ].join(' ')}
      style={cssVars}
    >
      {name && <input type="hidden" name={name} value={value === null ? '' : String(value)} />}

      <button
        id={id}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id ? `${id}-listbox` : undefined}
        onClick={toggleMenu}
        disabled={disabled}
      >
        <span className={selectedOption ? styles.value : styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={styles.actions}>
          {clearable && selectedOption && !disabled && (
            <span
              role="button"
              aria-label="선택 해제"
              className={styles.clear}
              onClick={handleClear}
            >
              ×
            </span>
          )}
          <span
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          >
            <CaretUpIcon className={styles.selectArrow} />
          </span>
        </div>
      </button>

      {open && (
        <div className={styles.dropdown} role="dialog" aria-modal="false">
          {searchable && (
            <div className={styles.searchBox}>
              <input
                className={styles.searchInput}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="검색…"
                autoFocus
              />
            </div>
          )}

          <ul
            ref={listRef}
            className={styles.optionList}
            role="listbox"
            id={id ? `${id}-listbox` : undefined}
            aria-activedescendant={
              activeIndex >= 0 ? `${id ?? 'select'}-option-${activeIndex}` : undefined
            }
          >
            {filtered.length === 0 && (
              <li className={styles.noOptions} aria-disabled>
                {noOptionsText}
              </li>
            )}

            {filtered.map((opt, i) => {
              const isSelected = selectedOption?.value === opt.value;
              const isDisabled = !!opt.disabled;
              const isActive = i === activeIndex;

              return (
                <li
                  key={String(opt.value)}
                  id={`${id ?? 'select'}-option-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                  className={[
                    styles.option,
                    isSelected ? styles.selected : '',
                    isDisabled ? styles.optDisabled : '',
                    isActive ? styles.active : '',
                  ].join(' ')}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => !isDisabled && handleSelect(opt)}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
