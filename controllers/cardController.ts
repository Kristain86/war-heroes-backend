import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Card } from '../models/cardsModel';
import { Serie } from '../models/serieModel';

const getAllCards = async (req: Request, res: Response) => {
  const allCards = await Card.find({}).sort({ createdAt: -1 });
  res.status(200).json(allCards);
};

const getCardsBySerie = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No Serie found and save crash' });
  } else {
    const serie = await Serie.findById(id);

    if (!serie) {
      return res.status(404).json({ error: 'No serie found' });
    }

    const allCards = await Card.find({}).sort({ createdAt: -1 });

    const cardsOfSerie = allCards.filter((elem) =>
      serie.cards.find(({ id: id2 }) => elem.id === id2)
    );

    res.status(200).json(cardsOfSerie);
  }
};

const getCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No Card found and save crash' });
  } else {
    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({ error: 'No card found' });
    }
    res.status(200).json(card);
  }
};

const createCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.create(req.body);
    res.status(200).json(card);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
};

const deleteCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No card found and save crash' });
  }

  const card = await Card.findOneAndDelete({ _id: id });

  if (!card) {
    return res.status(400).json({ error: 'No card found' });
  }
  res.status(200).json(card);
};

const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No Card found and save crash' });
  }

  const card = await Card.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!card) {
    return res.status(400).json({ error: 'No card found' });
  }
  res.status(200).json(card);
};

export { createCard, getAllCards, getCard, deleteCard, updateCard, getCardsBySerie };
