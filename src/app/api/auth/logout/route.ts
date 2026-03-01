import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');

    // Đăng xuất khỏi Supabase (xóa cookies session)
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
}
