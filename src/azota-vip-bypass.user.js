// ==UserScript==
// @name         Azota VIP + Exam Bypass (EDUCATIONAL ONLY)
// @namespace    https://azota.vn/
// @version      1.0
// @description  ⚠️ CHỈ DÙNG CHO MỤC ĐÍCH NGHIÊN CỨU BẢO MẬT - Xem README.md để biết điều khoản pháp lý
// @author       nexus + isvn (educational research)
// @match        https://azota.vn/*
// @match        https://*.azota.vn/*
// @match        https://*.azota.io/*
// @icon         https://azota.vn/favicon.ico
// @run-at       document-start
// @grant        none
// @license      MIT (No Warranty - Use at your own risk)
// ==/UserScript==
// ============================================================================
// ⚠️  CẢNH BÁO PHÁP LÝ — LEGAL WARNING — AVERTISSEMENT JURIDIQUE
// ============================================================================
// THIS SCRIPT IS PROVIDED SOLELY FOR EDUCATIONAL AND SECURITY RESEARCH
// PURPOSES. IT INTERCEPTS AND MODIFIES NETWORK RESPONSES FROM AZOTA.VN
// SERVERS, WHICH MAY VIOLATE:
//
//   - Vietnam Penal Code 2015, Article 145 (Illegal Access to Computer Systems)
//   - Computer Fraud and Abuse Act (CFAA), 18 U.S.C. § 1030
//   - Terms of Service of Azota.vn
//   - Applicable theft-of-service and anti-circumvention laws
//
// BY INSTALLING OR USING THIS SCRIPT, YOU:
//   1. ASSUME ALL LEGAL, CIVIL, AND CRIMINAL LIABILITY
//   2. AGREE NOT TO HOLD THE AUTHOR RESPONSIBLE FOR ANY DAMAGES
//   3. CONFIRM YOU HAVE PERMISSION TO TEST THE TARGET SYSTEM
//   4. ACCEPT THAT YOUR ACCOUNT MAY BE SUSPENDED OR TERMINATED
//   5. UNDERSTAND THIS IS FOR AUTHORIZED SECURITY TESTING ONLY
//
// If you do not agree with ALL of the above, DO NOT install or run this script.
// ============================================================================

