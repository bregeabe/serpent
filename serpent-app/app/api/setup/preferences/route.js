import { upsert_external_usernames, getUserIdFromUsername } from '../../../../db/utils/account/usernames';

export async function POST(req) {
    try {
        const body = await req.json();
        const leetcode_username = body.leetcode_username;
        const github_username = body.github_username;
        const userId = await getUserIdFromUsername(body.username);
        const { status, message } = await upsert_external_usernames(userId, leetcode_username, github_username);

        if (status) {
            return new Response(JSON.stringify({ message }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message }), { status: 401 });
        }
    } catch (err) {
        console.error('upserting external username error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
