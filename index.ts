import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import decksRoutes from './routes/decks';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import deckSchema from './models/deckModel';
import userSchema from './models/userModel';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// middleware
app.use(express.json());

app.use((req: Request, res: Response, next: () => void) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/decks', decksRoutes);
app.use('/api/auth', authRoutes);

// connect to db
mongoose.set('strictQuery', false);

const decksDb = mongoose.createConnection(process.env.MONGO_URI as string);
const usersDb = mongoose.createConnection(process.env.MONGO_URI_USERS as string);

// declare model and creates collection (name of collection, schema of collection)
const Deck = decksDb.model('Deck', deckSchema);
const User = usersDb.model('User', userSchema);

app.listen(port, () => {
  console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});

export { Deck, User };
