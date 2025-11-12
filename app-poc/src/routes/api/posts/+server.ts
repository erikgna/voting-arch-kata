import { json } from '@sveltejs/kit';

let posts = [
    { id: 1, title: 'Hello SvelteKit' },
    { id: 2, title: 'Offline Ready' }
];

export async function GET() {
    return json(posts);
}

export async function POST({ request }: { request: Request }) {
    const data = await request.json();
    posts.push({ id: Date.now(), title: data.title });
    return json({ success: true });
}
