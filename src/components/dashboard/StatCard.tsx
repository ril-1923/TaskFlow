import React from "react";
import type { IconType } from "react-icons";

interface Props {
  icon: IconType;
  label: string;
  value: number | string;
  color: string;
  softColor: string;
}

const StatCard: React.FC<Props> = ({ icon: Icon, label, value, color, softColor }) => (
  <div className="tf-stat-card">
    <div className="tf-stat-icon" style={{ background: softColor, color }}>
      <Icon />
    </div>
    <div>
      <div className="tf-stat-value">{value}</div>
      <div className="tf-stat-label">{label}</div>
    </div>
  </div>
);

export default StatCard;
