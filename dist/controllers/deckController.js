"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeck = exports.deleteDeck = exports.getDeck = exports.getAllDecks = exports.createDeck = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
// get all decks
const getAllDecks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allDecks = yield index_1.Deck.find({}).sort({ createdAt: -1 });
    res.status(200).json(allDecks);
});
exports.getAllDecks = getAllDecks;
// get a single deck
const getDeck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No deck found and save crash' });
    }
    else {
        const deck = yield index_1.Deck.findById(id);
        if (!deck) {
            return res.status(404).json({ error: 'No deck found' });
        }
        res.status(200).json(deck);
    }
});
exports.getDeck = getDeck;
// create new deck
const createDeck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, numberOfCards } = req.body;
    try {
        const deck = yield index_1.Deck.create({ title, numberOfCards });
        res.status(200).json(deck);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
});
exports.createDeck = createDeck;
// delete a deck
const deleteDeck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No deck found and save crash' });
    }
    const deck = yield index_1.Deck.findOneAndDelete({ _id: id });
    if (!deck) {
        return res.status(400).json({ error: 'No deck found' });
    }
    res.status(200).json(deck);
});
exports.deleteDeck = deleteDeck;
// update deck
const updateDeck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No deck found and save crash' });
    }
    const deck = yield index_1.Deck.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
    if (!deck) {
        return res.status(400).json({ error: 'No deck found' });
    }
    res.status(200).json(deck);
});
exports.updateDeck = updateDeck;
