import {NextResponse} from 'next/server';
import {userDataFetcher} from '@/app/actions';
export async function GET(){
    const user = await userDataFetcher();
    return NextResponse.json(user);

}