// components/SearchBar.jsx - Search và Filter component
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * Search bar component với debounce
 *
 * @param {function} onSearch - Callback khi search
 * @param {number} totalCount - Tổng số items
 * @param {number} filteredCount - Số items sau khi filter
 */
const SearchBar = ({ onSearch, totalCount, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      // Debounce search - chờ 300ms sau khi user ngừng gõ
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }

      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, 300);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onSearch("");
  }, [onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm theo mã đơn, mã tracking, tên, số điện thoại, địa chỉ..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {filteredCount.toLocaleString()}
            </span>
            <span>đơn hàng</span>
          </div>

          {filteredCount !== totalCount && (
            <div className="flex items-center gap-2">
              <span>trong</span>
              <span className="font-semibold text-gray-900">
                {totalCount.toLocaleString()}
              </span>
              <span>tổng</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Tips */}
      {searchTerm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 text-sm text-gray-500"
        >
          💡 Mẹo: Tìm kiếm không phân biệt chữ hoa/thường và tìm trên tất cả các
          trường
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(SearchBar);
