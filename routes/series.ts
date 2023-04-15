import express from 'express';
import {
  createSerie,
  getAllSeries,
  getSerie,
  deleteSerie,
  updateSerie,
} from '../controllers/serieController';

const router = express.Router();

router.get('/', getAllSeries);
router.get('/:id', getSerie);
router.post('/create-deck', createSerie);
router.delete('/:id', deleteSerie);
router.patch('/:id', updateSerie);

export default router;
