// components/LoadingSkeleton.jsx - Loading skeleton component
import React from 'react';

/**
 * Loading skeleton cho table rows
 * Hiển thị khi đang load dữ liệu
 */
const LoadingSkeleton = ({ count = 10 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
        >
          {/* ID skeleton */}
          <div className="w-24 h-4 skeleton rounded"></div>
          
          {/* Name skeleton */}
          <div className="flex-1 h-4 skeleton rounded"></div>
          
          {/* Price skeleton */}
          <div className="w-20 h-4 skeleton rounded"></div>
          
          {/* Category skeleton */}
          <div className="w-24 h-4 skeleton rounded"></div>
          
          {/* Date skeleton */}
          <div className="w-32 h-4 skeleton rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(LoadingSkeleton);
