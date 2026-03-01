import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// PUT /api/cart/[itemId]: Cập nhật số lượng món ăn trong giỏ
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const supabase = await createClient();
        const { itemId } = await params;
        const body = await request.json();
        const { quantity } = body;

        if (quantity <= 0) {
            // 1. Xóa các Toppings liên quan trước
            await supabase
                .from('cartitemtoppings')
                .delete()
                .eq('cartitemid', itemId);

            // 2. Xóa món chính
            const { error: deleteError } = await supabase
                .from('cartitems')
                .delete()
                .eq('cartitemid', itemId);

            if (deleteError) throw deleteError;
            return NextResponse.json({ success: true, message: 'Item removed' });
        }

        const { error: updateError } = await supabase
            .from('cartitems')
            .update({ quantity })
            .eq('cartitemid', itemId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/cart/[itemId]: Xóa một món cụ thể
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const supabase = await createClient();
        const { itemId } = await params;

        // 1. Xóa các Toppings liên quan trước
        await supabase
            .from('cartitemtoppings')
            .delete()
            .eq('cartitemid', itemId);

        // 2. Xóa món chính
        const { error: deleteError } = await supabase
            .from('cartitems')
            .delete()
            .eq('cartitemid', itemId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
