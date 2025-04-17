import {betterAuth} from 'better-auth';
import sql from './db'

export  const auth = betterAuth({
        database:sql,
        emailAndPassword:{
            enabled:true,
        },
        socialProviders:{
            google:{
                clientId:process.env.GOOGLE_CLIENT_ID as string,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
            }
        }
})

export default auth;