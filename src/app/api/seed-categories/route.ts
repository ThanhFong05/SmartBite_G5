import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Define default categories
        const categories = [
            { categoryid: 'food', categoryname: 'Food' },
            { categoryid: 'drinks', categoryname: 'Drinks' },
            { categoryid: 'dessert', categoryname: 'Dessert' }
        ];

        // Upsert categories into the 'categories' table
        const { data, error } = await supabase
            .from('categories')
            .upsert(categories, { onConflict: 'categoryid' })
            .select();

        if (error) {
            console.error("Seed error:", error);
            throw error;
        }

        return NextResponse.json({
            message: 'Seed categories successful! You can now close this tab and refresh the Admin page.',
            data
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
