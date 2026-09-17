// ==UserScript==
// @name         Azota Ads + VIP Interceptor (2026-09 rebuild)
// @namespace    azota.vn
// @version      2.0.0
// @description  [NGHIÊN CỨU BẢO MẬT / EDUCATIONAL RESEARCH ONLY] Loại bỏ quảng cáo & paywall VIP phía client trên azota.vn
// @author       nexus + isvn
// @match        *://azota.vn/*
// @match        *://*.azota.vn/*
// @match        *://*.azota.io/*
// @icon         https://azota.vn/favicon.ico
// @run-at       document-start
// @grant        none
// @license      MIT (No Warranty - Use at your own risk)
// ==/UserScript==

/*
 * ⚠️ TUYÊN BỐ MIỄN TRÁCH NÁCH / DISCLAIMER ⚠️
 * VI/Script này CHỈ phục vụ mục đích nghiên cứu bảo mật và học thuật (educational
 * security research). Tác giả KHÔNG ủy quyền việc sử dụng script này vào bất kỳ
 * mục đích thương mại nào (bán "VIP rẻ", dịch vụ unlock tính phí, v.v.).
 *
 * Mọi hành vi vi phạm Điều khoản dịch vụ của azota.vn do người dùng tự thực hiện;
 * người dùng CHỊU HOÀN TOÀN TRÁCH NHIỆM pháp lý của mình (bao gồm nhưng không giới
 * hạn Luật Hình sự VN Điều 145, CFAA 18 U.S.C. §1030, DMCA §1201). Tác giả không
 * chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh.
 *
 * Chỉ chạy script này trên TÀI KHOẢN CỦA BẠN. Không phân phối lại. Xóa khi azota.vn
 * hoặc cơ quan chức năng có yêu cầu.
 */

