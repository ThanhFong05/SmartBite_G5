import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'src/data/dishes.json');

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const dishes = JSON.parse(fileContents);
        return NextResponse.json(dishes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newDish = await request.json();
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const dishes = JSON.parse(fileContents);

        // Simple ID generation
        newDish.id = (dishes.length + 1).toString();
        // Ensure slug is unique or just generated
        if (!newDish.slug) {
            newDish.slug = newDish.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        dishes.push(newDish);

        await fs.writeFile(dataFilePath, JSON.stringify(dishes, null, 2), 'utf8');

        return NextResponse.json(newDish, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
