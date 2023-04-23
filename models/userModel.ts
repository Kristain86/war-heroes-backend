import mongoose from 'mongoose';
const { Schema } = mongoose;

const deckSchema = new mongoose.Schema({
  serie: {
    type: String,
    required: true,
  },
  cards: {
    type: [String],
    required: true,
  },
});

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  decks: {
    type: [deckSchema],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
