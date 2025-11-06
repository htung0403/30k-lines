// components/ProductList.jsx - Virtualized product list component
import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

/**
 * ProductRow component - Memoized để tránh re-render
 * Hiển thị đầy đủ thông tin đơn hàng từ Firebase
 */
const ProductRow = React.memo(({ product, style, index }) => {
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div
      style={style}
      className={`
        flex items-center px-4 py-3 border-b border-gray-200 
        hover:bg-blue-50 transition-colors duration-150 text-xs
        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
      `}
    >
      {/* Mã đơn hàng */}
      <div
        className="w-32 font-mono text-blue-600 font-semibold truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Mã đơn hàng"] || "N/A"}
      >
        {product["Mã đơn hàng"] || "N/A"}
      </div>

      {/* Mã Tracking */}
      <div
        className="w-44 font-mono text-gray-700 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Mã Tracking"] || "N/A"}
      >
        {product["Mã Tracking"] || "N/A"}
      </div>

      {/* Ngày lên đơn */}
      <div
        className="w-28 text-gray-600 px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={formatDate(product["Ngày lên đơn"])}
      >
        {formatDate(product["Ngày lên đơn"])}
      </div>

      {/* Name */}
      <div
        className="w-40 font-medium text-gray-900 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Name*"] || "N/A"}
      >
        {product["Name*"] || "N/A"}
      </div>

      {/* Phone */}
      <div
        className="w-32 text-gray-700 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Phone*"] || "N/A"}
      >
        {product["Phone*"] || "N/A"}
      </div>

      {/* Address */}
      <div
        className="w-40 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Add"] || "N/A"}
      >
        {product["Add"] || "N/A"}
      </div>

      {/* City */}
      <div
        className="w-32 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["City"] || "N/A"}
      >
        {product["City"] || "N/A"}
      </div>

      {/* State */}
      <div
        className="w-16 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["State"]?.toUpperCase() || "N/A"}
      >
        {product["State"]?.toUpperCase() || "N/A"}
      </div>

      {/* Zipcode */}
      <div
        className="w-20 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Zipcode"] || "N/A"}
      >
        {product["Zipcode"] || "N/A"}
      </div>

      {/* Mặt hàng */}
      <div
        className="w-40 text-gray-700 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Mặt hàng"] || "N/A"}
      >
        {product["Mặt hàng"] || "N/A"}
      </div>

      {/* Giá bán */}
      <div
        className="w-24 text-green-600 font-semibold px-2 text-right"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={`$${formatPrice(product["Giá bán"])}`}
      >
        ${formatPrice(product["Giá bán"])}
      </div>

      {/* Trạng thái giao hàng */}
      <div
        className="w-32 px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Trạng thái giao hàng"] || "N/A"}
      >
        <span
          className={`
          inline-flex px-2 py-0.5 rounded text-xs font-medium
          ${
            product["Trạng thái giao hàng"] === "ĐÃ GIAO"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        `}
        >
          {product["Trạng thái giao hàng"] || "N/A"}
        </span>
      </div>

      {/* Hình thức thanh toán */}
      <div
        className="w-28 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Hình thức thanh toán"] || "N/A"}
      >
        {product["Hình thức thanh toán"] || "N/A"}
      </div>

      {/* Team */}
      <div
        className="w-24 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Team"] || "N/A"}
      >
        {product["Team"] || "N/A"}
      </div>

      {/* NV Sale */}
      <div
        className="w-36 text-gray-600 truncate px-2"
        data-tooltip-id="cell-tooltip"
        data-tooltip-content={product["Nhân viên Sale"] || "N/A"}
      >
        {product["Nhân viên Sale"] || "N/A"}
      </div>
    </div>
  );
});

ProductRow.displayName = "ProductRow";

/**
 * VirtualizedProductList component
 * Sử dụng @tanstack/react-virtual để render hiệu quả 30k+ items
 *
 * CÁCH HOẠT ĐỘNG:
 * - Chỉ render các items visible trong viewport
 * - Tính toán và render buffer items ở trên/dưới để scroll mượt
 * - Tự động tính toán height và position của mỗi item
 * - Hỗ trợ dynamic height nếu cần
 *
 * @param {Array} products - Danh sách products
 * @param {boolean} loading - Loading state
 * @param {boolean} hasMore - Còn data để load
 * @param {function} onLoadMore - Callback để load more
 */
const ProductList = ({ products, loading, hasMore, onLoadMore }) => {
  const parentRef = useRef(null);

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Estimated row height in pixels (smaller for compact view)
    overscan: 15, // Number of items to render outside viewport
  });

  // Handle scroll to bottom - load more
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Khi scroll > 80% và còn data thì load more
    if (scrollPercentage > 0.8 && hasMore && !loading) {
      onLoadMore();
    }
  };

  if (products.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white rounded-lg shadow-md"
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không tìm thấy đơn hàng
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Thử điều chỉnh tìm kiếm hoặc load thêm dữ liệu.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center px-4 py-3 bg-gray-100 border-b border-gray-300 font-semibold text-xs text-gray-700">
        <div className="w-32">Mã đơn hàng</div>
        <div className="w-44 px-2">Mã Tracking</div>
        <div className="w-28 px-2">Ngày lên đơn</div>
        <div className="w-40 px-2">Name*</div>
        <div className="w-32 px-2">Phone*</div>
        <div className="w-40 px-2">Address</div>
        <div className="w-32 px-2">City</div>
        <div className="w-16 px-2">State</div>
        <div className="w-20 px-2">Zipcode</div>
        <div className="w-40 px-2">Mặt hàng</div>
        <div className="w-24 px-2 text-right">Giá bán</div>
        <div className="w-32 px-2">Trạng thái GH</div>
        <div className="w-28 px-2">Thanh toán</div>
        <div className="w-24 px-2">Team</div>
        <div className="w-36 px-2">NV Sale</div>
      </div>

      {/* Virtualized List */}
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="scrollbar-thin overflow-auto"
        style={{ height: "700px", overflowX: "auto" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const product = products[virtualRow.index];

            return (
              <ProductRow
                key={product.key || product.id || virtualRow.index}
                product={product}
                index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>

        {/* Loading indicator at bottom */}
        {loading && (
          <div className="flex justify-center items-center py-4 bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-gray-600">
              Đang tải thêm đơn hàng...
            </span>
          </div>
        )}

        {/* No more data indicator */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-4 bg-gray-50 text-sm text-gray-500 border-t border-gray-200">
            ✓ Đã tải hết ({products.length.toLocaleString()} đơn hàng)
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <div>
            Hiển thị{" "}
            <span className="font-semibold text-gray-900">
              {products.length.toLocaleString()}
            </span>{" "}
            đơn hàng
          </div>
          <div className="flex items-center gap-2">
            {hasMore && (
              <>
                <span>•</span>
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tải thêm
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip cho tất cả các cells */}
      <Tooltip
        id="cell-tooltip"
        place="top"
        className="z-50 max-w-md break-words"
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          fontSize: "12px",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default React.memo(ProductList);
