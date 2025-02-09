import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function authenticateRequest(request) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('bearer ')) {
        return { error: 'Unauthorized', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return { user_id: decoded.userId };
    } catch (error) {
        return { error: 'Invalid token', status: 403 };
    }
}
