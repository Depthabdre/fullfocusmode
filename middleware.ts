import {NextRequest , NextResponse} from 'next/server';
import {getSessionCookie} from 'better-auth/cookies';


export async function middleware(request: NextRequest){
        const sessionCookies = getSessionCookie(request);
        if (!sessionCookies){
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();

}

export const config = {
    matcher : ["/"],
}