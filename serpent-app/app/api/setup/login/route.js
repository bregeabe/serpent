import { handle_vanilla_login }from '../../../../db/utils/auth/handle-auth';

export async function POST(req) {
    try {
        const body = await req.json();
        const email = body.email;
        const password = body.password;

        const { authenticated, token, message } = await handle_vanilla_login(email, password);

        if (!authenticated) {
            return new Response(JSON.stringify({ message }), { status: 401 });
        }

        return new Response(JSON.stringify({ token, message }), {
            status: 200,
            headers: {
                'Set-Cookie': `token=${token}; HttpOnly; Secure; Path=/; Max-Age=604800`,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
