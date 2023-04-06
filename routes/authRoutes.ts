import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/login', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect', passport.authenticate('google'), (req: Request, res: Response) => {
  // JWT
  res.send(req.user);
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
