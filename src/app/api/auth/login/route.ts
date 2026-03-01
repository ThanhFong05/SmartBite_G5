import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// 1. SỬA IMPORT Ở ĐÂY: Phải dùng server client
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const supabase = await createClient();

        // 1. Đăng nhập bằng Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email, password,
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 401 });
        }

        // 2. Kiểm tra Role ADMIN từ bảng UserRoles
        const { data: userRole } = await supabase
            .from('userroles')
            .select('roleid')
            .eq('userid', authData.user.id)
            .eq('roleid', 'ADMIN')
            .single();

        const isAdmin = !!userRole;

        // 3. Nếu là Admin, cấp token bảo vệ trang Admin
        if (isAdmin) {
            const cookieStore = await cookies();
            cookieStore.set('admin_token', 'secure-admin-token-value', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/',
            });
        }

        // 4. Đảm bảo bản ghi User tồn tại trong bảng 'users' (Upsert)
        // Điều này cực kỳ quan trọng để tránh lỗi Foreign Key Constraint khi tạo giỏ hàng
        const { error: upsertError } = await supabase
            .from('users')
            .upsert({
                userid: authData.user.id,
                email: authData.user.email,
                fullname: email.split('@')[0],
                birthdate: '2000-01-01', // Mặc định nếu thiếu
                phonenumber: '0000000000', // Mặc định nếu thiếu
                addressdelivery: 'Chưa cập nhật' // Mặc định nếu thiếu
            }, { onConflict: 'userid' });

        if (upsertError) {
            console.error('Lỗi khi đồng bộ User Profile:', upsertError);
            // Vẫn cho phép đăng nhập nhưng log lỗi
        }

        // 5. Lấy lại thông tin hoàn chỉnh
        const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('userid', authData.user.id)
            .single();

        const responseUser = {
            userid: authData.user.id,
            email: authData.user.email,
            fullname: userProfile?.fullname || email.split('@')[0],
            phonenumber: userProfile?.phonenumber || "",
            addressdelivery: userProfile?.addressdelivery || ""
        };

        return NextResponse.json({
            success: true,
            role: isAdmin ? 'admin' : 'user',
            user: responseUser
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}