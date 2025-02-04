import 'dotenv/config';
export const PORT = process.env.PORT;
export const saltRounds = process.env.HASH_SALT_ROUNDS;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REF_SECRET = process.env.JWT_REF_SECRET;
export const accessTokenExpiry = 60 * 60 * 1000;
export const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000;
export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY;

