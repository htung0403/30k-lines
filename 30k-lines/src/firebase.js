// firebase.js - Firebase Configuration và Initialization
//
// HƯỚNG DẪN CÀI ĐẶT:
// 1. Tạo project Firebase tại: https://console.firebase.google.com/
// 2. Vào Project Settings > General > Your apps > Add app (chọn Web)
// 3. Copy Firebase config object và paste vào đây
// 4. Vào Realtime Database > Create Database
// 5. Chọn chế độ test mode hoặc cấu hình rules phù hợp
//
// FIREBASE RULES GỢI Ý (cho development):
// {
//   "rules": {
//     ".read": true,
//     ".write": true
//   }
// }
//
// FIREBASE RULES GỢI Ý (cho production):
// {
//   "rules": {
//     "products": {
//       ".read": "auth != null",
//       ".write": "auth != null"
//     }
//   }
// }

import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Firebase Configuration
// Sử dụng environment variables hoặc fallback về hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

// Connect to Firebase Emulator if in development mode
// Để enable emulator: set VITE_USE_FIREBASE_EMULATOR=true trong .env.local
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true") {
  console.log("🔧 Connected to Firebase Emulator");
  connectDatabaseEmulator(database, "localhost", 9000);
}

export { database };

// Export app nếu cần dùng các services khác
export default app;

// SCRIPT TẠO DỮ LIỆU MẪU (chạy trong Firebase Console hoặc Node.js):
//
// async function generateSampleData() {
//   const { getDatabase, ref, set } = require('firebase/database');
//   const db = getDatabase();
//   const productsRef = ref(db, 'products');
//
//   const products = {};
//   for (let i = 1; i <= 30000; i++) {
//     products[`product_${i}`] = {
//       id: `product_${i}`,
//       name: `Product ${i}`,
//       price: Math.floor(Math.random() * 1000) + 10,
//       category: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'][Math.floor(Math.random() * 5)],
//       stock: Math.floor(Math.random() * 100),
//       rating: (Math.random() * 5).toFixed(1),
//       createdAt: Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
//     };
//   }
//
//   await set(productsRef, products);
//   console.log('✅ Created 30,000 products successfully!');
// }
