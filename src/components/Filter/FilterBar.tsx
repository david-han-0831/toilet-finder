'use client'

import FilterButton from './FilterButton';
import type { FilterOptions } from '@/types/filter';

interface FilterBarProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const handleFilterChange = (key: keyof FilterOptions) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <div className="flex gap-2 mt-3 pb-2 overflow-x-auto scrollbar-hide">
      <FilterButton
        label="전체"
        isActive={!filters.isFree && !filters.isAccessible && !filters.is24Hours}
        onClick={() => onChange({ isFree: false, isAccessible: false, is24Hours: false })}
      />
      <FilterButton
        label="무료"
        isActive={filters.isFree}
        onClick={() => handleFilterChange('isFree')}
      />
      <FilterButton
        label="장애인 접근 가능"
        isActive={filters.isAccessible}
        onClick={() => handleFilterChange('isAccessible')}
      />
      <FilterButton
        label="24시간 개방"
        isActive={filters.is24Hours}
        onClick={() => handleFilterChange('is24Hours')}
      />
    </div>
  );
} 