import React from "react";

interface Props {
  value: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

const ProgressBar: React.FC<Props> = ({ value, color = "var(--tf-primary)", height, showLabel }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="tf-progress flex-grow-1" style={height ? { height } : undefined}>
        <div className="tf-progress-bar" style={{ width: `${clamped}%`, background: color }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--tf-text-muted)", minWidth: 34, textAlign: "right" }}>
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
