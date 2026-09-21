/* ============================================================
   Service Worker — New Day
   ------------------------------------------------------------
   بيخزن نسخة من التطبيق نفسه (الصفحة + الملفات) عشان يشتغل
   حتى من غير إنترنت خالص.

   مهم: لو عدّلت index.html، لازم تزوّد رقم CACHE_NAME تحت
   (v2 → v3) وإلا المستخدمين هياخدوا النسخة القديمة المخزنة
   بدل الجديدة.
   ============================================================ */

const CACHE_NAME = "newday-cache-v2";

const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
];

// 1) التثبيت — خزّن نسخة من كل ملفات التطبيق
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// 2) التفعيل — امسح أي نسخة قديمة من الكاش
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3) كل طلب — استراتيجية Cache-First مع تحديث في الخلفية
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // متلمسش طلبات خارجية (زي Supabase أو الخطوط) — بس ملفات التطبيق نفسه
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // مفيش نت → استخدم النسخة المخزنة

      // لو موجودة في الكاش، هاتها فورًا (أسرع)، وحدّثها في الخلفية من النت
      return cached || networkFetch;
    })
  );
});
