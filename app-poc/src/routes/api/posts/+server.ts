import { json } from '@sveltejs/kit';

export async function GET() {
    const posts = [{ id: 1, title: 'Hello SvelteKit' }];
    return json(posts);
}

export async function POST({ request }: { request: Request }) {
    const data = await request.json();
    return json({ success: true });
}
