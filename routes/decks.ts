import express from 'express';
import {
  createDeck,
  getAllDecks,
  getDeck,
  deleteDeck,
  updateDeck,
} from '../controllers/deckController';

const router = express.Router();

router.get('/', getAllDecks);
router.get('/:id', getDeck);
router.post('/create-deck', createDeck);
router.delete('/:id', deleteDeck);
router.patch('/:id', updateDeck);

export default router;
