import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Hardcoded Admin Credentials
        if (email === 'admin@smartbite.vn' && password === 'admin@123') {
            // Set HTTP-only cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_token', 'secure-admin-token-value', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true, role: 'admin' });
        }

        // Default mock user login (if we want to keep it)
        if (email && password) {
            return NextResponse.json({ success: true, role: 'user' });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
