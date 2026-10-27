import 'dotenv/config';

const requireEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
};

export const ENV = {
    PORT: process.env.PORT || '5000',
    MONGO_URI: requireEnv('MONGO_URI'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
