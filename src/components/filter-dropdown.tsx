"use client";

type FilterDropdownProps = {
  label: string;
  options: string[];
  searchValue: string;
  selectedValues: string[];
  onSearchChange: (value: string) => void;
  onSelectChange: (values: string[]) => void;
};

export default function FilterDropdown({
  label,
  options,
  searchValue,
  selectedValues,
  onSearchChange,
  onSelectChange,
}: FilterDropdownProps) {
  const visibleOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAdd = (value: string) => {
    if (value && !selectedValues.includes(value)) {
      onSelectChange([...selectedValues, value]);
      onSearchChange("");
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onSelectChange(selectedValues.filter((item) => item !== valueToRemove));
  };

  return (
    <div className="space-y-3 rounded-2xl border border-dark/10 bg-cream p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-dark/80">
          {label}
        </p>
        <span className="text-[11px] text-dark/70">
          {selectedValues.length} selected
        </span>
      </div>


      <div className="flex items-center gap-2 rounded-full border border-dark/40 bg-white px-3 py-2">
        <svg
          className="h-3.5 w-3.5 text-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${label}`}
          className="w-full bg-transparent text-xs text-dark outline-none"
        />
      </div>

      <select
        value=""
        onChange={(e) => handleAdd(e.target.value)}
        className="w-full rounded-full border border-dark/40 bg-white px-3 py-2 text-sm font-semibold text-dark outline-none"
      >
        <option value="">{`Add ${label}`}</option>
        {visibleOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRemove(value)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              {value}
              <span>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}