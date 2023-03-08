import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const deckSchema = new Schema<IDeck>(
  {
    title: {
      type: String,
      required: true,
    },

    numberOfCards: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default deckSchema;
