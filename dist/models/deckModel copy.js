"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const deckSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    numberOfCards: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Deck = mongoose_1.default.model('Deck', deckSchema);