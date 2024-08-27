import 'dotenv/config';
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REF_SECRET = process.env.JWT_REF_SECRET;
export const accessTokenExpiry = 60 * 60 * 1000;
export const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000;
