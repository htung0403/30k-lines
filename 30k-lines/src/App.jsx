// App.jsx - Main application component
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useProducts, useFilteredProducts } from "./hooks/useProducts";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import Stats from "./components/Stats";
import LoadingSkeleton from "./components/LoadingSkeleton";

/**
 * Main App Component
 *
 * KIẾN TRÚC:
 * 1. useProducts hook - Quản lý data fetching từ Firebase
 * 2. useFilteredProducts hook - Filter/search phía client
 * 3. ProductList - Virtualized list với @tanstack/react-virtual
 * 4. SearchBar - Tìm kiếm với debounce
 * 5. Stats - Hiển thị thống kê
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - React.memo cho các components
 * - useCallback cho callbacks
 * - Virtualization cho list rendering
 * - Debounced search
 * - LocalStorage caching
 * - Batch loading (500 items/lần)
 */
function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products với custom hook
  const {
    products,
    loading,
    initialLoading,
    error,
    loadMore,
    hasMore,
    totalLoaded,
    reset,
  } = useProducts(); // Load toàn bộ data từ Firebase

  // Filter products dựa trên search term
  const filteredProducts = useFilteredProducts(products, searchTerm);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle reset
  const handleReset = useCallback(() => {
    setSearchTerm("");
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="text-4xl mr-3">🔥</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý Đơn hàng
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Hiển thị và tìm kiếm 30,000+ đơn hàng
                </p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Lỗi khi tải đơn hàng
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-2">
                    Vui lòng kiểm tra cấu hình Firebase trong{" "}
                    <code className="bg-red-100 px-1 rounded">
                      src/firebase.js
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Initial Loading State */}
        {initialLoading ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <LoadingSkeleton count={10} />
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              totalCount={totalLoaded}
              filteredCount={filteredProducts.length}
            />

            {/* Stats */}
            <Stats
              totalLoaded={totalLoaded}
              filteredCount={filteredProducts.length}
              loading={loading}
              hasMore={hasMore}
            />

            {/* Product List */}
            <ProductList
              products={filteredProducts}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />

            {/* Performance Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Performance Tips
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Using virtualization to render only visible items</li>
                      <li>
                        Data is cached in localStorage for faster subsequent
                        loads
                      </li>
                      <li>Search is debounced to reduce re-renders</li>
                      <li>
                        Components are memoized to prevent unnecessary
                        re-renders
                      </li>
                      <li>
                        Scroll to bottom or click "Load more" to fetch
                        additional data
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Built with React + Vite + Firebase + TailwindCSS +
              @tanstack/react-virtual
            </p>
            <p className="mt-1">
              🚀 Optimized for rendering 30,000+ items smoothly
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
