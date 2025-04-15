import sql from './db'

async function createUsersTable(){
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`CREATE TABLE IF NOT EXISTS users(
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                );`;
                console.log('✅ users table created!');
                
    await sql `CREATE TABLE IF NOT EXISTS focus_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                session_date DATE NOT NULL,
                duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
                mode VARCHAR(50) NOT NULL
                );`;
                console.log('✅ focus_sessions created!');
    
    createUsersTable().catch(console.error);
}