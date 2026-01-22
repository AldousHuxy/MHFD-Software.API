import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV!;
export const PORT: number = Number(process.env.PORT!);
export const CLIENT_URL: string = NODE_ENV === 'production' ? process.env.CLIENT_URL! : 'https://aldoushuxy.github.io';
export const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;

console.log(`Environment: ${NODE_ENV}`);
console.log(`Server Port: ${PORT}`);
console.log(`Client URL: ${CLIENT_URL}`);
console.log(`OpenAI API Key: ${OPENAI_API_KEY ? 'Loaded' : 'Not Loaded'}`);