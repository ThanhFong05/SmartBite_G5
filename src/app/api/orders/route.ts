import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// POST /api/orders: Tạo đơn hàng mới từ giỏ hàng
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { userid, shippingaddress, totalprice, paymentmethod } = body;

        if (!userid) {
            return NextResponse.json({ error: 'Missing userid' }, { status: 400 });
        }

        // 1. Lấy CartId của User
        const { data: cart, error: cartError } = await supabase
            .from('carts')
            .select('cartid')
            .eq('userid', userid)
            .single();

        if (cartError || !cart) {
            return NextResponse.json({ error: 'Cart not found or empty' }, { status: 404 });
        }

        // 2. Lấy danh sách CartItems, kèm giá món chính và các topping (kèm giá topping)
        const { data: cartItems, error: itemsError } = await supabase
            .from('cartitems')
            .select(`
                *,
                fooditems:foodid (price),
                cartitemtoppings (toppingid, toppingoptions:toppingid(price))
            `)
            .eq('cartid', cart.cartid);

        if (itemsError || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // 3. Tạo bản ghi Order mới
        const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        // Frontend sends totalprice = subtotal + 15000 (shipping)
        // Since database calculates finalamount = foodamount + shippingfee, 
        // we must subtract shipping fee from totalprice to get true foodamount
        const shippingFee = 15000;
        const computedFoodAmount = (totalprice || 0) > shippingFee ? (totalprice - shippingFee) : (totalprice || 0);

        const { error: orderError } = await supabase
            .from('orders')
            .insert([{
                orderid: orderId,
                userid: userid,
                foodamount: computedFoodAmount,
                shippingfee: shippingFee,
                orderstatus: 1,              // SMALLINT 1 (Pending)
                deliveryaddress: shippingaddress || 'Chưa cập nhật',
                ordertime: new Date().toISOString()
            }]);

        if (orderError) throw orderError;

        // 4. Chuyển CartItems sang OrderItems và OrderItemToppings
        const orderItemsInserts: any[] = [];
        const orderItemToppingsInserts: any[] = [];

        for (const item of cartItems) {
            const orderItemId = `oi-${Math.random().toString(36).substring(2, 9)}`;

            // Tính giá của các topping
            let extraPrice = 0;
            if (item.cartitemtoppings && Array.isArray(item.cartitemtoppings)) {
                for (const t of item.cartitemtoppings) {
                    const tPrice = t.toppingoptions?.price || 0;
                    extraPrice += tPrice;

                    orderItemToppingsInserts.push({
                        ordertoppingid: `ot-${Math.random().toString(36).substring(2, 9)}`,
                        orderitemid: orderItemId,
                        toppingid: t.toppingid,
                        price: tPrice
                    });
                }
            }

            // UnitPrice trong bản ghi orderitems nên là giá base (theo request thiết kế chuẩn), 
            // hoặc base + extra. Ở đây lưu giá base để rành mạch hóa đơn.
            orderItemsInserts.push({
                orderitemid: orderItemId,
                orderid: orderId,
                foodid: item.foodid,
                quantity: item.quantity,
                unitprice: item.fooditems?.price || 0,
            });
        }

        const { error: insertItemsError } = await supabase
            .from('orderitems')
            .insert(orderItemsInserts);

        if (insertItemsError) throw insertItemsError;

        if (orderItemToppingsInserts.length > 0) {
            const { error: insertToppingsError } = await supabase
                .from('orderitemtoppings')
                .insert(orderItemToppingsInserts);
            if (insertToppingsError) throw insertToppingsError;
        }

        // 5. Khởi tạo Payment
        const paymentId = `pay-${Math.random().toString(36).substring(2, 9)}`;
        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                paymentid: paymentId,
                orderid: orderId,
                amount: totalprice || 0,
                paymentmethod: paymentmethod || 'cash',
                paymentstatus: 'pending',
                paymentdate: new Date().toISOString()
            }]);

        if (paymentError) throw paymentError;

        // 6. Xóa CartItems (Làm sạch giỏ hàng)
        await supabase
            .from('cartitems')
            .delete()
            .eq('cartid', cart.cartid);

        return NextResponse.json({ success: true, orderId });

    } catch (error: any) {
        console.error('Order Creation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/orders: Lấy danh sách đơn hàng (Cho Admin hoặc User)
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get('userid');

        let query = supabase
            .from('orders')
            .select(`
                *,
                users:userid (fullname, email, phonenumber),
                orderitems (*, fooditems:foodid (foodname, foodimageurl), orderitemtoppings (toppingid, price, toppingoptions:toppingid(toppingname))),
                payments (paymentstatus, paymentmethod)
            `)
            .order('ordertime', { ascending: false });

        if (userid) {
            query = query.eq('userid', userid);
        }

        const { data: orders, error } = await query;

        if (error) throw error;

        return NextResponse.json({ orders });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
