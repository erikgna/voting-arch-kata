## 1. Next.js (Frontend App)

- **What it is:** Your main web app — written in React/Next.js.
- **What it does:** Builds static pages (SSG) or uses SSR (Server-Side Rendering).
- **Output:** Generates HTML, JS, CSS bundles.
- **Runs where:** During build time (locally or in CI/CD), not at runtime.

## 2. Cloudflare Pages (Static Hosting)

- **What it is**: CDN-based static hosting platform.
- **What it does**:
  - Serves the Next.js build output (HTML, CSS, JS) to users from the nearest edge location.
  - Provides automatic scaling and caching.

## 3. Cloudflare Workers (Edge Functions)

- **What it is**: JavaScript functions that run at Cloudflare’s edge, right next to the CDN.
- **What it does**:
  - Validates and filters requests before they hit your backend or APIs.
- **Common logic**:
  - Auth verification (JWTs, signatures)
  - Rate limiting / anti-bot logic
  - IP-based geofencing
  - Proxying to APIs securely
- **Runs where**: On Cloudflare’s infrastructure — not in the browser.
- **Type**: Server-side logic, but edge-deployed and serverless.

```javascript
export default {
  async fetch(request) {
    const token = request.headers.get("Authorization");
    if (!token || !verifyToken(token)) {
      return new Response("Unauthorized", { status: 401 });
    }
    return fetch("https://api.your-backend.com/vote", request);
  },
};
```

## 4. Service Workers (In the Browser)

- **What it is**: JavaScript that runs in the user’s browser, separate from your web page.
- **What it does:**
  - Caches assets and API responses for offline access or retry on reconnect.
  - Can intercept network requests and decide what to do (fetch from cache, retry later, etc.).
- **Runs where**: In the user’s browser, registered by your frontend app.

```javascript
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("app-cache").then((cache) =>
      cache.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    )
  );
});
```

## 5. IndexedDB (Local Persistence)

- **What it is**: A local database inside the browser (like a mini NoSQL DB).
- **What it does**:
  - Temporarily stores votes or user info locally.
  - Enables “offline first” behavior.
- **Used by**: Your frontend app and/or the Service Worker.

```javascript
const db = await openDB("votes-db", 1, {
  upgrade(db) {
    db.createObjectStore("votes");
  },
});

await db.put(
  "votes",
  { candidateId: "123", timestamp: Date.now() },
  "pendingVote"
);
```

## 6. Cloudflare Channels (Realtime Communication)

- **What it is**: A new service that provides WebSocket-like realtime communication over Cloudflare’s edge.
- **What it does**:
  - Pushes realtime updates (like vote counts, user participation stats, etc.).
  - Handles millions of concurrent connections at global scale.
- **Alternative names:** It’s similar to WebSockets, but managed and edge-optimized.
