import React from "react";
import { FiSearch } from "react-icons/fi";

interface SelectOption { value: string; label: string; }

interface Props {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  selects?: Array<{ value: string; onChange: (v: string) => void; options: SelectOption[] }>;
  rightSlot?: React.ReactNode;
}

const FilterBar: React.FC<Props> = ({ searchValue, onSearchChange, searchPlaceholder = "Search...", selects = [], rightSlot }) => (
  <div className="tf-card p-3 mb-3">
    <div className="row g-2 align-items-center">
      <div className="col-12 col-md">
        <div className="position-relative">
          <FiSearch className="position-absolute" style={{ left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tf-text-faint)" }} />
          <input
            className="form-control ps-5"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={searchPlaceholder}
          />
        </div>
      </div>
      {selects.map((s, i) => (
        <div className="col-6 col-md-auto" key={i}>
          <select className="form-select" value={s.value} onChange={(e) => s.onChange(e.target.value)}>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      ))}
      {rightSlot && <div className="col-12 col-md-auto ms-md-auto d-flex gap-2 justify-content-end">{rightSlot}</div>}
    </div>
  </div>
);

export default FilterBar;
