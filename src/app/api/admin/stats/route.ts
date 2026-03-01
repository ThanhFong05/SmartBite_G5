import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        // Fetch all users
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('*');

        if (userError) throw userError;

        // Fetch all orders
        const { data: orders, error: orderError } = await supabase
            .from('orders')
            .select('userid, finalamount, ordertime, orderstatus');

        if (orderError) throw orderError;

        // Process users with order stats
        const customers = users?.map(user => {
            const userOrders = orders?.filter(o => o.userid === user.userid) || [];

            // Only count completed orders for revenue? Orderstatus 5 = completed. 
            // In typical systems, accepted/delivering also count, let's sum all non-cancelled.
            // But let's just sum all for simplicity or finalamount.
            const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.finalamount) || 0), 0);
            const orderCount = userOrders.length;

            // Get latest order date
            const sortedOrders = [...userOrders].sort((a, b) => new Date(b.ordertime).getTime() - new Date(a.ordertime).getTime());
            const lastOrderDate = sortedOrders.length > 0 ? sortedOrders[0].ordertime : null;

            return {
                id: user.userid,
                name: user.fullname,
                email: user.email,
                phone: user.phonenumber,
                birthday: user.birthdate,
                address: user.addressdelivery,
                totalSpent: totalSpent,
                orderCount: orderCount,
                lastOrderDate: lastOrderDate
            };
        }) || [];

        // Sort customers by total spent descending
        customers.sort((a, b) => b.totalSpent - a.totalSpent);

        // Overall Stats for Reports
        const totalRevenue = orders?.reduce((sum, o) => sum + (Number(o.finalamount) || 0), 0) || 0;
        const totalOrders = orders?.length || 0;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalCustomers = customers.length;

        // Sales by Date (for simple chart)
        const salesByDate: Record<string, number> = {};
        orders?.forEach(o => {
            if (o.ordertime) {
                const date = new Date(o.ordertime).toISOString().split('T')[0]; // YYYY-MM-DD
                salesByDate[date] = (salesByDate[date] || 0) + (Number(o.finalamount) || 0);
            }
        });

        // Convert dict to sorted array
        const salesTrend = Object.keys(salesByDate).sort().map(date => ({
            date,
            revenue: salesByDate[date]
        })).slice(-7); // Last 7 days with orders

        return NextResponse.json({
            success: true,
            customers,
            stats: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                totalCustomers,
                salesTrend
            }
        });

    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
