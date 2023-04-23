"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const deckSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
