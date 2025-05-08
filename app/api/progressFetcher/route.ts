import { NextRequest, NextResponse } from 'next/server';
import { previousProgressFetcher } from '@/app/actions';


export async function GET() {
    const users = await previousProgressFetcher();
    return NextResponse.json(users);
}