(function () {
    'use strict';

    console.log('[AzotaVIP] ⚠️  Loaded — EDUCATIONAL RESEARCH ONLY');

    // ─── Danh sách endpoint cần intercept ──────────────────────────────────
    const URL_PATTERNS = {
        // --- Exam bypass (từ script cũ isvn) ---
        CAN_ATTEMPT_EXAM: /\/ai\/api\/v1\/student-practice\/can-attempt-exam/,
        CHECK_VIP_OBJECT: /\/api\/FrontVip\/CheckVipObject\?.*\bobjectType=exam\b/,
        MUST_VIEW_ADS: /\/api\/FrontExam\/MustViewAds/,

        // --- VIP unlock (từ phân tích bundle) ---
        VIP_GET_MY_PACKAGE: /\/api\/VipPackage\/GetMyPackage/,
        VIP_GET_PACKAGE_OBJS: /\/api\/VipPackage\/GetPackageObjs/,
        BUSINESS_GET_MY_PACKAGE: /\/api\/BusinessPackage\/GetMyPackage/,
        BUSINESS_GET_PACKAGE_OBJS: /\/api\/BusinessPackage\/GetPackageObjs/,
        VIP_MUST_UPGRADE: /\/api\/VipMustUpgrade\/CheckVipMustUpgrade/,
        VIP_PRODUCT: /\/api\/v10\/VipProduct/,
        FRONT_PRODUCT_HIT: /\/api\/v10\/FrontProduct\/HitProduct/,
    };

    function shouldIntercept(url) {
        if (!url || typeof url !== 'string') return false;
        return Object.values(URL_PATTERNS).some(re => re.test(url));
    }

    function processResponse(url, body) {
        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            return body; // không phải JSON → không sửa
        }

        // ─── Exam bypass ───────────────────────────────────────────────────
        if (URL_PATTERNS.CAN_ATTEMPT_EXAM.test(url)) {
            console.log('[AzotaVIP] ✅ can-attempt-exam → value=true');
            data.value = true;
            data.changedBy = 'azota-vip-bypass';
        }
        else if (URL_PATTERNS.CHECK_VIP_OBJECT.test(url)) {
            console.log('[AzotaVIP] ✅ CheckVipObject(exam) → data=true');
            data.data = true;
            data.changedBy = 'azota-vip-bypass';
        }
        else if (URL_PATTERNS.MUST_VIEW_ADS.test(url)) {
            console.log('[AzotaVIP] ✅ MustViewAds → data=false');
            data.data = false;
            data.changedBy = 'azota-vip-bypass';
        }

        // ─── VIP unlock ────────────────────────────────────────────────────
        else if (URL_PATTERNS.VIP_MUST_UPGRADE.test(url)) {
            console.log('[AzotaVIP] ✅ CheckVipMustUpgrade → false');
            data = {
                success: true,
                data: false,
                changedBy: 'azota-vip-bypass',
            };
        }
        else if (
            URL_PATTERNS.VIP_GET_MY_PACKAGE.test(url) ||
            URL_PATTERNS.BUSINESS_GET_MY_PACKAGE.test(url)
        ) {
            console.log('[AzotaVIP] ✅ GetMyPackage → VIP=true');
            data = {
                success: true,
                data: {
                    obj: {
                        isVipTeacher: true,
                        isVipStudent: true,
                        isVipStudentByTeacher: true,
                        vipUserId: '00000000-0000-0000-0000-000000000001',
                        packageType: null,
                        expired: false,
                        startDate: '2024-01-01T00:00:00',
                        endDate: '2099-12-31T23:59:59',
                    },
                    vipSubscriptionObj: {
                        expired: false,
                        startDate: '2024-01-01T00:00:00',
                        endDate: '2099-12-31T23:59:59',
                        isVipTeacher: true,
                        isVipStudent: true,
                        isVipStudentByTeacher: true,
                    },
                    totalPoint: 999999,
                    canUseExportExcel50ByTime: true,
                },
                changedBy: 'azota-vip-bypass',
            };
        }
        else if (URL_PATTERNS.VIP_GET_PACKAGE_OBJS.test(url) || URL_PATTERNS.BUSINESS_GET_PACKAGE_OBJS.test(url)) {
            console.log('[AzotaVIP] ✅ GetPackageObjs → fake packages');
            data = {
                success: true,
                data: {
                    objs: [{
                        id: 'vip-unlimited',
                        name: 'VIP Premium (Unlocked)',
                        type: 'VIP_FOR_TEACHER',
                        price: 0,
                        duration: 'lifetime',
                        features: ['UNLIMITED_DOWNLOAD', 'UNLIMITED_STORAGE', 'NO_ADS', 'PRIORITY'],
                    }],
                },
                changedBy: 'azota-vip-bypass',
            };
        }
        else if (URL_PATTERNS.VIP_PRODUCT.test(url) || URL_PATTERNS.FRONT_PRODUCT_HIT.test(url)) {
            console.log('[AzotaVIP] ✅ VipProduct → isVip=true');
            data = {
                success: true,
                data: { isVip: true },
                changedBy: 'azota-vip-bypass',
            };
        }

        return JSON.stringify(data);
    }

    // ─── 1. Intercept XMLHttpRequest ───────────────────────────────────────
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this._url = arguments[1];
        return origOpen.apply(this, arguments);
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState !== 4) return;
            if (!shouldIntercept(this._url)) return;

            console.log('[AzotaVIP] XHR intercepted:', this._url.split('/api/')[1] || this._url);
            this._fakeResponseText = processResponse(this._url, this.responseText);
        });

        return origSend.apply(this, arguments);
    };

    const origGetResponseText = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype, 'responseText'
    ).get;
    Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
        get: function () {
            if (this._fakeResponseText !== undefined) return this._fakeResponseText;
            return origGetResponseText.call(this);
        },
    });

    const origGetResponse = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype, 'response'
    ).get;
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
        get() {
            if (this._fakeResponseText !== undefined) {
                return JSON.parse(this._fakeResponseText);
            }
            return origGetResponse.call(this);
        },
    });

    // ─── 2. Intercept fetch API ────────────────────────────────────────────
    const origFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string'
            ? input
            : (input instanceof Request ? input.url : '');

        if (!shouldIntercept(url)) {
            return origFetch.apply(this, arguments);
        }

        console.log('[AzotaVIP] Fetch intercepted:', url.split('/api/')[1] || url);

        return origFetch.apply(this, arguments).then(async function (response) {
            const cloned = response.clone();
            const body = await cloned.text();
            const modified = processResponse(url, body);

            return new Response(modified, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        });
    };

    // ─── 3. DOM cleanup — ẩn quảng cáo, popup, banner VIP ──────────────────
    function removeAdsAndPrompts() {
        const selectors = [
            // Quảng cáo
            '[class*="ads"]', '[class*="Ads"]', '[id*="ads"]', '[id*="Ads"]',
            '[class*="shopie"]', '[class*="Shopie"]',
            // Nâng cấp VIP
            '[class*="vip-require"]', '[class*="upgrade"]', '[class*="Upgrade"]',
            '[class*="package-expired"]', '[class*="limit-download"]',
            '[class*="premium"]', '[class*="Premium"]',
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el.offsetParent !== null) {
                    el.style.setProperty('display', 'none', 'important');
                }
            });
        });
    }

    // MutationObserver — quét element mới render từ Angular
    const observer = new MutationObserver(() => removeAdsAndPrompts());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAdsAndPrompts);
    } else {
        removeAdsAndPrompts();
    }

    window.addEventListener('load', () => {
        setTimeout(removeAdsAndPrompts, 500);
        setTimeout(removeAdsAndPrompts, 1500);
        setTimeout(removeAdsAndPrompts, 3000);
    });

    console.log('[AzotaVIP] Ready — intercepting ' + Object.keys(URL_PATTERNS).length + ' endpoint patterns');
})();
