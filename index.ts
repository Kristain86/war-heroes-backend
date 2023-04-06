/* eslint-disable import/no-extraneous-dependencies */
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import decksRoutes from './routes/decks';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import deckSchema from './models/deckModel';
import userSchema from './models/userModel';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authKeys } from './const/keys';
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

/* passportSetup(); */
app.use((req: Request, res: Response, next: () => void) => {
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.render('home');
});

app.use('/api/decks', decksRoutes);
app.use('/api/auth', authRoutes);

// connect to db
mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URI as string, {})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => console.log(err));

/* const decksDb = mongoose.createConnection(process.env.MONGO_URI as string); */
const usersDb = mongoose.createConnection(process.env.MONGO_URI_USERS as string);

// declare model and connect/create collection (name of collection, schema of collection)

const User = usersDb.model('User', userSchema);

passport.serializeUser((user: any, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: authKeys.AUTH_CLIENT_ID,
      clientSecret: authKeys.AUTH_CLIENT_SECRET,
      callbackURL: authKeys.CALLBACK_URL,
      userProfileURL: authKeys.USER_PROFILE_URL,
      scope: ['profile'],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        console.log(profile);
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});

export { Deck, User };
