import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: string) => void;
  placeholder?: string;
  className?: string;
}

const AddressSearchInput = ({
  value,
  onChange,
  onSelect,
  placeholder = '주소 검색하기',
  className,
}: AddressSearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    if (onSelect) {
      onSelect(inputValue);
    }
  };

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        width="100%"
        height="40px"
        fontSize="var(--fs-xxsmall)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        iconSize={24}
        rightIcon={<MagnifyingGlassIcon width={24} height={24} color="var(--black-1)" />}
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default AddressSearchInput;
