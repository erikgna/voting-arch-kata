import { openDB } from "idb";

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-posts") {
    event.waitUntil(sendPendingPosts());
  }
});

async function sendPendingPosts() {
  const db = await openDB("offline-db", 1, {
    upgrade(db) {
      db.createObjectStore("pending", { keyPath: "id", autoIncrement: true });
    },
  });

  const tx = db.transaction("pending", "readwrite");
  const store = tx.store;
  const all = await store.getAll();

  for (const post of all) {
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      console.log("[SW] Sent post:", post.title);
      await store.delete(post.id);
    } catch (err) {
      console.log("[SW] Still offline, will retry later");
      return; // stop trying until next sync
    }
  }

  await tx.done;
}
