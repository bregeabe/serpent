import { handle_signup }from '../../../../db/utils/auth/handle-auth';

export async function POST(req) {
    try {
        const user = await req.json();
        const { created, message } = await handle_signup(user);

        if (created) {
            return new Response(JSON.stringify({ message }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message }), { status: 401 });
        }
    } catch (err) {
        console.error('Signup error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
