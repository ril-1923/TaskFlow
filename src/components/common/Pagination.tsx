import React from "react";
import { Pagination as BsPagination } from "react-bootstrap";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <BsPagination className="mb-0 justify-content-center justify-content-md-end">
      <BsPagination.Prev disabled={page === 1} onClick={() => onChange(page - 1)} />
      {Array.from({ length: totalPages }).map((_, i) => (
        <BsPagination.Item key={i} active={i + 1 === page} onClick={() => onChange(i + 1)}>
          {i + 1}
        </BsPagination.Item>
      ))}
      <BsPagination.Next disabled={page === totalPages} onClick={() => onChange(page + 1)} />
    </BsPagination>
  );
};

export default Pagination;
