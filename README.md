# AcLab+ — Website

Trang web phòng thí nghiệm học thuật **AcLab+** (Kinh tế · Kinh doanh · Quản lý),
dựng bằng **Astro**, quản trị nội dung qua web bằng **Sveltia CMS**.

```
Astro (static)  →  GitHub (repo + Actions)  →  GitHub Pages
                         ▲
        Sveltia CMS /admin/ (đăng nhập GitHub qua Cloudflare Worker)
```

🌐 **Live:** https://dongkien.github.io/aclab/
🔐 **Quản trị:** https://dongkien.github.io/aclab/admin/

> 📘 **Hướng dẫn vận hành đầy đủ** (deploy, CMS, form, xử lý sự cố) xem ở **[`HUONG-DAN.md`](./HUONG-DAN.md)**.
> README này chỉ là tổng quan nhanh.

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
│   └── styles/global.css  Design system (CSS variables)
├── public/
│   ├── admin/             Sveltia CMS (index.html + config.yml)
│   └── uploads/           Ảnh upload từ CMS
├── .github/workflows/
│   └── deploy.yml         GitHub Actions: build Astro + deploy Pages
├── astro.config.mjs       site + base: '/aclab/'
├── HUONG-DAN.md           Tài liệu vận hành chi tiết
└── package.json
```

---

## 🚀 Phát triển local

```bash
npm install         # cài lần đầu
npm run dev         # dev server: http://localhost:4321/aclab/
npm run build       # build production → dist/
npm run preview     # xem bản build: http://localhost:4321/aclab/
```

> ⚠️ Site phục vụ ở **đường dẫn con `/aclab/`** nên URL local cũng có `/aclab/`.
> Mọi link nội bộ phải dùng `import.meta.env.BASE_URL` (xem helper `withBase()` trong
> `src/components/`), **không** viết `href="/..."` tuyệt đối.

---

## 🌐 Deploy

**Tự động:** mỗi lần đẩy lên nhánh `main` (kể cả khi lưu bài từ CMS),
**GitHub Actions** tự build và deploy lên GitHub Pages. Không cần thao tác tay.

- Workflow: `.github/workflows/deploy.yml` (yêu cầu **Node 22** — Astro 6 cần ≥ 22.12).
- Pages **Source** = *GitHub Actions* (Settings → Pages).

Chi tiết hạ tầng CMS (GitHub OAuth App + Cloudflare Worker) và form (Formspree):
xem **[`HUONG-DAN.md`](./HUONG-DAN.md)**.

---

## ✍️ Viết bài

### Cách 1 — Qua web (khuyên dùng)
`…/admin/` → **Sign in with GitHub** → **Tin tức / Thành viên / Ấn phẩm** → soạn → **Publish**.
Đang bật `editorial_workflow`: bài lưu thành bản nháp (PR) trước, duyệt rồi mới đăng.

### Cách 2 — Sửa file `.md` trực tiếp
```bash
cp src/content/posts/welcome.md src/content/posts/bai-moi.md
# sửa frontmatter + nội dung, rồi:
git add . && git commit -m "Bài mới: ..." && git push
```
Actions tự build & deploy sau ~1 phút.

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

## 🆘 Gặp lỗi?

Xem bảng xử lý sự cố trong **[`HUONG-DAN.md` §9](./HUONG-DAN.md)** (build fail Node, link hỏng,
CMS redirect_uri mismatch, đăng nhập màn trắng…).

📧 Liên hệ kỹ thuật: `aclabecon@gmail.com`
