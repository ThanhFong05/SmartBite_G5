import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { orderid, paymentstatus } = body;

        if (!orderid) {
            return NextResponse.json({ error: 'Missing orderid' }, { status: 400 });
        }

        const { error } = await supabase
            .from('payments')
            .update({
                paymentstatus: paymentstatus || 'completed',
                paymentdate: new Date().toISOString()
            })
            .eq('orderid', orderid);

        if (error) throw error;

        // Không tự động cập nhật orderstatus sang 3 nữa, để Admin tự bấm Confirm

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
