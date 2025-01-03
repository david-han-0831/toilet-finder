'use client'

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {label}
    </button>
  );
} 