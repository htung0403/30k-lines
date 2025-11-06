// components/Stats.jsx - Statistics component
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Stats card component
 * Hiển thị thống kê về dữ liệu
 */
const Stats = ({ totalLoaded, filteredCount, loading, hasMore }) => {
  const stats = [
    {
      label: 'Total Loaded',
      value: totalLoaded.toLocaleString(),
      icon: '📦',
      color: 'blue'
    },
    {
      label: 'Filtered Results',
      value: filteredCount.toLocaleString(),
      icon: '🔍',
      color: 'green'
    },
    {
      label: 'Status',
      value: loading ? 'Loading...' : hasMore ? 'More available' : 'All loaded',
      icon: loading ? '⏳' : hasMore ? '📥' : '✓',
      color: loading ? 'yellow' : hasMore ? 'purple' : 'green'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`
            bg-white rounded-lg shadow-md p-6 
            border-l-4 border-${stat.color}-500
            hover:shadow-lg transition-shadow duration-200
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(Stats);
