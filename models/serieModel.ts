import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Cards = new Schema({
  id: String,
});

const SerieSchema = new Schema<ISerie>(
  {
    title: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },

    cards: [Cards],
  },

  {
    timestamps: true,
  }
);

export const Serie = mongoose.model('Serie', SerieSchema);
