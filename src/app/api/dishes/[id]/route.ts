import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'src/data/dishes.json');

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = params.id;
        console.log("API Request for Dish ID:", id);

        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const dishes = JSON.parse(fileContents);
        console.log("Dishes loaded:", dishes.length);

        const dish = dishes.find((d: any) => d.id === id);

        if (!dish) {
            return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
        }

        return NextResponse.json(dish);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}
