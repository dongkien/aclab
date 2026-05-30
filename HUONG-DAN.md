# Hướng dẫn vận hành website AcLab+

Tài liệu này ghi lại **toàn bộ cách website AcLab+ được dựng và vận hành** trên GitHub,
để bảo trì về sau không phải dò lại. Cập nhật lần cuối: **30/05/2026**.

---

## 1. Địa chỉ & tài nguyên

| Mục | Địa chỉ |
|---|---|
| **Website (live)** | https://dongkien.github.io/aclab/ |
| **Trang quản trị (CMS)** | https://dongkien.github.io/aclab/admin/ |
| **Repo mã nguồn** | https://github.com/dongkien/aclab (public) |
| **Worker OAuth (Cloudflare)** | https://sveltia-cms-auth.dongockien.workers.dev |
| **Form Liên hệ (Formspree)** | https://formspree.io/f/mvzynozg |

---

## 2. Kiến trúc tổng quan

```
  Soạn nội dung (Sveltia CMS /admin/)  ─┐
                                        ├─► commit vào nhánh main (GitHub)
  Sửa code trực tiếp (git push main)  ─┘
                                        │
                                        ▼
                       GitHub Actions tự build (Astro)
                                        │
                                        ▼
                  GitHub Pages phục vụ  →  dongkien.github.io/aclab/
```

- **Framework:** Astro 6 (build tĩnh, không cần server).
- **Hosting:** GitHub Pages, phục vụ ở **đường dẫn con `/aclab/`**.
- **CI/CD:** GitHub Actions — mỗi lần `main` thay đổi là tự build & deploy.
- **CMS:** Sveltia CMS (đăng nhập bằng GitHub, qua một OAuth proxy chạy trên Cloudflare Worker).
- **Form Liên hệ:** Formspree.

---

## 3. Sửa / thêm nội dung (cách thường dùng)

### Cách A — qua giao diện CMS (khuyên dùng)
1. Mở https://dongkien.github.io/aclab/admin/
2. Bấm **Sign in with GitHub** → Authorize.
3. Soạn trong 3 mục: **Tin tức / Thành viên / Ấn phẩm**.
4. Bấm lưu. Vì đang bật **editorial workflow**, bài lưu thành **bản nháp (Pull Request)**;
   khi bấm **Publish** nó merge vào `main` → site tự cập nhật sau ~1 phút.

### Cách B — sửa file trực tiếp trên GitHub
- Nội dung nằm ở `src/content/posts|members|products/*.md` (định dạng Markdown + frontmatter).
- Sửa trên github.com (bút chì ✏️) → Commit → site tự build lại.

> Ảnh upload qua CMS lưu vào `public/uploads/`, hiển thị ở URL `/aclab/uploads/...`.

---

## 4. Cách deploy hoạt động (CI/CD)

- File workflow: **`.github/workflows/deploy.yml`**.
- Dùng `withastro/action@v3` để build, rồi `actions/deploy-pages@v4` để đăng.
- **QUAN TRỌNG — Node 22:** Astro 6 yêu cầu Node ≥ 22.12. Action mặc định chạy Node 20 sẽ
  **build fail**. Vì vậy workflow phải có:
  ```yaml
  - uses: withastro/action@v3
    with:
      node-version: 22
  ```
- Pages **Source** đặt = **GitHub Actions** (Settings → Pages).
- Sửa file trong `.github/workflows/` cần làm **qua giao diện web GitHub**
  (token máy local thiếu quyền `workflow` nên không push được).

---

## 5. Cấu hình quan trọng (đừng sửa nếu không hiểu)

### `astro.config.mjs`
```js
site: 'https://dongkien.github.io',
base: '/aclab/',   // PHẢI có dấu / cuối
```
- Vì deploy ở thư mục con, **mọi link nội bộ phải dùng `import.meta.env.BASE_URL`**,
  không viết `href="/..."` tuyệt đối. Xem helper `withBase()` trong
  `src/components/Header.astro` & `Footer.astro`.

