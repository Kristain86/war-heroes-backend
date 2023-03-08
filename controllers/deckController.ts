import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Deck } from '../index';

// get all decks
const getAllDecks = async (req: Request, res: Response) => {
  const allDecks = await Deck.find({}).sort({ createdAt: -1 });
  res.status(200).json(allDecks);
};

// get a single deck
const getDeck = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No deck found and save crash' });
  } else {
    const deck = await Deck.findById(id);

    if (!deck) {
      return res.status(404).json({ error: 'No deck found' });
    }
    res.status(200).json(deck);
  }
};

// create new deck
const createDeck = async (req: Request, res: Response) => {
  const { title, numberOfCards } = req.body;
  try {
    const deck = await Deck.create({ title, numberOfCards });
    res.status(200).json(deck);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
};

// delete a deck
const deleteDeck = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No deck found and save crash' });
  }

  const deck = await Deck.findOneAndDelete({ _id: id });

  if (!deck) {
    return res.status(400).json({ error: 'No deck found' });
  }
  res.status(200).json(deck);
};

// update deck
const updateDeck = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No deck found and save crash' });
  }

  const deck = await Deck.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!deck) {
    return res.status(400).json({ error: 'No deck found' });
  }
  res.status(200).json(deck);
};

export { createDeck, getAllDecks, getDeck, deleteDeck, updateDeck };
