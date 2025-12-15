import express, { Application, Request, Response, json, urlencoded } from 'express';
import { CLIENT_URL, PORT } from './env';
import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorMiddleware';
import { router as openAIRoutes } from './routes/openAIRoutes';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: CLIENT_URL }));
app.use(logger);

app.get('/', (req: Request, res: Response) => res.status(200).json(`Success: ${new Date().toISOString()}`));
app.get('/api', (req: Request, res: Response) => res.status(200).json('Welcome to the LOMC Chatbot API!'));

app.use('/api/openai', openAIRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`listening for request at http://localhost:${PORT}`));