### `public/admin/config.yml` (Sveltia CMS)
```yaml
backend:
  name: github
  repo: dongkien/aclab
  branch: main
  base_url: https://sveltia-cms-auth.dongockien.workers.dev   # worker OAuth
publish_mode: editorial_workflow
media_folder: "public/uploads"
public_folder: "/aclab/uploads"
```

---

## 6. Hạ tầng CMS (đăng nhập GitHub)

Để `/admin/` đăng nhập được trên GitHub Pages cần 2 thứ:

### a) GitHub OAuth App  →  https://github.com/settings/developers
- Tên: `AcLab+ CMS`
- Homepage URL: `https://dongkien.github.io/aclab/`
- **Authorization callback URL:** `https://sveltia-cms-auth.dongockien.workers.dev/callback`
- Cho ra **Client ID** + **Client Secret** (dán vào Cloudflare bên dưới).

### b) Cloudflare Worker `sveltia-cms-auth`
- Deploy từ repo https://github.com/sveltia/sveltia-cms-auth (nút "Deploy to Cloudflare").
- **Biến môi trường** (đặt ở **Cloudflare** → Worker → Settings → Variables, KHÔNG phải GitHub):
  | Tên | Giá trị | Kiểu |
  |---|---|---|
  | `GITHUB_CLIENT_ID` | Client ID của OAuth App | Text |
  | `GITHUB_CLIENT_SECRET` | Client Secret | Secret (Encrypt) |
  | `ALLOWED_DOMAINS` | `dongkien.github.io` | Text |
- ⚠️ Giữ **nguyên tên** `GITHUB_*` (code worker đọc đúng tên đó). GitHub Secrets cấm prefix
  `GITHUB_`, nhưng Cloudflare thì cho phép — nên phải đặt ở Cloudflare.

---

## 7. Form Liên hệ (Formspree)
- Form ở `src/pages/lien-he.astro`, POST tới `https://formspree.io/f/mvzynozg`.
- Quản lý / xem tin nhắn: đăng nhập https://formspree.io.
- Lần đầu cần gửi thử 1 lần + bấm xác nhận trong email để kích hoạt.

---

## 8. Deploy lại thủ công (khi cần, không qua Actions)

Bình thường **không cần** — cứ push `main` là Actions lo. Nhưng nếu muốn build & đẩy tay:
```bash
cd /home/kiendn/aclab
npm install          # lần đầu
npm run build        # ra thư mục dist/
npm run preview      # xem thử local tại http://localhost:4321/aclab/
```

---

## 9. Xử lý sự cố thường gặp

| Triệu chứng | Nguyên nhân & cách sửa |
|---|---|
| Actions build fail "Node.js v20 not supported" | Thiếu `node-version: 22` trong workflow (mục 4). |
| CSS/JS 404, trang trắng | Thiếu `.nojekyll` (chỉ xảy ra khi deploy kiểu nhánh `gh-pages` cũ; deploy qua Actions thì withastro/action tự xử lý). |
| Link nội bộ hỏng (kiểu `/aclabfoo`) | Quên dùng `BASE_URL`, hoặc `base` thiếu dấu `/` cuối (mục 5). |
| CMS báo "redirect_uri mismatch" | Callback URL của OAuth App sai — phải đúng `https://sveltia-cms-auth.dongockien.workers.dev/callback`. |
| CMS đăng nhập xong màn trắng | Sai `ALLOWED_DOMAINS` trên Cloudflare (đúng: `dongkien.github.io`). |

---

## 10. Việc còn để ngỏ (chưa làm)
- Thay nội dung **placeholder** bằng nội dung thật (qua CMS).
- Trỏ tên miền **aclab.plus** về GitHub Pages khi sẵn sàng thay site WordPress cũ.
- Triển khai roadmap "scholarly infrastructure" (xem `docs/roadmap-2026-2027.md`).
