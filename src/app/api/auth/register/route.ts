import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const body = await request.json();
        const { email, password, fullName, phoneNumber, birthDate, address } = body;

        // 1. Đăng ký vào hệ thống Auth của Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

        // 2. Chèn thông tin chi tiết vào bảng users
        if (authData.user) {
            const { error: dbError } = await supabase
                .from('users')
                .insert([{
                    userid: authData.user.id,        // Khớp hoàn toàn với Schema viết thường
                    fullname: fullName,              // Khớp với cột fullname
                    birthdate: birthDate,            // Đảm bảo là YYYY-MM-DD
                    phonenumber: phoneNumber,        // Khớp với cột phonenumber
                    email: email,                    // Khớp với cột email
                    addressdelivery: address         // Khớp với cột addressdelivery
                }]);

            if (dbError) {
                // QUAN TRỌNG: Nếu lưu DB lỗi, xóa User vừa tạo trong Auth để họ có thể đăng ký lại
                // Bước này yêu cầu dùng Service Role Key nếu muốn xóa từ Server, 
                // hoặc đơn giản là thông báo để bạn vào xóa tay khi test.
                console.error("Lỗi Database:", dbError.message);

                return NextResponse.json({
                    error: `Lỗi lưu Database: ${dbError.message}. Vui lòng thử lại với email khác hoặc xóa user cũ.`
                }, { status: 400 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}