/* eslint-disable import/no-extraneous-dependencies */
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import decksRoutes from './routes/decks';
import SeriesRoutes from './routes/series';
import CardsRoutes from './routes/cards';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import passport from 'passport';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PATCH, DELETE, PUT',
    allowedHeaders: 'Content-Type, Authorization',
  })
);

// middleware
app.use(express.json());

// set view engine for now
app.set('view engine', 'ejs');

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['thisismycookiekey'],
  })
);

//inititalize passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req: Request, res: Response, next: () => void) => {
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.render('home');
});

app.use('/api/decks', decksRoutes);
app.use('/api/series', SeriesRoutes);
app.use('/api/cards', CardsRoutes);

// connect to db
mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URI as string, {})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});
