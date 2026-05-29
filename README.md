# AcLab+ — Website

Trang web phòng thí nghiệm học thuật **AcLab+** (Kinh tế · Kinh doanh · Quản lý), dựng bằng **Astro** với **Decap CMS** quản trị nội dung qua web.

```
Astro (static site)  →  GitHub (repo)  →  Netlify (auto-deploy + CMS auth)
```

---

## 🗂️ Cấu trúc

```
aclab/
├── src/
│   ├── components/        Header, Footer
│   ├── layouts/           BaseLayout (wrap mọi trang)
│   ├── pages/             Các route .astro
│   ├── content/
│   │   ├── posts/         .md — tin tức
│   │   ├── members/       .md — thành viên
│   │   └── products/      .md — ấn phẩm
│   ├── content.config.ts  Schema (zod) cho 3 collection
│   └── styles/global.css  Design system (CSS variables)
├── public/
│   ├── admin/             Decap CMS (index.html + config.yml)
│   └── uploads/           Ảnh upload từ CMS
├── netlify.toml           Cấu hình build
└── package.json
```

---

## 🚀 Phát triển local

```bash
npm install         # cài lần đầu
npm run dev         # dev server: http://localhost:4321
npm run build       # build production → dist/
npm run preview     # xem bản build
```

### Chạy CMS local (không cần Netlify)

```bash
# Terminal 1
npx decap-server          # proxy lưu thay đổi xuống ổ đĩa

# Terminal 2
npm run dev

# Trong public/admin/config.yml, mở dòng `local_backend: true`
```

Mở http://localhost:4321/admin/index.html — chỉnh sửa, lưu, file `.md` cập nhật ngay trong `src/content/`.

---

## 🌐 Deploy lần đầu (làm 1 lần)

### Bước 1 — Đưa code lên GitHub

```bash
cd /home/kiendn/aclab

git init
git add .
git commit -m "Initial site"
git branch -M main

# Tạo repo trên github.com (Settings → New repository → tên: aclab-site)
# rồi:
git remote add origin https://github.com/<USERNAME>/aclab-site.git
git push -u origin main
```

### Bước 2 — Kết nối Netlify

1. Vào **https://app.netlify.com** → đăng nhập bằng GitHub.
2. **Add new site → Import an existing project → GitHub** → chọn repo `aclab-site`.
3. Netlify đọc `netlify.toml` ⇒ build command và publish folder đã đúng. **Deploy**.
4. Khoảng 30 giây sau bạn có URL dạng `https://random-name.netlify.app`.

### Bước 3 — Đổi tên Netlify subdomain (tùy chọn)

Site settings → Domain management → Options → **Edit site name** → đổi thành `aclab` chẳng hạn → `aclab.netlify.app`.

### Bước 4 — Trỏ tên miền `aclab.plus`

1. Netlify: Domain management → **Add custom domain** → nhập `aclab.plus`.
2. Trỏ DNS tại nhà cung cấp tên miền:
   - Bản ghi **A** `@` → `75.2.60.5`
   - Bản ghi **CNAME** `www` → `<tên-netlify>.netlify.app`
3. Netlify tự cấp **SSL Let's Encrypt** trong 1–10 phút.

### Bước 5 — Bật Decap CMS (Netlify Identity + Git Gateway)

> **Quan trọng:** đây là bước phải làm để `/admin/` hoạt động được.

1. Netlify dashboard → **Site configuration → Identity → Enable Identity**.
2. **Identity → Registration**, chọn **Invite only** (chỉ admin mời được).
3. Bật **Identity → Services → Git Gateway → Enable Git Gateway**.
4. **Identity → Invite users** → mời `aclabecon@gmail.com` (hoặc email khác).
5. Mở email → bấm link → đặt mật khẩu → tự động đẩy về `aclab.plus/admin/` → login.

Từ giờ: đăng nhập `/admin/` → viết bài → Publish → Netlify auto-rebuild → bài lên ~30 giây sau.

---

## ✍️ Quy trình viết bài (sau khi deploy)

### Cách 1 — Qua web (khuyên dùng)

`aclab.plus/admin/` → Login → **Tin tức** (hoặc Thành viên / Ấn phẩm) → **New** → điền form → **Publish**.

Với `publish_mode: editorial_workflow` (đã bật sẵn): bài đầu tiên sẽ ở trạng thái **Draft** → bạn duyệt rồi mới **Publish**.

### Cách 2 — Sửa file `.md` trực tiếp

```bash
cp src/content/posts/welcome.md src/content/posts/bai-moi.md
# sửa frontmatter và nội dung, rồi:
git add . && git commit -m "Bài mới: ..." && git push
```

Netlify tự build và deploy sau ~30 giây.

---

## 🎨 Tùy chỉnh giao diện

Toàn bộ design token nằm trong **`src/styles/global.css`** (đầu file):

```css
:root {
  --bg: #fbf8f1;          /* nền kem ấm */
  --text: #1a1f2e;
  --accent: #0f2747;      /* navy chủ đạo */
  --accent-2: #8a2b2b;    /* marsala nhấn */
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;
  --font-serif: 'Lora', Georgia, serif;
}
```

Đổi giá trị ⇒ toàn site đổi theo. Header/Footer ở `src/components/`.

---

## 📋 Checklist sau deploy

- [ ] `aclab.plus` mở được, HTTPS xanh.
- [ ] Mọi trang trong nav hoạt động.
- [ ] `/admin/` login được, viết thử một bài → hiện ra ở `/tin-tuc/`.
- [ ] Form Liên hệ gửi được → Netlify dashboard → **Forms** → có submission.
- [ ] Mời các admin khác qua **Identity → Invite users**.

---

## 🆘 Gặp lỗi?

- **Build fail trên Netlify** → tab **Deploys → log**, thường do schema content không khớp.
- **`/admin/` trắng** → chưa bật Identity hoặc chưa bật Git Gateway.
- **Login `/admin/` được nhưng không lưu được** → Git Gateway chưa bật.
- **Ảnh upload không hiện** → kiểm tra `media_folder: public/uploads` trong `config.yml`.

📧 Liên hệ kỹ thuật: `aclabecon@gmail.com`
