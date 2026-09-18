/* Obsluha, která drží Lapzy v telefonu i bez signálu.
   Soubor vyrábí tools/build_web.mjs — needitovat ručně. */

const SKLAD = 'lapzy-bd8420a79934';
const SOUBORY = [
  ".",
  "_expo/static/js/web/index-4ff4d3ede1c8907d840a4749a04696d9.js",
  "apple-touch-icon.png",
  "assets/assets/fonts/Inter_400Regular.51b6ad87261f18b6433ec52871ddfabc.ttf",
  "assets/assets/fonts/Inter_600SemiBold.a5f35888d2da465de352e0dcfaf33324.ttf",
  "assets/assets/fonts/Inter_700Bold.6e237de4f1f413afa2fcc45c77ac343a.ttf",
  "assets/assets/fonts/Inter_800ExtraBold.6016034293c084aa0c056e83938bf1cc.ttf",
  "assets/assets/fonts/Inter_900Black.bcec6eda9700a81ba92c483a2f2c02c1.ttf",
  "favicon.ico",
  "favicon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "manifest.webmanifest"
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SKLAD)
      .then((c) => c.addAll(SOUBORY))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((jmena) => Promise.all(jmena.filter((j) => j !== SKLAD).map((j) => caches.delete(j))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* Otevření aplikace: vždycky ze skladu, ať je signál jakýkoli. */
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('.', { ignoreSearch: true })
        .then((hit) => hit || fetch(req))
        .catch(() => caches.match('.'))
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((odpoved) => {
        /* co se stáhne navíc, rovnou zůstane v telefonu */
        if (odpoved && odpoved.ok && odpoved.type === 'basic') {
          const kopie = odpoved.clone();
          caches.open(SKLAD).then((c) => c.put(req, kopie));
        }
        return odpoved;
      });
    })
  );
});
