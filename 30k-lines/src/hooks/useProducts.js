// hooks/useProducts.js - Custom hook để fetch và quản lý orders data
import { useState, useEffect, useCallback, useRef } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";

/**
 * Custom hook để load orders từ Firebase với phân trang
 *
 * CHIẾN LƯỢC LOAD DỮ LIỆU:
 * - Load theo batch (mặc định 500 items/lần)
 * - Sử dụng orderByKey() + limitToFirst() + startAt() để phân trang
 * - Cache dữ liệu trong localStorage để tăng tốc độ load lại
 * - Hỗ trợ search/filter phía client
 *
 * @param {number} batchSize - Số lượng items load mỗi lần
 * @returns {Object} - {products, loading, error, loadMore, hasMore, totalLoaded}
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(0);

  const lastKeyRef = useRef(null);
  const cacheKeyRef = useRef("firebase_orders_cache_v1");
  const isLoadingRef = useRef(false);

  // Load từ cache nếu có
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKeyRef.current);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;

        // Cache valid trong 10 phút
        if (cacheAge < 10 * 60 * 1000) {
          setProducts(data);
          setTotalLoaded(data.length);
          setInitialLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.warn("⚠️ Cache error:", err);
    }
    return false;
  }, []);

  // Save vào cache
  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(
        cacheKeyRef.current,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      console.warn("⚠️ Cache save error:", err);
    }
  }, []);

  // Fetch products từ Firebase
  const fetchProducts = useCallback(
    async (isInitial = false) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const productsRef = ref(database, "datasheet/F3");

        // Load toàn bộ data (vì Firebase array không hỗ trợ pagination tốt)
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();

          // Xử lý data: nếu là array thì dùng trực tiếp, nếu là object thì convert
          const productsArray = Array.isArray(data)
            ? data
                .filter((item) => item != null)
                .map((item, idx) => ({
                  key: idx.toString(),
                  ...item,
                }))
            : Object.entries(data).map(([key, value]) => ({
                key,
                ...value,
              }));

          // Load toàn bộ data một lần
          if (isInitial) {
            setProducts(productsArray);
            setTotalLoaded(productsArray.length);
            setHasMore(false); // Đã load hết

            // Save vào cache
            if (productsArray.length <= 5000) {
              saveToCache(productsArray);
            }
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        isLoadingRef.current = false;
      }
    },
    [saveToCache]
  );

  // Load more products (không cần thiết vì đã load hết)
  const loadMore = useCallback(() => {
    // Đã load hết data, không cần load more
  }, []);

  // Reset và load lại từ đầu
  const reset = useCallback(() => {
    setProducts([]);
    setTotalLoaded(0);
    setHasMore(true);
    lastKeyRef.current = null;
    localStorage.removeItem(cacheKeyRef.current);
    fetchProducts(true);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    // Thử load từ cache trước
    const hasCache = loadFromCache();

    // Nếu không có cache hoặc cache expired, fetch từ Firebase
    if (!hasCache) {
      fetchProducts(true);
    }
  }, [fetchProducts, loadFromCache]);

  return {
    products,
    loading,
    initialLoading,
    error,
    loadMore,
    hasMore,
    totalLoaded,
    reset,
  };
};

/**
 * Hook để filter/search orders
 *
 * @param {Array} products - Danh sách orders
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {Array} - Filtered orders
 */
export const useFilteredProducts = (products, searchTerm) => {
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    // Tìm kiếm THEO TRƯỜNG CỤ THỂ để tối ưu performance với 30,000 records
    const filtered = products.filter((product) => {
      // Danh sách các trường quan trọng cần search
      const searchableValues = [
        product["Mã đơn hàng"],
        product["Mã Tracking"],
        product["Name*"],
        product["Phone*"],
        product["Add"],
        product["City"],
        product["State"],
        product["Zipcode"],
        product["Mặt hàng"],
        product["Nhân viên Sale"],
        product["Nhân viên Marketing"],
        product["Team"],
        product["Trạng thái giao hàng"],
        product["Trạng thái đơn"],
        product["Hình thức thanh toán"],
      ];

      // Tìm kiếm trong các trường đã chọn
      return searchableValues.some((value) => {
        if (value == null) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  return filteredProducts;
};
