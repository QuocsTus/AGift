# A Gift — phiên bản React + TypeScript 2.0.0

## Tổng quan

Thư mục `tsx-app/` là phiên bản React + TypeScript mới của website. Bản HTML cũ (`index.html`, `20-10.html`, `20-11.html`) vẫn được giữ nguyên để đối chiếu và chạy dự phòng.

Trang `/` hiện được tích hợp bằng `LegacyBirthdayPage.tsx` với bản sao `tsx-app/public/legacy-birthday.html`. Cách này giữ nguyên chính xác design, modal, nhạc và animation phức tạp của `index.html` trong lúc các trang mới dùng layout TSX. Khi chỉnh sửa `index.html`, hãy copy lại file đó vào `tsx-app/public/legacy-birthday.html` để bản TSX sinh nhật cập nhật theo.

Phiên bản TSX đã tách các phần chính thành:

- `components/Layout.tsx`: header, navigation, menu mobile dùng chung.
- `components/OccasionPage.tsx`: layout dùng chung cho các dịp 20/10 và 20/11.
- `components/BirthdaySections.tsx`: các section sinh nhật dạng TSX, dùng làm nền cho bước component hóa tiếp theo.
- `components/LegacyBirthdayPage.tsx`: tích hợp nguyên bản design sinh nhật hiện tại.
- `data.ts`: nội dung và metadata của từng dịp.
- `styles.css`: stylesheet chung, responsive và hiệu ứng.

## Chạy bản TSX

Yêu cầu Node.js 18 trở lên.

```bash
npm install
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal. Các route chính:

- `/` — Sinh nhật
- `/20-10` — 20/10
- `/20-11` — 20/11

## Build bản production

```bash
npm run build
npm run preview
```

Build sẽ được tạo trong thư mục `dist/`. Asset trong thư mục `assets/` được dùng chung thông qua cấu hình `publicDir` trong `tsx-app/vite.config.ts`.

## Cập nhật nội dung

1. Sửa lời chúc, tiêu đề hoặc đường dẫn trong `tsx-app/src/data.ts`.
2. Thêm section mới vào component tương ứng trong `tsx-app/src/components/`.
3. Dùng class có sẵn trong `styles.css` hoặc thêm style mới theo component.
4. Chạy `npm run build` trước khi bàn giao.

## Quy tắc phiên bản

Phiên bản hiện tại: **2.0.0** — chuyển sang React + TypeScript, tách layout dùng chung và bổ sung responsive navigation.

- `2.0.x`: sửa lỗi, điều chỉnh nội dung, màu sắc, spacing.
- `2.1.0`: thêm tính năng hoặc section mới nhưng không phá API/component hiện tại.
- `3.0.0`: thay đổi lớn về routing, dữ liệu hoặc giao diện.

## Ghi chú chuyển đổi

Không xóa bản HTML cũ cho đến khi bản TSX được kiểm tra đầy đủ trên desktop và mobile. Khi đã xác nhận bản mới ổn định, có thể dùng cấu hình hosting để trỏ document root sang `dist/`.
