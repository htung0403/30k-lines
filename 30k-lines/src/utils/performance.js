// utils/performance.js - Performance monitoring utilities

/**
 * Measure và log performance của một function
 *
 * @param {string} label - Label cho measurement
 * @param {Function} fn - Function cần measure
 */
export const measurePerformance = async (label, fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = (end - start).toFixed(2);

  console.log(`⏱️ ${label}: ${duration}ms`);

  return result;
};

/**
 * Memory usage monitor
 */
export const logMemoryUsage = () => {
  if (performance.memory) {
    const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    const total = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
    const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);

    console.log(`💾 Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);

    return {
      used: parseFloat(used),
      total: parseFloat(total),
      limit: parseFloat(limit),
    };
  }

  return null;
};

/**
 * FPS Monitor
 */
export class FPSMonitor {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.frames++;

    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round(
        (this.frames * 1000) / (currentTime - this.lastTime)
      );
      this.frames = 0;
      this.lastTime = currentTime;

      console.log(`📊 FPS: ${this.fps}`);
    }

    requestAnimationFrame(() => this.loop());
  }

  getFPS() {
    return this.fps;
  }
}

/**
 * Debounce function
 *
 * @param {Function} func - Function cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 *
 * @param {Function} func - Function cần throttle
 * @param {number} limit - Thời gian limit (ms)
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Create performance observer
 */
export const observePerformance = () => {
  if (!window.PerformanceObserver) return;

  // Observe paint timing
  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
    }
  });

  paintObserver.observe({ entryTypes: ["paint"] });

  // Observe largest contentful paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log(`🖼️ LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
  });

  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
};

/**
 * Export performance data
 */
export const exportPerformanceData = () => {
  const perfData = {
    navigation: performance.getEntriesByType("navigation")[0],
    memory: performance.memory
      ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        }
      : null,
    timing: performance.timing,
    resources: performance.getEntriesByType("resource").length,
  };

  return perfData;
};
