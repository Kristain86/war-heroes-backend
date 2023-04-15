import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Ability = new Schema({
  name: String,
  cost: String || Number,
  text: String,
});

const CardsModel = new Schema<ICard>(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    element: {
      type: String,
    },

    ability: [Ability],

    attack: {
      type: Number,
    },

    life: {
      type: Number,
    },

    image: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

export const Card = mongoose.model('Cards', CardsModel);
