import express from 'express';
import {
  createCard,
  getAllCards,
  getCard,
  deleteCard,
  updateCard,
  getCardsBySerie,
} from '../controllers/cardController';

const router = express.Router();

router.get('/', getAllCards);
router.get('/:id', getCardsBySerie);
router.get('/card/:id', getCard);
router.post('/create-card', createCard);
router.delete('/card/:id', deleteCard);
router.patch('/card/:id', updateCard);

export default router;
