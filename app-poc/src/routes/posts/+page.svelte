<script lang="ts">
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  export let data;
  let posts = data.posts;

  async function savePost(event) {
    event.preventDefault();
    const title = event.target.title.value.trim();
    if (!title) return;

    if (navigator.onLine) {
      // online → send to server
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      posts = [...posts, { title }];
    } else {
      // offline → store locally
      const db = await openDB('offline-db', 1, {
        upgrade(db) {
          db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
        }
      });
      const tx = db.transaction('pending', 'readwrite');
      await tx.store.add({ title });
      await tx.done;

      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('sync-posts');

      alert('You are offline — post will sync when back online.');
    }

    event.target.reset();
  }

  onMount(() => {
    console.log('Posts loaded:', posts);
  });
</script>

<h1>Posts</h1>

<form on:submit={savePost}>
  <input name="title" placeholder="New post title" />
  <button type="submit">Save</button>
</form>

{#each posts as post}
  <p>{post.title}</p>
{/each}
