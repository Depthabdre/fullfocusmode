import {NextRequest , NextResponse} from 'next/server';
import {getSessionCookies} from 'better-auth/cookies';

export async function middleware(request: NextRequest)