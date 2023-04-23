/* eslint-disable import/no-extraneous-dependencies */
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import SeriesRoutes from './routes/series';
import CardsRoutes from './routes/cards';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import passport from 'passport';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authKeys } from './const/keys';
import { User } from './models/userModel';
import jwt from 'jsonwebtoken';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, CALLBACK_URL } = authKeys;

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

passport.use(
  new GoogleStrategy(
    {
      clientID: AUTH_CLIENT_ID,
      clientSecret: AUTH_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : '',
          avatar: profile.photos ? profile.photos[0].value : '',
        });
        await newUser.save();
        return done(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req?.user?._id }, 'secret-key');
    res.header('Access-Control-Allow-Origin', '*');
    res.redirect(`http://localhost:3001?${token}`);
  }
);

app.get('/api/current_user', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Se requiere un token de autenticación válido.' });
  }

  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err || typeof decoded === 'string') {
      return res.status(401).json({ error: 'Token de autenticación no válido.' });
    }

    const userId = decoded?.userId;

    User.findById(userId, (errFind: Error, user: IUSer) => {
      if (errFind) {
        return res.status(500).json({ error: 'Error al buscar el usuario.' });
      }

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.json({ user });
    });
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3001');
});

// add deck to user
app.get('/api/add-deck', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const decksToAdd = req.body.decks;

  if (!token) {
    return res.status(401).json({ error: 'Se requiere un token de autenticación válido.' });
  }

  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err || typeof decoded === 'string') {
      return res.status(401).json({ error: 'Token de autenticación no válido.' });
    }

    const userId = decoded?.userId;

    User.findOneAndUpdate(
      { _id: userId },
      { $push: { decks: { $each: decksToAdd } } },
      { new: true },
      (ErrorFind, user) => {
        if (ErrorFind) {
          console.error(ErrorFind);
          res.status(500).send('Error interno del servidor');
        } else if (!user) {
          res.status(404).send('Usuario no encontrado');
        } else {
          res.json(user);
        }
      }
    );
  });
});

// remove deck from user
app.delete('/api/delete-deck', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const { deckId } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Se requiere un token de autenticación válido.' });
  }

  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err || typeof decoded === 'string') {
      return res.status(401).json({ error: 'Token de autenticación no válido.' });
    }

    const userId = decoded?.userId;

    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { decks: { _id: deckId } } },
      { new: true },
      (errFind, user) => {
        if (errFind) {
          console.error(errFind);
          res.status(500).send('Error');
        } else if (!user) {
          res.status(404).send('User no encontrado');
        } else {
          res.json(user);
        }
      }
    );
  });
});

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
