import express from 'express';
import { signUpGet, loginPost, signUpPost } from '../controllers/authController';

const router = express.Router();

router.get('/signup', signUpGet);
router.post('/signup', signUpPost);
router.get('/login', () => {});
router.post('/login', loginPost);

export default router;
