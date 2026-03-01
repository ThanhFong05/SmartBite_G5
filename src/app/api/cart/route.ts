import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// POST /api/cart: Thêm món ăn vào giỏ hàng
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { userId, foodId, quantity, selectedExtras, note } = body;

        if (!userId || !foodId) {
            return NextResponse.json({ error: 'Missing userId or foodId' }, { status: 400 });
        }

        // 0. Đảm bảo User tồn tại trong bảng 'users' (Self-healing)
        const { data: userProfile } = await supabase
            .from('users')
            .select('userid')
            .eq('userid', userId)
            .single();

        if (!userProfile) {
            // Lấy email từ Auth một cách an toàn
            const { data: { user: authUser } } = await supabase.auth.getUser();
            const email = authUser?.email || "user@example.com";
            const name = authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || email.split('@')[0] || "User";

            // Generate a random 10-digit phone number starting with '0' to avoid UNIQUE constraint errors
            const randomPhone = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();

            const { error: upsertError } = await supabase.from('users').upsert({
                userid: userId,
                email: email,
                fullname: name,
                birthdate: '2000-01-01',
                phonenumber: randomPhone,
                addressdelivery: 'Chưa cập nhật'
            }, { onConflict: 'userid' });

            if (upsertError) {
                console.error('Cart self-healing user upsert error:', upsertError);
            }
        }

        // 1. Kiểm tra hoặc tạo Giỏ hàng (Carts) cho User
        let { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('*')
            .eq('userid', userId)
            .single();

        if (cartError && cartError.code !== 'PGRST116') throw cartError;

        if (!cart) {
            const cartId = `cart-${userId.substring(0, 8)}-${Date.now()}`;
            const { data: newCart, error: createCartError } = await supabase
                .from('carts')
                .insert([{ cartid: cartId, userid: userId, subtotalprice: 0 }])
                .select()
                .single();

            if (createCartError) throw createCartError;
            cart = newCart;
        }

        // 2. Kiểm tra trạng thái món ăn (foodstatus)
        const { data: foodItem, error: foodError } = await supabase
            .from('fooditems')
            .select('foodstatus')
            .eq('foodid', foodId)
            .single();

        if (foodError || !foodItem) {
            return NextResponse.json({ error: 'Món ăn không tồn tại' }, { status: 404 });
        }

        if (foodItem.foodstatus !== 'Available') {
            return NextResponse.json({
                error: foodItem.foodstatus === 'Out of Stock' ? 'Món ăn hiện đang hết hàng' : 'Món ăn đã ngừng kinh doanh'
            }, { status: 400 });
        }

        // 3. Tạo CartItemId mới
        const cartItemId = `ci-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        // 3. Thêm món vào CartItems
        const { error: itemError } = await supabase
            .from('cartitems')
            .insert([{
                cartitemid: cartItemId,
                cartid: cart?.cartid,
                foodid: foodId,
                quantity: quantity || 1,
                note: note || ""
            }]);

        if (itemError) throw itemError;

        // 4. Thêm Toppings vào CartItemToppings (nếu có)
        if (selectedExtras && Array.isArray(selectedExtras) && selectedExtras.length > 0) {
            const toppingInserts = selectedExtras.map((toppingId: string) => ({
                carttoppingid: `ct-${Math.random().toString(36).substring(2, 9)}`,
                cartitemid: cartItemId,
                toppingid: toppingId
            }));

            const { error: toppingError } = await supabase
                .from('cartitemtoppings')
                .insert(toppingInserts);

            if (toppingError) throw toppingError;
        }

        return NextResponse.json({ success: true, cartItemId });

    } catch (error: any) {
        console.error('Cart API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/cart: Lấy danh sách giỏ hàng
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Lấy Cart theo UserId
        const { data: cart } = await supabase
            .from('carts')
            .select('*')
            .eq('userid', userId)
            .single();

        if (!cart) return NextResponse.json({ items: [] });

        // Lấy CartItems kèm thông tin món ăn và toppings
        const { data: items, error: itemsError } = await supabase
            .from('cartitems')
            .select(`
                *,
                fooditems:foodid (*),
                cartitemtoppings (
                    toppingoptions:toppingid (*)
                )
            `)
            .eq('cartid', cart.cartid);

        if (itemsError) throw itemsError;

        return NextResponse.json({ cart, items });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/cart: Xóa toàn bộ giỏ hàng của User
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Lấy CartId của User
        const { data: cart } = await supabase
            .from('carts')
            .select('cartid')
            .eq('userid', userId)
            .single();

        if (cart) {
            // 1. Lấy danh sách CartItemIds thuộc Cart này
            const { data: items } = await supabase
                .from('cartitems')
                .select('cartitemid')
                .eq('cartid', cart.cartid);

            if (items && items.length > 0) {
                const itemIds = items.map(i => i.cartitemid);

                // 2. Xóa tất cả Toppings liên quan đến các món này
                await supabase
                    .from('cartitemtoppings')
                    .delete()
                    .in('cartitemid', itemIds);

                // 3. Bây giờ mới xóa các món trong CartItems
                const { error: deleteError } = await supabase
                    .from('cartitems')
                    .delete()
                    .eq('cartid', cart.cartid);

                if (deleteError) throw deleteError;
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
