export async function load({ fetch }: { fetch: (url: string) => Promise<Response> }) {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    return { posts };
}
