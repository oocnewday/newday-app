/* ============================================================
   Service Worker — New Day
   ------------------------------------------------------------
   بيخزن نسخة من التطبيق نفسه (الصفحة + الملفات) عشان يشتغل
   حتى من غير إنترنت خالص.

   مهم: لو عدّلت index.html، لازم تزوّد رقم CACHE_NAME تحت
   (v2 → v3) وإلا المستخدمين هياخدوا النسخة القديمة المخزنة
   بدل الجديدة.
   ============================================================ */

const CACHE_NAME = "newday-cache-v26";
// (ج) مكتبة الدخول (Supabase) جاية من برّه — بنخزّنها عشان التطبيق يفتح بحسابك من غير نت
const CDN_CACHE = "newday-cdn-v1";
const CDN_ALLOW = ["https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"];

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
        keys.filter((k) => k !== CACHE_NAME && k !== CDN_CACHE).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3) استقبال إشعار Push حقيقي من السيرفر وعرضه للمستخدم
//    + إيصال استلام حقيقي: لو الإشعار عليه رقم رسالة، الجهاز بيبلّغ السيرفر إنه وصله فعلًا
const ND_SUPABASE_URL = "https://wymcsdzuwzabjdjpuprc.supabase.co";
const ND_SUPABASE_KEY = "sb_publishable_igUClzy2FNybrF0W5UZwLA_ALedOf4h";

self.addEventListener("push", (event) => {
  let data = { title: "New Day", body: "لديك إشعار جديد", url: "/", nid: null };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {}

  const show = showOrForward(data);

  const ack = data.nid
    ? fetch(`${ND_SUPABASE_URL}/rest/v1/rpc/ack_notification_delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ND_SUPABASE_KEY },
        body: JSON.stringify({ p_id: data.nid }),
      }).catch(() => {})
    : Promise.resolve();

  event.waitUntil(Promise.all([show, ack]));
});

// 3-b) أ6: منع التذكير المكرر — لو التطبيق مفتوح قدام المستخدم وقت التذكير، بيظهر له جوه التطبيق،
//      فمنعرضش الإشعار برّه كمان. ده على كروم/أندرويد بس: آيفون/سفاري وفايرفوكس ممكن يلغوا اشتراك
//      الإشعارات لو وصل إشعار ومتعرضش، فهناك بنعرضه دايمًا. وده للتذكيرات بس — رسايل الأدمن زي ما هي.
function canSkipNotificationWhenVisible() {
  const ua = (self.navigator && self.navigator.userAgent) || "";
  if (/iPhone|iPad|iPod|CriOS|FxiOS|Firefox/i.test(ua)) return false;
  return /Chrome\/|Chromium\//.test(ua);
}

async function showOrForward(data) {
  let visible = [];
  try {
    const list = await clients.matchAll({ type: "window", includeUncontrolled: true });
    visible = list.filter((c) => c.visibilityState === "visible");
  } catch (e) { /* لو حصل أي خطأ، نعرض الإشعار عادي */ }
  const skipOutside = visible.length > 0 && canSkipNotificationWhenVisible();
  if (data.kind === "reminder") {
    if (skipOutside) {
      visible.forEach((c) => c.postMessage({ type: "nd-reminder", slot: data.slot || null }));
      return;
    }
  } else if (data.nid) {
    // (ج) رسالة من الأدمن والتطبيق مفتوح: شريط جوه التطبيق + الجرس يزيد (+ هزّة لو مفيش إشعار برّه).
    // على أندرويد/كروم مابنعرضش الإشعار برّه كمان؛ على آيفون لازم يظهر برّه (قاعدة آبل)
    visible.forEach((c) => c.postMessage({ type: "nd-new-notif", id: data.nid, body: data.body || "", silent: skipOutside }));
    if (skipOutside) return;
  }
  return self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: { url: data.url || "/", nid: data.nid || null },
  });
}

// 4) لما المستخدم يدوس على الإشعار — يفتح/يركّز التطبيق
//    ب3: لو الإشعار مربوط برسالة، التطبيق بيفتح على صفحة تفاصيلها مباشرة
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const d = event.notification.data || {};
  let notifId = d.nid || null;
  if (!notifId && d.url) {
    try { notifId = new URL(d.url, self.location.origin).searchParams.get("notif"); } catch (e) {}
  }
  const targetUrl = notifId ? `./index.html?notif=${encodeURIComponent(notifId)}` : (d.url || "./index.html");
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          // التطبيق مفتوح أصلًا ← نركّزه ونقوله يفتح الرسالة
          if (notifId) client.postMessage({ type: "nd-open-notif", id: notifId });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// 5) كل طلب — استراتيجية Cache-First مع تحديث في الخلفية
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // الطلبات الخارجية (زي Supabase أو الخطوط) منلمسهاش — إلا مكتبة الدخول (تتخزّن للفتح من غير نت)
  if (new URL(event.request.url).origin !== self.location.origin) {
    if (CDN_ALLOW.indexOf(event.request.url) === -1) return;
    event.respondWith(
      caches.open(CDN_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const net = fetch(event.request)
          .then((res) => {
            if (res && (res.ok || res.type === "opaque")) cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    );
    return;
  }

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
