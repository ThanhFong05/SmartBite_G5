// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. Khởi tạo response ban đầu
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. Tạo Supabase Client dành cho Middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Cập nhật cookie cho request hiện tại
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    // Cập nhật cookie cho response trả về
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. Quan trọng: Kiểm tra/Làm mới session
    // Việc gọi getUser() giúp đảm bảo Auth token luôn hợp lệ
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 4. (Tùy chọn) Bảo vệ các route Admin
    // Nếu user vào trang /admin mà không có role 'admin' thì đá về trang chủ
    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        user?.user_metadata?.role !== 'admin'
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

// LƯU Ý: KHÔNG ĐẶT "export const config" Ở ĐÂY.
// Nó phải nằm ở file middleware.ts tại thư mục GỐC dự án.