/* eslint-disable import/no-extraneous-dependencies */
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import decksRoutes from './routes/decks';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import deckSchema from './models/deckModel';
import userSchema from './models/userModel';
/* import passportSetup from './services/passport-setup'; */
import cookieSession from 'cookie-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

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
  console.log(req.path, req.method);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.render('home');
});

app.use('/api/decks', decksRoutes);
app.use('/api/auth', authRoutes);

// connect to db
mongoose.set('strictQuery', false);

const decksDb = mongoose.createConnection(process.env.MONGO_URI as string);
const usersDb = mongoose.createConnection(process.env.MONGO_URI_USERS as string);

// declare model and connect/create collection (name of collection, schema of collection)
const Deck = decksDb.model('Deck', deckSchema);
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
      clientID: '280528556929-1u71emnf1l0j9ql2d3ubthr46po0n600.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8000/api/auth/google/redirect',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scope: ['profile'],
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log('userIs', currentUser);
          done();
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

      console.log(request, profile);
    }
  )
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});

export { Deck, User };
