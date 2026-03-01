import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data?.user) {
            // Tự động đồng bộ vào bảng 'users' (Lowercase)
            const user = data.user;
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User";

            // Generate a random 10-digit phone number starting with '0' to avoid UNIQUE constraint errors
            const randomPhone = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();

            const { error: upsertError } = await supabase.from('users').upsert({
                userid: user.id,
                email: user.email,
                fullname: name,
                birthdate: '2000-01-01',
                phonenumber: randomPhone,
                addressdelivery: 'Chưa cập nhật'
            }, { onConflict: 'userid' });
            
            if (upsertError) {
                console.error('OAuth sync user upsert error:', upsertError);
            }

            // Xác định xem redirect về đâu. Mặc định là trang chủ '/'
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('OAuth exchange error:', error)
        }
    } else {
        console.error('OAuth callback missing code')
    }

    // Nếu có lỗi thì về trang bị lỗi đăng nhập
    return NextResponse.redirect(`${origin}/auth/login?error=oauth-failed`)
}
