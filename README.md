<div align="center">

# ⚠️ Azota Ads + VIP Interceptor

### Nghiên cứu bảo mật — API Response Interception trên azota.vn

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-%E2%9C%93-yellow?style=flat-square)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](src/azota-vip-bypass.user.js)
[![Educational Only](https://img.shields.io/badge/Purpose-Educational%20Research%20Only-red.svg)](#legal-disclaimer)

**⛔ KHÔNG DÀNH CHO SỬ DỤNG THƯỜNG — ĐỌC PHẦN PHÁP LÝ TRƯỚC KHI DÙNG ⛔**

</div>

---

## 📖 Giới thiệu

Repo này chứa một PoC (Proof of Concept) minh hoạ kỹ thuật **client-side API response interception** — một lớp bảo mật thường bị bỏ qua ở các SPA (Single Page Application). Bằng cách hook `XMLHttpRequest.prototype` và `window.fetch`, ta có thể sửa response **trước khi framework (Angular) đọc nó**, từ đó thay đổi hành vi UI: ẩn quảng cáo, mở khoá tính năng VIP.

**Mục đích nghiên cứu:** chứng minh rằng mọi quyết định phân quyền đặt ở client đều có thể bị giả mạo, và backend mới là nơi duy nhất có thể kiểm soát thực sự.

> ⚠️ **Kết quả quan trọng từ đợt verify 2026-09-15:** Gate "bắt đầu thi" của azota hiện **không** phải paywall. Phần lớn tính năng thi cử vẫn mở. Script giải quyết chính là **quảng cáo** (shopie + Google AdSense) và **UI paywall VIP**. Xem [§ Phân tích kỹ thuật](#-phân-tích-kỹ-thuật).

---

## 🇻🇳 TIẾNG VIỆT

### ⚖️ TUYÊN BỐ MIỄN TRÁCH NHIỆM PHÁP LÝ (10 ĐIỀU)

> **⚠️ CẢNH BÁO PHÁP LÝ NGHIÊM TRỌNG — ĐỌC TRƯỚC KHI SỬ DỤNG**

Script này được tạo ra **CHỈ VÌ MỤC ĐÍCH NGHIÊN CỨU BẢO MẬT**. Nó minh hoạ cách một SPA có thể bị can thiệp ở tầng network thông qua Tampermonkey — kỹ thuật **API response interception**.

**BẰNG VIỆC SỬ DỤNG, TẢI XUỐNG, HOẶC TRIỂN KHAI SCRIPT NÀY, BẠN ĐỒNG Ý VỚI TẤT CẢ CÁC ĐIỀU KHOẢN SAU. NẾU KHÔNG ĐỒNG Ý, KHÔNG ĐƯỢC SỬ DỤNG.**

#### 1. MỤC ĐÍCH DUY NHẤT
Chỉ dùng cho nghiên cứu, phân tích, giáo dục về bảo mật web. Minh hoạ cách API response có thể bị giả mạo client-side — lỗ hổng mà các nền tảng thi trực tuyến cần biết để bảo vệ hệ thống.

#### 2. VI PHẠM PHÁP LUẬT
Script **can thiệp dữ liệu trả về từ server**, có thể cấu thành:
- **Luật Hình sự VN 2015, Điều 145** — Xâm nhập trái phép hệ thống máy tính, mạng viễn thông
- **Luật Hình sự VN 2015, Điều 226** — Xâm phạm bí mật hoặc an toàn thông tin
- **Nghị định 15/2020/NĐ-CP** — Xử phạt hành chính lĩnh vực CNTT
- **CFAA 18 U.S.C. § 1030** — Nếu hạ tầng server tại Mỹ
- **DMCA § 1201** — Chống vượt qua kiểm soát truy cập
- **Vi phạm Điều khoản Dịch vụ (ToS)** của azota.vn

#### 3. NGƯỜI DÙNG CHỊU HOÀN TOÀN TRÁCH NHIỆM
Bạn — và **chỉ bạn** — chịu mọi trách nhiệm pháp lý từ việc: cài đặt/sử dụng/phải script; bị khoá tài khoản, đình chỉ học tập, buộc thôi học; bị kiện dân sự hoặc truy cứu hình sự; bị phạt tiền, bồi thường; bị tịch thu thiết bị.

#### 4. TÁC GIẢ KHÔNG CHỊU TRÁCH NHIỆM
Tác giả (**@skappafrost**, **nexus**, **isvn**) và mọi contributor **KHÔNG CHỊU BẤT KỲ TRÁCH NHIỆM NÀO**, bao gồm nhưng không giới hạn: thiệt hại trực tiếp/gián tiếp/ngẫu nhiên/hậu quả; mất dữ liệu, mất tài khoản, mất cơ hội học tập; chi phí pháp lý, án phí, tiền bồi thường; tổn thất tinh thần, danh dự, uy tín.

#### 5. KHÔNG CÓ SỰ CHO PHÉP
Script **KHÔNG** được azota.vn cho phép, chứng thực, hay hỗ trợ. Sử dụng = **vi phạm ToS**, có thể dẫn đến **khoá tài khoản vĩnh viễn**.

#### 6. CHỈ DÙNG TRÊN HỆ THỐNG CỦA BẠN
Chỉ chạy trên tài khoản/bài kiểm tra **bạn sở hữu hợp pháp**. Không dùng trên tài khoản hay dữ liệu của người khác.

#### 7. KHÔNG PHÂN PHỐI
**Không** phân phối, bán, cho thuê, chia sẻ script dưới bất kỳ hình thức nào. Chia sẻ khiến bạn chịu trách nhiệm pháp lý về hành vi của người nhận.

#### 8. KHÔNG MỤC ĐÍCH THƯƠNG MẠI
Nghiêm cấm dùng cho mục đích thương mại: bán "VIP giá rẻ", "hack azota", hay bất kỳ hình thức kiếm tiền nào.

#### 9. CHẤP NHẬN MỌI RỦI RO
Bạn **đã được cảnh báo đầy đủ** và đồng ý **không khởi kiện, không khiếu nại, không đòi bồi thường** tác giả trong bất kỳ trường hợp nào.

#### 10. CAM KẾT XÓA KHI CÓ YÊU CẦU
Nếu azota.vn hoặc cơ quan chức năng yêu cầu xoá, bạn cam kết tuân thủ ngay lập tức.

> **⚠️ KHÔNG AI CÓ THỂ BẢO VỆ BẠN KHỎI HẬU QUẢ PHÁP LÝ — KỂ CẢ TÁC GIẢ.**
> Bạn đã được cảnh báo. Cân nhắc kỹ trước khi sử dụng.

---

### ⚡ Hướng dẫn cài đặt

> Script **chạy hoàn toàn tự động trong nền** sau khi cài. Không menu, không nút bấm, không cấu hình.

**Bước 1 — Cài Tampermonkey:** [Chrome/Edge/Brave](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) · [Firefox](https://addons.mozilla.org/vi/firefox/addon/tampermonkey/) · Android: [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) + Tampermonkey

> ⚠️ **Lần đầu cài Tampermonkey:** vào `chrome://extensions/` (hoặc `edge://extensions/`) → tìm Tampermonkey → bật **"Allow user scripts"** (bắt buộc, không bật script sẽ không chạy) → bật thêm **"Allow access to file URLs"** nếu bạn tải file `.user.js` về máy. Sau đó refresh lại trang.

**Bước 2 — Cài script:**

| Cách | Cách làm |
|------|----------|
| **A — Tự động (khuyến nghị)** | Mở link raw → Tampermonkey tự nhận → bấm **Install** |
| **B — Từ URL** | Dashboard → tab **Utilities** → ô "Install from URL" → bấm **Install** |
| **C — Thủ công** | Dashboard → **Create a new script** → xoá code mẫu → dán nội dung → **Ctrl+S** |

Link raw:

```
https://raw.githubusercontent.com/skappafrost/azota-vip-bypass/main/src/azota-vip-bypass.user.js
```

**Bước 3 — Xong.** Vào `https://azota.vn` → dùng bình thường. Script tự chạy ngầm.

---

### ✅ Kiểm tra script đã hoạt động

| Cách | Cách làm | Kết quả mong đợi |
|------|----------|------------------|
| **1 — Console** | F12 → tab **Console** | Thấy `[AzotaVIP v2.0.0] ready — intercepting 9 endpoint groups` |
| **2 — Trực quan** | Nhìn trang | Không còn banner quảng cáo, popup "Nâng cấp VIP" |
| **3 — Log chi tiết** | Console → gõ `AzotaVIP` vào ô filter | Danh sách endpoint đã intercept |

---

### ❓ FAQ

**1. Cài xong có cần làm gì thêm không?**
Không. Script chạy hoàn toàn tự động trong nền.

**2. Làm sao biết script hoạt động?**
Console (F12) → tìm `[AzotaVIP v2.0.0] ready`.

**3. Script có làm chậm trình duyệt không?**
Không. Chỉ chạy vài ms mỗi khi có request khớp pattern. Không ảnh hưởng hiệu năng.

**4. Tôi có bị khoá tài khoản không?**
**Có thể.** Script can thiệp API azota.vn, vi phạm ToS. Đọc phần pháp lý ở trên.

**5. Có hoạt động trên điện thoại không?**
Chỉ Android (Kiwi Browser). iOS không hỗ trợ Tampermonkey.

**6. Muốn tắt tạm thời?**
Bấm icon 🎭 → gạt công tắc tắt/bật.

**7. VIP này có thật không?**
**Không.** VIP chỉ **giả ở client-side**. Server vẫn biết bạn không phải VIP. Script chỉ trick trình duyệt của bạn.

**8. Script có cần cập nhật không?**
Có. Nếu azota.vn đổi endpoint, script sẽ ngừng hoạt động. Theo dõi repo để cập nhật.

**9. Báo lỗi / đóng góp ở đâu?**
📧 [skappafrost@gmail.com](mailto:skappafrost@gmail.com) hoặc [GitHub Issues](https://github.com/skappafrost/azota-vip-bypass/issues).

**10. Script an toàn không?**
Không gửi dữ liệu, không đọc cookie, không can thiệp file hệ thống. Nhưng có rủi ro pháp lý (xem phần pháp lý).

---

## 🇬🇧 ENGLISH

### ⚖️ LEGAL DISCLAIMER (10 CLAUSES)

> **⚠️ SERIOUS LEGAL WARNING — READ BEFORE USE**

This script is created **SOLELY FOR EDUCATIONAL AND SECURITY RESEARCH PURPOSES**. It demonstrates how a web application's network layer can be manipulated client-side via Tampermonkey — a technique called **API response interception**.

**BY DOWNLOADING, INSTALLING, OR USING THIS SCRIPT, YOU AGREE TO ALL TERMS BELOW. IF YOU DO NOT AGREE, DO NOT USE.**

**1. SOLE PURPOSE** — Only for security research, analysis, and education. Demonstrates how API responses can be forged client-side — a vulnerability online exam platforms must know about to protect their systems.

**2. LEGAL VIOLATIONS** — This script intercepts and modifies server responses, which may constitute: **CFAA 18 U.S.C. § 1030**; **DMCA § 1201** (anti-circumvention); **Vietnam Penal Code 2015, Article 145** (illegal system access); **Vietnam Decree 15/2020/ND-CP**; **Breach of Terms of Service** of azota.vn; **Theft of Service** laws.

**3. USER ASSUMES FULL LIABILITY** — You and **only you** assume all legal liability: installing/using/distributing; account suspension, academic discipline, expulsion; civil lawsuits or criminal prosecution; fines and damages; device seizure for forensic investigation.

**4. AUTHOR DISCLAIMS ALL LIABILITY** — The author (**@skappafrost**, **nexus**, **isvn**) and all contributors **ASSUME NO LIABILITY WHATSOEVER**: direct, indirect, incidental, consequential damages; data/account/educational loss; legal fees, court costs, settlements; emotional distress, reputational harm.

**5. NO AUTHORIZATION** — This script is **NOT** authorized, endorsed, or supported by azota.vn. Using it violates Azota's ToS and may result in **permanent account termination**.

**6. YOUR SYSTEMS ONLY** — Only run on accounts and tests you **legally own**. Never on someone else's account or data.

**7. NO REDISTRIBUTION** — Do **not** distribute, sell, rent, or share this script. Sharing makes you liable for the recipient's actions.

**8. NON-COMMERCIAL** — Forbidden for any commercial purpose: selling "cheap VIP", "azota hack" services, or any monetisation.

**9. ACCEPT ALL RISKS** — You have been **fully warned** and agree to **never sue, complain, or claim compensation** from the author under any circumstance.

**10. DELETE ON DEMAND** — If azota.vn or authorities request removal, you commit to comply immediately.

> **⚠️ NO ONE CAN PROTECT YOU FROM LEGAL CONSEQUENCES — NOT EVEN THE AUTHOR.**
> You have been warned. Think carefully before using.

### Installation (EDUCATIONAL USE ONLY)

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Open the raw script: `src/azota-vip-bypass.user.js`
3. Tampermonkey will prompt installation → click **Install**

Or manually: Dashboard → "Create a new script" → delete template → paste entire content of `src/azota-vip-bypass.user.js` → **Ctrl+S**

---

## 🔬 Phân tích kỹ thuật / Technical Analysis

### Kiến trúc phòng thủ bị phá

Azota là một **Angular SPA**. Mọi quyết định "có cho phép tính năng X không" được thực hiện ở **3 lớp**, và script này nhắm vào lớp cuối:

```
┌────────────────────────────────────────────────────────────────┐
│  Lớp 1: Backend (không thể intercept)                          │
│  ─ Server kiểm tra quyền thật khi xử lý request.               │
│    Vd: khi bạn bấm "Nộp bài", server ghi điểm theo token thật. │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP response (JSON)
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Lớp 2: API Response ← MỤC TIÊU CỦA SCRIPT NÀY                 │
│  ─ Response JSON chứa cờ: data.isVip, data.mustViewAds...      │
│  ─ Script hook XHR/fetch để SỬA cờ này trước khi Angular đọc.  │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Lớp 3: Angular Component                                     │
│  ─ Đọc response → quyết định render: hiện quảng cáo? khoá nút? │
│  ─ Nhận cờ đã bị sửa → render sai theo ý script.               │
└────────────────────────────────────────────────────────────────┘
```

### 3 kỹ thuật chính

**1. XMLHttpRequest interception** (Angular `HttpXhrBackend` dùng XHR)

```javascript
// Bắt URL trong open()
const origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
    this._aztUrl = arguments[1];
    return origOpen.apply(this, arguments);
};

// Sửa response sau khi server trả về (readyState === 4)
const origSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function () {
    // ... thêm listener readystatechange, gán this._aztFake
};

// Override getter để Angular đọc response đã sửa
Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
    get() {
        if (this._aztFake !== undefined) return this._aztFake;
        return descText.get.call(this);
    },
});
```

**2. Fetch API interception** (dự phòng nếu app dùng `withFetch()`)

```javascript
const origFetch = window.fetch;
window.fetch = function (input, init) {
    // Nếu URL khớp pattern → trả Response giả thay vì gọi server
    return Promise.resolve(new Response(build(name, url), {
        status: 200, statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
    }));
};
```

**3. DOM cleanup + chặn inject quảng cáo**

```javascript
// Chặn ngay lúc Angular cố append <script src="...shopie...">
const origAppend = Node.prototype.appendChild;
Node.prototype.appendChild = function (node) {
    if (node.tagName === 'SCRIPT' && /shopie|googlesyndication/i.test(node.src)) {
        return node;  // không append
    }
    return origAppend.apply(this, arguments);
};
// + MutationObserver ẩn banner/popup nâng cấp còn sót lại
```

### Bảng endpoint intercept (verify live 2026-09-15)

| Endpoint | Response thật | Sửa thành | Mục đích |
|---|---|---|---|
| `/api/FrontVip/CheckVipObject?objectType=exam` | `data:false` | `data:true` | UI tin bài thi do VIP tạo |
| `/api/FrontExam/MustViewAds` | `data:true` | `data:false` | Bỏ yêu cầu xem quảng cáo |
| `/api/VipPackage/GetMyPackage` | `isVipStudent:false` | full VIP subscription | UI VIP |
| `/api/VipPackage/GetPackageObjs` | `objs:[]` | gói unlimited | UI danh sách gói |
| `/api/VipMustUpgrade/CheckVipMustUpgrade` | — | `data:false` | Xoá popup nâng cấp |
| `/ai/api/v1/student-practice/can-attempt-exam` | `value:true` | `value:true` | Giữ nguyên (đã mở) |
| `/api/PayAsGoPayment/GetCurrentPoint` | `totalPoint:0` | `totalPoint:999999` | UI điểm dùng |
| `/azota-adsword/.../FrontProduct/ListRandomProducts` | ads objs | `objs:[]` | **Không còn quảng cáo render** |
| `/azota-adsword/.../FrontProduct/ViewProductAds` | `status:1` | `status:1` | Passthrough an toàn |
| DOM elements | — | ẩn bằng CSS | Xoá banner/popup |

### 📌 Kết quả verify thực tế (2026-09-15)

Đợt nghiên cứu gần nhất trên exam `rdojsx` (Vật Lí 11) cho thấy **một điều trái với kỳ vọng**:

| Kỳ vọng | Thực tế |
|---|---|
| "Bắt đầu thi" bị paywall chặn | ❌ **KHÔNG.** Click → `CheckVipObject` + `MustViewAds` + `can-attempt-exam` → `FrontExam/InitData` → **377 câu hỏi load bình thường** |
| "Bỏ quảng cáo" là nút mở khoá | ❌ Chỉ là banner quảng cáo |
| Có combo-package paywall | ❌ Không thấy endpoint combo nào được gọi cho exam này |

**Hàm gate trong bundle** (`main.f318e87f56919157.js`):

```javascript
checkDocumentCreatedByVip() {
    // gate = CheckVipObject.data && !MustViewAds.data
    combineLatest([checkVipObject(hashId, 'exam'), mustViewAds(hashId)])
      .subscribe(([vip, ads]) => next(vip.data && !ads.data));
}
checkIsVipForAzotaAds() {
    // nếu vipSubscriptionObj.isVipStudent → không load ads
    // ngược lại → checkDocumentCreatedByVip()
}
```

→ Script này thực sự giải quyết: **quảng cáo** (shopie + Google AdSense) và **UI paywall VIP**. Nó không (và không cần) "mở khoá" việc bắt đầu thi, vì gate đó bản thân nó đã mở.

### ⚠️ Limitations — giới hạn kỹ thuật

| Kiểu kiểm tra | Intercept được? |
|---|---|
| Frontend UI toggle (ẩn/hiện nút) | ✅ Có |
| Frontend route guard (chuyển hướng sang trang nâng cấp) | ✅ Có |
| **Backend quota check** (giới hạn tải, dung lượng) | ❌ **Không** — server kiểm tra |
| **Backend capability check** (nộp bài, ưu tiên) | ❌ **Không** — server kiểm tra |
| Server verify độc lập VIP status | ❌ Server luôn biết sự thật |

- **Client-side only**: trick được trình duyệt của bạn, không trick được server.
- **Detection possible**: server có thể đối chiếu claim VS server state.
- **No persistence**: reload page → tất cả intercept chạy lại từ đầu.
- **Endpoint drift**: azota.vn đổi endpoint → script chết, cần cập nhật.

---

## 📁 Project Structure

```
azota-vip-bypass/
├── src/
│   └── azota-vip-bypass.user.js   # Main Tampermonkey script (v2.0.0)
├── scripts/
│   ├── create_repo.py             # Repo bootstrap helper
│   └── insert_guide_v2.py         # README generator helper
├── .github/ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── README.md                      # This file
├── LICENSE                        # MIT (NO WARRANTY)
└── package.json
```

## 🔒 Ghi chú phòng thủ / Defensive Notes

Repo này tồn tại để minh hoạ **một bài học bảo mật cụ thể**:

1. **Không bao giờ tin response ở client.** Mọi quyết định phân quyền phải được **server kiểm tra lại** ở đúng lúc xử lý request. UI chỉ là gợi ý, không phải sự thật.
2. **Quảng cáo dựa trên cờ response** (`MustViewAds`, `showForVip`) là **bảo mật giả**: xoá cờ ở client = xoá quảng cáo. Nếu doanh thu phụ thuộc vào nó, phải verify server-side ở điểm serving, không phải ở UI.
3. **Response schema là thông tin nhạy cảm.** Bundle JS để lộ toàn bộ endpoint + tên field (`isVipStudent`, `vipSubscriptionObj`, `mustViewAds`...), kẻ tấn công chỉ việc map ngược lại. Obfuscate bundle và dùng field tên ngẫu nhiên/đổi phiên bản để tăng chi phí.
4. **Tampermonkey chạy isolated world, CSP không chặn được.** Nếu cần chống injection, phải dùng `Content-Security-Policy` + server-side check, không rely vào CSP alone.
5. **Freemium gating phải server-enforced.** Mọi tính năng "VIP" thực sự (tải xuống, dung lượng, export) phải bị từ chối ở backend khi request không có quyền hợp lệ.

---

## 📜 License

**MIT License — NO WARRANTY. USE AT YOUR OWN RISK. THE AUTHOR ASSUMES NO LIABILITY.** Xem [LICENSE](LICENSE).

---

<div align="center">

### ⭐ ỦNG HỘ DỰ ÁN

Nếu repo này giúp bạn hiểu thêm về bảo mật web, hãy **star** ⭐ để ủng hộ.

Mọi góp ý / báo lỗi / đề xuất: **📧 [skappafrost@gmail.com](mailto:skappafrost@gmail.com)**

⚠️ **FOR EDUCATIONAL RESEARCH ONLY** · Use at your own risk · The author assumes no liability

</div>
