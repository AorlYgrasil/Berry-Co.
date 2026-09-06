"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  value?: string;
  onChange?: (val: string) => void;
};

export default function SearchBar({ value: externalValue, onChange }: SearchBarProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState("");

  const isControlled = onChange !== undefined;
  const currentValue = isControlled ? (externalValue ?? "") : internalValue;

  const handleChange = (val: string) => {
    if (isControlled) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = currentValue.trim();

    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto my-4 px-4">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Looking for something?"
          className="w-full rounded-full border border-dark/40 bg-cream py-2.5 pl-10 pr-10 text-xs font-semibold text-dark placeholder:text-dark/50 shadow-sm outline-none focus:border-dark"
        />
        <button type="submit" className="hidden">
          Search
        </button>
        <svg
          className="absolute left-3.5 h-4 w-4 text-dark/60 pointer-events-none"
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
      </div>
    </form>
  );
}