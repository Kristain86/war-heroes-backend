import express, { Request, Response } from 'express';
import passport from 'passport';
import { signUpGet, loginPost, signUpPost } from '../controllers/authController';

const router = express.Router();

router.get('/signup', signUpGet);
router.post('/signup', signUpPost);

router.get('/login', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect', passport.authenticate('google'), (req: Request, res: Response) => {
  /*     res.send(JSON.parse(req.user)); */
  console.log(res);
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.post('/login', loginPost);

export default router;
