<script lang="ts">
  export let data;
</script>

<h1>Posts</h1>

{#each data.posts as post}
  <p>{post.title}</p>
{/each}
