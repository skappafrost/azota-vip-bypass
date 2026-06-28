import os

path = os.path.expanduser('~/azota-vip-bypass/README.md')

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original: {len(content)} chars, {content.count(chr(10))} lines")

# Find: "cân nhắc kỹ trước khi sử dụng.\n\n---\n\n## 🇬🇧 ENGLISH"
marker = 'cân nhắc kỹ trước khi sử dụng.\n\n---\n\n## 🇬🇧 ENGLISH'
idx = content.find(marker)

if idx < 0:
    # Try without newlines
    marker = 'cân nhắc kỹ trước khi sử dụng.\n\n---'
    idx = content.find(marker)
    
print(f"Marker at idx={idx}")

if idx < 0:
    print("ERROR: marker not found")
    exit(1)

# Split at the "---" before English
before_end = idx + len('cân nhắc kỹ trước khi sử dụng.\n')
insert_point = before_end  # right after the warning text, before "\n---\n\n## 🇬🇧"

vn_guide = """---

## 📖 HƯỚNG DẪN SỬ DỤNG (TIẾNG VIỆT)

> **⚡ Script này hoạt động hoàn toàn tự động — bạn không cần làm gì cả!**

Sau khi cài đặt, script sẽ **tự động chạy ngầm trong nền** (background) mỗi khi bạn truy cập azota.vn.  
Không có menu, không có nút bấm, không có cài đặt gì thêm. **Chỉ cần cài xong là script tự làm việc.**

---

### Bước 1: Cài đặt Tampermonkey

**Trên Google Chrome / Microsoft Edge / Brave:**
1. Mở: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. Bấm **"Thêm vào Chrome"** → **"Thêm extension"**
3. Icon 🎭 xuất hiện ở góc phải trình duyệt

**Trên Firefox:**
1. Mở: https://addons.mozilla.org/vi/firefox/addon/tampermonkey/
2. Bấm **"Thêm vào Firefox"** → **"Thêm"**

**Trên Android (Kiwi Browser):**
1. Cài [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser)
2. Mở Chrome Web Store trong Kiwi → cài Tampermonkey

---

### Bước 2: Cài đặt Script

**Cách A — Cài tự động (nhanh nhất - khuyến nghị):**
1. Click link này: `https://raw.githubusercontent.com/skappafrost/azota-vip-bypass/main/src/azota-vip-bypass.user.js`
2. Tampermonkey tự nhận diện → hiện trang cài đặt
3. Bấm **"Install"** — **xong!** 🎉

**Cách B — Cài từ URL:**
1. Bấm icon 🎭 → **Dashboard** → tab **Utilities**
2. Ô "Install from URL", dán: `https://raw.githubusercontent.com/skappafrost/azota-vip-bypass/main/src/azota-vip-bypass.user.js`
3. Bấm **"Install"** → xác nhận

**Cách C — Copy-Paste thủ công:**
1. Bấm icon 🎭 → **Dashboard** → **Create a new script**
2. Xoá code mẫu → copy nội dung `src/azota-vip-bypass.user.js` từ GitHub
3. Dán vào → **Ctrl+S** để lưu

---

### Bước 3: Script tự động chạy — KHÔNG CẦN LÀM GÌ THÊM

Sau khi cài đặt xong:
1. Mở tab mới → vào `https://azota.vn` → đăng nhập
2. **Làm bài kiểm tra như bình thường**
3. **Script tự động làm việc ngầm trong nền** — nó sẽ:

| Tính năng | Tự động? | Mô tả |
|-----------|----------|-------|
| 🔓 **Mở khoá VIP** | ✅ | Tự động fake response VIP — tất cả tính năng mở khoá |
| 🚦 **Bỏ qua tắc nghẽn** | ✅ | Cho phép thi ngay cả khi đông người |
| ⏭️ **Bỏ qua quảng cáo** | ✅ | Ẩn banner, popup, quảng cáo shopie |
| 📥 **Tải file không giới hạn** | ✅ | Export Excel, tải tài liệu... |
| 🧹 **Giao diện sạch** | ✅ | Ẩn popup "Nâng cấp VIP", "Hết hạn gói" |

> **⚠️ Bạn KHÔNG cần: mở menu · bấm nút · cấu hình · làm bất kỳ thao tác nào khác**

---

### Kiểm tra script đã hoạt động

**Cách 1 — Xem Console (dễ nhất):**
1. Trên trang azota.vn, bấm **F12** → tab **Console**
2. Tìm dòng: `[AzotaVIP] Ready — intercepting 8 endpoint patterns`
3. Nếu thấy → **Script đã chạy thành công!** ✅

**Cách 2 — Kiểm tra trực quan:**
- Không thấy banner quảng cáo, popup nâng cấp VIP
- Các tính năng bị khoá (tải file, xem đáp án) đã mở
- Giờ cao điểm vẫn vào bài kiểm tra được bình thường

**Cách 3 — Xem log chi tiết:**
1. Mở Console (F12)
2. Gõ `AzotaVIP` vào ô filter
3. Xem danh sách endpoint đã intercept

---

### Câu hỏi thường gặp (FAQ)

#### 1. Tôi có cần làm gì sau khi cài script không?
**Không.** Script chạy hoàn toàn tự động trong nền. Cài xong là dùng được ngay.

#### 2. Làm sao biết script đã hoạt động?
Mở Console (F12) → tìm `[AzotaVIP] Ready`. Nếu thấy là ổn.

#### 3. Script có làm chậm trình duyệt không?
Không. Script chỉ chạy 20-50ms mỗi lần có request phù hợp. Hoàn toàn không ảnh hưởng.

#### 4. Tôi có bị khoá tài khoản không?
Có thể. Script can thiệp API của azota.vn, vi phạm Điều khoản Dịch vụ. Đọc phần tuyên bố pháp lý ở trên.

#### 5. Script có hoạt động trên điện thoại không?
Chỉ Android (Kiwi Browser). iOS không hỗ trợ Tampermonkey.

#### 6. Muốn tắt script tạm thời?
Bấm icon 🎭 → Toggle switch để tắt/bật.

#### 7. VIP này có thật không?
VIP là **giả ở client-side**. Server vẫn biết bạn không phải VIP. Chỉ trick trình duyệt của bạn.

#### 8. Script có cần cập nhật?
Nếu azota.vn đổi endpoint, script có thể ngừng hoạt động. Kiểm tra GitHub để cập nhật.

#### 9. Đóng góp / báo lỗi ở đâu?
📧 **skappafrost@gmail.com** hoặc [GitHub Issues](https://github.com/skappafrost/azota-vip-bypass/issues).

#### 10. Script an toàn không?
Không gửi dữ liệu, không đọc cookie, không can thiệp file hệ thống. Tuy nhiên có rủi ro pháp lý (xem tuyên bố).

---

### ⭐ ỦNG HỘ DỰ ÁN

Nếu bạn thấy script hữu ích, hãy **star** ⭐ repo trên GitHub để ủng hộ nhé!

Mọi góp ý, báo lỗi, hoặc đề xuất cải tiến, xin vui lòng liên hệ: **📧 skappafrost@gmail.com**

---

"""

new_content = content[:insert_point] + vn_guide + content[insert_point:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Written! {len(new_content)} chars, {new_content.count(chr(10))} lines")

# Verify
eng = new_content.find('## 🇬🇧 ENGLISH')
guide = new_content.find('HƯỚNG DẪN SỬ DỤNG')
dup = new_content.count('cân nhắc kỹ')
print(f"English at line: {new_content[:eng].count(chr(10))+1}")
print(f"Guide at line: {new_content[:guide].count(chr(10))+1}")
print(f"'cân nhắc kỹ' occurrences: {dup}")
print(f"Sections: Guide={new_content.count('HƯỚNG DẪN SỬ DỤNG')}, English={new_content.count('🇬🇧 ENGLISH')}, VN={new_content.count('🇻🇳 TIẾNG VIỆT')}")
