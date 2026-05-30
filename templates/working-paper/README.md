# AcLab+ Working Paper — Template

Template chính thức cho **AcLab+ Working Paper Series**.

## File
- `aclab-working-paper.tex` — template LaTeX (khuyến nghị dùng chính).

## Cách dùng
1. Copy `aclab-working-paper.tex` cho bài mới.
2. Sửa khối **METADATA** ở đầu file: số WP, tiêu đề, tác giả, ngày, DOI, mã JEL, từ khoá.
3. Viết nội dung trong các `\section{...}`.
4. (Tuỳ chọn) tạo `references.bib` rồi bỏ comment dòng `\bibliography{references}`.
5. Biên dịch: `pdflatex aclab-working-paper.tex` (chạy 2 lần nếu có trích dẫn).

## Quy ước đánh số
`WP-AC-YYYY-NN` — ví dụ `WP-AC-2026-01`, `WP-AC-2026-02`...

## Sau khi hoàn thiện
1. Upload PDF lên **Zenodo Community** của AcLab+ để nhận **DOI**.
2. Cập nhật DOI vào file `.tex` (trường `\wpdoi`) và biên dịch lại bản cuối.
3. Thêm ấn phẩm vào website qua CMS (`/admin/`) — điền các trường `wp`, `doi`, `pdf`
   để trang paper hiển thị DOI badge, BibTeX và nhúng PDF.

> Bản Word phụ (nếu cần) sẽ bổ sung sau. LaTeX là định dạng chính theo
> Editorial Policy (xem `/chinh-sach-bien-tap/`).
