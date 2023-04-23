import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Serie } from '../models/serieModel';

// get all series
const getAllSeries = async (req: Request, res: Response) => {
  const allSeries = await Serie.find({}).sort({ createdAt: -1 });
  res.status(200).json(allSeries);
};

// get a single Serie
const getSerie = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No Serie found and save crash' });
  } else {
    const serie = await Serie.findById(id);

    if (!serie) {
      return res.status(404).json({ error: 'No serie found' });
    }
    res.status(200).json(serie);
  }
};

// create new serie
const createSerie = async (req: Request, res: Response) => {
  const { title, cards } = req.body;
  try {
    const serie = await Serie.create({ title, cards });
    res.status(200).json(serie);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
};

// delete a serie
const deleteSerie = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No Serie found and save crash' });
  }

  const serie = await Serie.findOneAndDelete({ _id: id });

  if (!serie) {
    return res.status(400).json({ error: 'No serie found' });
  }
  res.status(200).json(serie);
};

// update Serie
const updateSerie = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No Serie found and save crash' });
  }

  const serie = await Serie.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!serie) {
    return res.status(400).json({ error: 'No Serie found' });
  }
  res.status(200).json(serie);
};

export { createSerie, getAllSeries, getSerie, deleteSerie, updateSerie };
