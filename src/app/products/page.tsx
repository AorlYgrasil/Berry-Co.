"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/searchbar";
import ItemCard from "@/components/item-card";
import FilterDropdown from "@/components/filter-dropdown";
import PriceRangeSlider from "@/components/price-range-slider";

const seriesOptions = ["Everyday", "Bestsellers", "Collector"];
const availableTags = ["New", "Limited", "Popular", "Featured", "Exclusive"];
const brandOptions = ["Deckdrop", "Studio", "Guest"];

const dummyProducts = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  company: "Company Name",
  name: "Item Name",
  desc: "Short Description",
  price: "₱120",
  tags: ["New", "Limited"],
}));

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [seriesSearch, setSeriesSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceValue, setPriceValue] = useState(250);

  const filteredProducts = useMemo(() => {
    const min = Number(minPrice) || 0;
    const max = maxPrice === "" ? Infinity : Number(maxPrice) || Infinity;
    const queryLower = query.trim().toLowerCase();
    const selectedTagSet = new Set(selectedTags.map((tag) => tag.toLowerCase()));

    return dummyProducts.filter((item) => {
      const label = `${item.company} ${item.name} ${item.desc}`.toLowerCase();
      const matchesQuery = queryLower === "" || label.includes(queryLower);
      const matchesSeries =
        selectedSeries.length === 0 ||
        selectedSeries.some((series) => item.name.toLowerCase().includes(series.toLowerCase()));
      const matchesTags =
        selectedTags.length === 0 || item.tags.some((tag) => selectedTagSet.has(tag.toLowerCase()));
      const matchesBrand =
        selectedBrand.length === 0 ||
        selectedBrand.some((brand) => item.company.toLowerCase().includes(brand.toLowerCase()));
      const price = Number(item.price.toString().replace(/[^0-9.]/g, "")) || 0;
      const matchesPrice = price >= min && price <= max;

      return matchesQuery && matchesSeries && matchesTags && matchesBrand && matchesPrice;
    });
  }, [query, selectedSeries, selectedTags, selectedBrand, minPrice, maxPrice]);

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((current) => [...current, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags((current) => current.filter((value) => value !== tag));
  };

  const removeSeries = (series: string) => {
    setSelectedSeries((current) => current.filter((value) => value !== series));
  };

  const removeBrand = (brand: string) => {
    setSelectedBrand((current) => current.filter((value) => value !== brand));
  };

  const resetFilters = () => {
    setQuery("");
    setSeriesSearch("");
    setTagSearch("");
    setBrandSearch("");
    setSelectedSeries([]);
    setSelectedBrand([]);
    setSelectedTags([]);
  };

  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="w-full max-w-md">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <section className="content-panel">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedSeries.map((series) => (
                    <button
                      key={series}
                      type="button"
                      onClick={() => removeSeries(series)}
                      className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-xs font-bold text-dark"
                    >
                      {series}
                      <span className="text-brand">×</span>
                    </button>
                  ))}

                  {selectedBrand.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => removeBrand(brand)}
                      className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-xs font-bold text-dark"
                    >
                      {brand}
                      <span className="text-brand">×</span>
                    </button>
                  ))}

                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1 text-xs font-bold text-dark"
                    >
                      {tag}
                      <span className="text-brand">×</span>
                    </button>
                  ))}

                  {selectedSeries.length === 0 &&
                    selectedBrand.length === 0 &&
                    selectedTags.length === 0 && (
                      <span className="text-sm font-semibold text-dark/70">
                        No filters selected
                      </span>
                    )}
                </div>

                <h1 className="text-2xl font-black text-dark">
                  Results for: {query || "All products"}
                </h1>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-dark/10 bg-cream px-4 py-2 text-sm font-semibold text-brand"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((item) => (
                <ItemCard
                  key={item.id}
                  item={{
                    id: item.id,
                    company: item.company,
                    name: item.name,
                    description: item.desc,
                    price: item.price,
                  }}
                />
              ))}
            </div>
          </section>

          <aside className="sidebar-panel">
            <h2 className="mb-6 text-center text-base font-extrabold text-dark leading-tight">
              Set Search Filters and Tags
            </h2>

            <div className="space-y-4">
              <FilterDropdown
                label="Series"
                options={seriesOptions}
                searchValue={seriesSearch}
                selectedValues={selectedSeries}
                onSearchChange={setSeriesSearch}
                onSelectChange={setSelectedSeries}
              />

              {/* Tags Filter */}
              <div className="rounded-2xl border border-dark/10 bg-cream p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-dark/80">
                    Tags
                  </p>
                  <span className="text-[11px] text-dark/70">
                    {selectedTags.length} selected
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
                    value={tagSearch}
                    onChange={(event) => setTagSearch(event.target.value)}
                    placeholder="Search tags"
                    className="w-full bg-transparent text-xs text-dark outline-none"
                  />
                </div>

                <select
                  value=""
                  onChange={(event) => {
                    if (event.target.value) {
                      addTag(event.target.value);
                      setTagSearch("");
                    }
                  }}
                  className="mt-3 w-full rounded-full border border-dark/40 bg-white px-3 py-2 text-sm font-semibold text-dark outline-none"
                >
                  <option value="">Add a tag</option>
                  {availableTags
                    .filter(
                      (tag) =>
                        !selectedTags.includes(tag) &&
                        tag.toLowerCase().includes(tagSearch.toLowerCase())
                    )
                    .map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                </select>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white"
                    >
                      {tag}
                      <span className="text-white">×</span>
                    </button>
                  ))}
                </div>
              </div>

              <FilterDropdown
                label="Brand"
                options={brandOptions}
                searchValue={brandSearch}
                selectedValues={selectedBrand}
                onSearchChange={setBrandSearch}
                onSelectChange={setSelectedBrand}
              />

              <div className="space-y-2 text-xs font-semibold text-dark">
                <p className="text-right font-bold">Availability</p>
                <div className="flex flex-wrap justify-end gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm text-dark">
                    <input
                      type="checkbox"
                      className="rounded border-dark text-brand focus:ring-0"
                    />
                    In-Stock
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm text-dark">
                    <input
                      type="checkbox"
                      className="rounded border-dark text-brand focus:ring-0"
                    />
                    Pre-Order
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm text-dark">
                    <input
                      type="checkbox"
                      className="rounded border-dark text-brand focus:ring-0"
                    />
                    On Sale
                  </label>
                </div>
              </div>

              <PriceRangeSlider
                minValue={minPrice}
                maxValue={maxPrice}
                sliderValue={priceValue}
                onMinChange={setMinPrice}
                onMaxChange={setMaxPrice}
                onSliderChange={setPriceValue}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}