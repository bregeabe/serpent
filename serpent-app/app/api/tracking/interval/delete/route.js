import { deleteInterval } from '../../../../../db/utils/sessions/handle-session';

export async function DELETE(req) {
    try {
        const interval = await req.json();
        const msg = await deleteInterval(interval.interval_id);
        return msg;
    } catch (err) {
        console.error('interval deletion error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}