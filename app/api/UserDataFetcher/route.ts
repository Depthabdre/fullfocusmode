import {NextResponse} from 'next/server';
import {userDataFetcher} from '@/app/actions';

export async function GET() {
    try {
      const data = await userDataFetcher();
      return Response.json(data); // ✅ Always respond with JSON
    } catch (error) {
      return new Response("Failed to fetch user data", { status: 500 });
    }
  }