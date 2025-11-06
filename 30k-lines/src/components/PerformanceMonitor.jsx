// components/PerformanceMonitor.jsx - Real-time performance monitor
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PerformanceMonitor Component
 * Hiển thị real-time metrics: FPS, Memory, Load time
 *
 * Để enable: Thêm ?debug=true vào URL
 * Ví dụ: http://localhost:3000?debug=true
 */
const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderCount: 0,
    lastRenderTime: 0,
  });

  // Check debug mode từ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsVisible(params.get("debug") === "true");
  }, []);

  // FPS calculation
  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const calculateFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        setMetrics((prev) => ({
          ...prev,
          fps,
          renderCount: prev.renderCount + 1,
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    calculateFPS();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible]);

  // Memory monitoring
  useEffect(() => {
    if (!isVisible || !performance.memory) return;

    const interval = setInterval(() => {
      const memoryMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
      setMetrics((prev) => ({ ...prev, memory: parseFloat(memoryMB) }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Measure render time
  useEffect(() => {
    if (!isVisible) return;

    const renderTime = performance.now();
    setMetrics((prev) => ({
      ...prev,
      lastRenderTime: renderTime,
    }));
  });

  const handleToggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Show Performance Monitor"
      >
        📊
      </button>
    );
  }

  const getFPSColor = (fps) => {
    if (fps >= 55) return "text-green-500";
    if (fps >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getMemoryColor = (memory) => {
    if (memory < 200) return "text-green-500";
    if (memory < 400) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-2xl z-50 font-mono text-sm min-w-[250px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="font-bold">Performance</span>
          </div>
          <button
            onClick={handleToggle}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          {/* FPS */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">FPS:</span>
            <span className={`font-bold text-lg ${getFPSColor(metrics.fps)}`}>
              {metrics.fps}
            </span>
          </div>

          {/* Memory */}
          {performance.memory && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Memory:</span>
              <span className={`font-bold ${getMemoryColor(metrics.memory)}`}>
                {metrics.memory} MB
              </span>
            </div>
          )}

          {/* Render Count */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Renders:</span>
            <span className="font-bold text-blue-400">
              {metrics.renderCount}
            </span>
          </div>

          {/* Performance Tips */}
          <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <div className="space-y-1">
              <div>{metrics.fps >= 55 ? "✅" : "⚠️"} Target: 60 FPS</div>
              <div>{metrics.memory < 300 ? "✅" : "⚠️"} Target: &lt;300 MB</div>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-500 text-center">
          Remove ?debug=true to hide
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(PerformanceMonitor);
