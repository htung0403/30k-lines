# 📊 Quản lý 30,000+ Đơn hàng với React + Firebase

Ứng dụng web hiệu suất cao để quản lý và hiển thị 30,000+ đơn hàng từ Firebase Realtime Database với tính năng tìm kiếm realtime và virtualization.

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?logo=tailwindcss)

## ✨ Tính năng

- 🚀 **Hiệu suất cao** - Render 30,000+ đơn hàng mượt mà với virtualization
- 🔍 **Tìm kiếm realtime** - Tìm kiếm nhanh trên 15+ trường dữ liệu
- 💾 **Cache thông minh** - LocalStorage cache giảm thời gian load
- 📱 **Responsive** - Giao diện tối ưu cho mọi thiết bị
- 🎨 **UI/UX đẹp** - TailwindCSS + Framer Motion animations
- 💬 **Tooltip** - Hiển thị đầy đủ nội dung khi hover
- ⚡ **Realtime Database** - Kết nối trực tiếp với Firebase

## 🎯 Demo

**Live Demo:** [https://k-lines.web.app](https://k-lines.web.app)

## 📋 Các cột dữ liệu

| Cột | Mô tả |
|-----|-------|
| Mã đơn hàng | Mã định danh đơn hàng |
| Mã Tracking | Mã vận đơn theo dõi |
| Ngày lên đơn | Ngày tạo đơn hàng |
| Name* | Tên khách hàng |
| Phone* | Số điện thoại |
| Address | Địa chỉ giao hàng |
| City | Thành phố |
| State | Bang/Tỉnh |
| Zipcode | Mã bưu điện |
| Mặt hàng | Sản phẩm đặt mua |
| Giá bán | Giá tiền (USD) |
| Trạng thái giao hàng | Tình trạng vận chuyển |
| Hình thức thanh toán | Phương thức thanh toán |
| Team | Đội/nhóm xử lý |
| NV Sale | Nhân viên bán hàng |

## 🛠️ Công nghệ sử dụng

- **React 18.2** - UI framework
- **Vite 5.0** - Build tool cực nhanh
- **Firebase 10.7** - Realtime Database
- **TailwindCSS 3.4** - Utility-first CSS
- **@tanstack/react-virtual 3.0** - Virtualization cho list lớn
- **Framer Motion 10.16** - Animations mượt mà
- **React Tooltip** - Tooltip đẹp và dễ dùng

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/htung0403/30k-lines.git
cd 30k-lines
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

Tạo file `.env.local` trong thư mục gốc:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: http://localhost:3000

## 📁 Cấu trúc dữ liệu Firebase

Dữ liệu phải được lưu tại node `/datasheet/F3` với cấu trúc:

```json
{
  "datasheet": {
    "F3": [
      {
        "Mã đơn hàng": "ORD001",
        "Mã Tracking": "TRK123456",
        "Ngày lên đơn": "2025-01-01T00:00:00.000Z",
        "Name*": "Nguyễn Văn A",
        "Phone*": "0901234567",
        "Add": "123 Đường ABC",
        "City": "TP.HCM",
        "State": "HCM",
        "Zipcode": "70000",
        "Mặt hàng": "Sản phẩm A",
        "Giá bán": 100,
        "Trạng thái giao hàng": "ĐÃ GIAO",
        "Hình thức thanh toán": "Zelle",
        "Team": "Hà Nội",
        "Nhân viên Sale": "Nguyễn Thị B"
      }
    ]
  }
}
```

## 🔥 Firebase Rules

Cấu hình rules trong Firebase Console cho phép đọc dữ liệu:

```json
{
  "rules": {
    "datasheet": {
      "F3": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

## 📦 Build & Deploy

### Build production

```bash
npm run build
```

### Deploy lên Firebase Hosting

```bash
firebase deploy --only hosting
```

## ⚡ Tối ưu hiệu suất

### Virtualization
- Chỉ render ~30 items trong viewport thay vì 30,000
- Sử dụng `@tanstack/react-virtual` cho hiệu suất cao

### Caching
- Cache 5,000 items đầu tiên trong LocalStorage
- Cache valid trong 10 phút
- Giảm thời gian load lần 2+

### Search optimization
- Tìm kiếm trên 15 trường quan trọng thay vì tất cả
- Debounce 300ms để giảm tải
- Filter client-side cho kết quả instant

### Code splitting
- Lazy load components khi cần
- Dynamic imports cho performance

## 🎨 Tùy chỉnh

### Thêm/bớt cột hiển thị

Chỉnh sửa `src/components/ProductList.jsx`:

```jsx
// Thêm cột mới
<div className="w-32 text-gray-600 truncate px-2">
  {product["Trường mới"] || "N/A"}
</div>
```

### Thay đổi trường tìm kiếm

Chỉnh sửa `src/hooks/useProducts.js`:

```javascript
const searchableValues = [
  product["Mã đơn hàng"],
  product["Tên trường mới"],
  // ... thêm trường khác
];
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 Scripts

```bash
npm run dev          # Chạy dev server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
firebase deploy      # Deploy lên Firebase
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "No data found"
- Kiểm tra Firebase Rules
- Đảm bảo data nằm đúng node `/datasheet/F3`
- Kiểm tra Database URL trong `.env.local`

### Lỗi: "CORS blocked"
- Kiểm tra Firebase Rules cho phép đọc
- Xác minh domain trong Firebase Console

### Performance chậm
- Kiểm tra số lượng trường tìm kiếm
- Xem xét tăng overscan trong virtualization
- Clear LocalStorage cache

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết chi tiết.

## 👤 Tác giả

**htung0403**
- GitHub: [@htung0403](https://github.com/htung0403)
- Project: [30k-lines](https://github.com/htung0403/30k-lines)

## 🌟 Hỗ trợ

Nếu thấy project hữu ích, hãy cho 1 ⭐️ trên GitHub!

---

**Built with ❤️ using React + Firebase + Vite**
