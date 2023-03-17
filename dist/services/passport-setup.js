"use strict";
/*

import { User } from '../index';

const passportSetup = () => {
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
        clientID: process.env.AUTH_CLIENT_ID as string,
        clientSecret: process.env.AUTH_CLIENT_SECRET as string,
        callbackURL: process.env.AUTH_CALLBACK_URL as string,
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
                console.log('created new user', accessToken, refreshToken);
                done(null, newUser);
              });
          }
        });

        console.log(request, profile);
      }
    )
  );

 
};

export default passportSetup; */