(function () {
    'use strict';

    // ─── Configuration ─────────────────────────────────────────────────
    const DEBUG = true;                       // log ra console (F12) khi intercept
    const HIDE_ADS_DOM = true;                // ẩn element quảng cáo trong DOM
    const HIDE_UPGRADE_DOM = true;            // ẩn popup / banner nâng cấp VIP
    const FAKE_VIP_FOR_ALL_EXAMS = true;      // ép mọi CheckVipObject( exam ) → true

    // ─── Endpoint map (xác minh live 2026-09-15, bundle testbank-mod main.js) ─
    const P = {
        // gates đã live-verify
        CHECK_VIP:        /\/api\/FrontVip\/CheckVipObject(\?|$)/,
        MUST_VIEW_ADS:    /\/api\/FrontExam\/MustViewAds(\?|$)/,
        GET_MY_PACKAGE:   /\/api\/(VipPackage|BusinessPackage)\/GetMyPackage$/,
        GET_PACKAGE_OBJS: /\/api\/(VipPackage|BusinessPackage)\/GetPackageObjs$/,
        VIP_MUST_UPGRADE: /\/api\/VipMustUpgrade\/CheckVipMustUpgrade(\?|$)/,
        CAN_ATTEMPT:      /\/ai\/api\/v1\/student-practice\/can-attempt-exam(\?|$)/,
        CURRENT_POINT:    /\/api\/PayAsGoPayment\/GetCurrentPoint$/,
        // gates quảng cáo (adsword) — ép rỗng để không còn ads nào render
        LIST_RANDOM:      /\/azota-adsword\/api\/v10\/FrontProduct\/ListRandomProducts$/,
        VIEW_ADS:         /\/azota-adsword\/api\/v10\/FrontProduct\/ViewProductAds/,
    };

    // ─── Fake payloads (bám sát schema thật trả về bởi server) ─────────
    const FAKE = {
        // FrontVip/CheckVipObject?hashId=...&objectType=exam
        // thực: {"version":"v1.0","success":1,"code":200,"message":"successful",
        //        "detailMessage":"","errorCode":null,"data":false,"new_user":null}
        CHECK_VIP: {
            version: "v1.0", success: 1, code: 200, message: "successful",
            detailMessage: "", errorCode: null, data: true, new_user: null,
        },
        // FrontExam/MustViewAds?examHashId=...  → data:true ép quảng cáo
        MUST_VIEW_ADS: {
            version: "v1.0", success: 1, code: 200, message: "successful",
            detailMessage: "", errorCode: null, data: false, new_user: null,
        },
        // VipPackage/GetMyPackage (POST body {"vipPackageType":"VIP_FOR_STUDENT"})
        GET_MY_PACKAGE: {
            version: "v1.0", success: 1, code: 200, message: "successful",
            detailMessage: "", errorCode: null, new_user: null,
            data: {
                obj: {
                    vipPackage: {
                        id: 1, name: "VIP Premium", price: 0,
                        type: "VIP_FOR_TEACHER", duration: "lifetime",
                        features: ["UNLIMITED_DOWNLOAD", "UNLIMITED_STORAGE",
                                   "NO_ADS", "PRIORITY", "EXPORT_EXCEL"],
                    },
                    vipSubscriptionObj: {
                        expired: false, isVipTeacher: true, isVipStudent: true,
                        isVipStudentByTeacher: true, packageType: "VIP_FOR_STUDENT",
                        startTime: "2024-01-01T00:00:00",
                        endTime:   "2099-12-31T23:59:59",
                    },
                    subscriptionHistories: [], userConfig: null, showInvoice: false,
                    isVipTeacher: true, isVipStudent: true, isVipStudentByTeacher: true,
                    id: 1, packageType: "VIP_FOR_STUDENT", userId: 1, packageId: 1,
                    startTime: "2024-01-01T00:00:00",
                    endTime:   "2099-12-31T23:59:59",
                },
                totalPoint: 999999,
                canUseExportExcel50ByTime: true,
            },
        },
        // VipMustUpgrade/CheckVipMustUpgrade  → data:false nghĩa là KHÔNG cần nâng cấp
        GET_PACKAGE_OBJS: {
            version: "v1.0", success: 1, code: 200, message: "successful",
            detailMessage: "", errorCode: null, new_user: null,
            data: {
                objs: [{
                    id: "vip-unlimited", name: "VIP Premium (Unlocked)",
                    type: "VIP_FOR_TEACHER", price: 0, duration: "lifetime",
                    features: ["UNLIMITED_DOWNLOAD", "UNLIMITED_STORAGE",
                               "NO_ADS", "PRIORITY", "EXPORT_EXCEL"],
                }],
            },
        },
        VIP_MUST_UPGRADE: {
            version: "v1.0", success: 1, code: 200, message: "successful",
            detailMessage: "", errorCode: null, data: false, new_user: null,
        },
        // ai/student-practice/can-attempt-exam  → thực: {"value":true}
        CAN_ATTEMPT: { value: true },
        // PayAsGoPayment/GetCurrentPoint
        CURRENT_POINT: {
            version: "v1.0", success: 1, code: 200, message: "successful",
            detailMessage: "", errorCode: null, new_user: null,
            data: {
                totalPoint: 999999.0,
                canUseExportExcel50: true,
                canUseExportExcel50ByTime: true,
                pointTransactionTypeObjs: [],
            },
        },
        // adsword ListRandomProducts → danh sách rỗng = không quảng cáo
        LIST_RANDOM: {
            version: "2021_02_25", success: 1, code: 200, message: "successful",
            detailMessage: "", new_user: null, data: { objs: [], total: 0 },
        },
        VIEW_ADS: {
            version: "2021_02_25", success: 1, code: 200, message: "successful",
            detailMessage: "", data: { status: 1 }, new_user: null,
        },
    };

    // objectType=exam mới được ép sang VIP (theo logic checkDocumentCreatedByVip)
    const isExamObject = (u) =>
        /[?&](objectType=)(exam|homework)\b/i.test(u);

    function match(url) {
        if (!url || typeof url !== 'string') return null;
        for (const [name, re] of Object.entries(P)) {
            if (re.test(url)) {
                if (name === 'CHECK_VIP' && !FAKE_VIP_FOR_ALL_EXAMS &&
                    !/[?&]objectType=exam\b/i.test(url)) return null;
                return name;
            }
        }
        return null;
    }

    function build(name, url) {
        const f = JSON.parse(JSON.stringify(FAKE[name]));
        if (name === 'CHECK_VIP' && !isExamObject(url)) {
            // objectType khác exam/homework → trả về false như server
            f.data = false;
        }
        return JSON.stringify(f);
    }

    // ─── 1. XHR interceptor (Angular HttpXhrBackend) ───────────────────
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this._aztUrl = arguments[1];
        return origOpen.apply(this, arguments);
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        const url = this._aztUrl;
        const name = match(url);
        if (!name) return origSend.apply(this, arguments);

        const fake = build(name, url);
        const log = () => {
            if (DEBUG) console.log('%c[AzotaVIP] XHR patched → ' + name,
                'color:#0a0', url);
        };

        // Phương án A: sửa response sau khi server trả về (che đậy request thật)
        this.addEventListener('readystatechange', function () {
            if (this.readyState !== 4) return;
            if (String(this.status).startsWith('2')) {
                this._aztFake = fake;
                log();
            }
        });

        // Phương án B: server lỗi/timeout (401, 403, 5xx, 0) → trả fake ngay
        // để UI không bị kẹt ở màn loading
        this.addEventListener('error', function () { this._aztFake = fake; log(); });
        this.addEventListener('timeout', function () { this._aztFake = fake; log(); });

        return origSend.apply(this, arguments);
    };

    const descText = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype, 'responseText');
    const descResp = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype, 'response');

    Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
        get() {
            if (this._aztFake !== undefined) return this._aztFake;
            return descText.get.call(this);
        },
        configurable: true, enumerable: false,
    });
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
        get() {
            if (this._aztFake !== undefined) {
                try { return JSON.parse(this._aztFake); } catch (e) {}
            }
            return descResp.get.call(this);
        },
        configurable: true, enumerable: false,
    });

    // ─── 2. fetch interceptor (dự phòng khi app dùng withFetch) ────────
    const origFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string'
            ? input
            : (input instanceof Request ? input.url : '');

        const name = match(url);
        if (!name) return origFetch.apply(this, arguments);

        if (DEBUG) console.log('%c[AzotaVIP] fetch patched → ' + name,
            'color:#0a0', url);

        try {
            return Promise.resolve(new Response(build(name, url), {
                status: 200, statusText: 'OK',
                headers: { 'Content-Type': 'application/json' },
            }));
        } catch (e) {
            return origFetch.apply(this, arguments);
        }
    };

    // ─── 3. DOM cleanup — quảng cáo & popup nâng cấp ───────────────────
    const HIDE = HIDE_ADS_DOM ? [
        '.azt_shopie_ads',                 // div bọc script quảng cáo shopie
        'div[class*="azt-ads"]',
        'ins.adsbygoogle',                 // Google AdSense
        'div[data-azt-ads]',
        '[class*="ads-banner"]',
        '[class*="adsByGoogle"]',
    ] : [];
    if (HIDE_UPGRADE_DOM) {
        HIDE.push(
            '[class*="vip-require"]',
            '[class*="package-expired"]',
            '[class*="limit-download"]',
            '[class*="upgrade-popup"]',
            '[class*="combo-package"]'
        );
    }

    function clean() {
        try {
            HIDE.forEach((sel) => {
                document.querySelectorAll(sel).forEach((el) => {
                    if (el.offsetParent !== null || el.tagName === 'SCRIPT') {
                        el.style.setProperty('display', 'none', 'important');
                    }
                });
            });
            // gỡ các <script src=...shopie/google ads> đã inject vào body
            document.querySelectorAll(
                'script[src*="shopie"], script[src*="googlesyndication"], ' +
                'script[src*="doubleclick"]'
            ).forEach((s) => {
                if (s.parentElement) s.parentElement.removeChild(s);
            });
        } catch (e) { /* page tearing down */ }
    }

    // ─── 4. Ngăn inject quảng cáo từ đầu (chặn append <script> ads) ─────
    const origAppend = Node.prototype.appendChild;
    Node.prototype.appendChild = function (node) {
        if (node && node.tagName === 'SCRIPT' && HIDE_ADS_DOM) {
            const s = (node.src || '');
            if (/shopie|googlesyndication|doubleclick|ads/i.test(s)) {
                if (DEBUG) console.log('[AzotaVIP] blocked ads script:', s);
                return node; // không append
            }
        }
        return origAppend.apply(this, arguments);
    };

    // ─── 5. Bootstrap ───────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', clean);
    } else {
        clean();
    }
    window.addEventListener('load', () => {
        clean(); setTimeout(clean, 500); setTimeout(clean, 1500);
        setTimeout(clean, 4000);
    });
    try {
        new MutationObserver(clean).observe(document.documentElement, {
            childList: true, subtree: true,
        });
    } catch (e) {}

    console.log('%c[AzotaVIP v2.0.0] ready — intercepting ' +
        Object.keys(P).length + ' endpoint groups',
        'color:#0a0;font-weight:bold');
})();
