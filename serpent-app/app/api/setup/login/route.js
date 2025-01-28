import { handle_vanilla_login }from '../../../../db/utils/auth/handle-auth';

export async function POST(req) {
    try {
        const body = await req.json();
        const email = body.email;
        const password = body.password;

        const { authenticated, message } = await handle_vanilla_login(email, password);

        if (authenticated) {
            return new Response(JSON.stringify({ message }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message }), { status: 401 });
        }
    } catch (err) {
        console.error('Login error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
