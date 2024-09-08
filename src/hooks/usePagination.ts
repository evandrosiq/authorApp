import { useState } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

interface UsePaginationReturn<T> {
  currentPageData: T[];
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

export function usePagination<T>({ data, itemsPerPage }: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const currentPageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPageData,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage
  };
}
