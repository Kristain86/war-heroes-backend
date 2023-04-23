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
exports.getCardsBySerie = exports.updateCard = exports.deleteCard = exports.getCard = exports.getAllCards = exports.createCard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cardsModel_1 = require("../models/cardsModel");
const serieModel_1 = require("../models/serieModel");
const getAllCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allCards = yield cardsModel_1.Card.find({}).sort({ createdAt: -1 });
    res.status(200).json(allCards);
});
exports.getAllCards = getAllCards;
const getCardsBySerie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No Serie found and save crash' });
    }
    else {
        const serie = yield serieModel_1.Serie.findById(id);
        if (!serie) {
            return res.status(404).json({ error: 'No serie found' });
        }
        const allCards = yield cardsModel_1.Card.find({}).sort({ createdAt: -1 });
        const cardsOfSerie = allCards.filter((elem) => serie.cards.find(({ id: id2 }) => elem.id === id2));
        res.status(200).json(cardsOfSerie);
    }
});
exports.getCardsBySerie = getCardsBySerie;
const getCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No Card found and save crash' });
    }
    else {
        const card = yield cardsModel_1.Card.findById(id);
        if (!card) {
            return res.status(404).json({ error: 'No card found' });
        }
        res.status(200).json(card);
    }
});
exports.getCard = getCard;
const createCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const card = yield cardsModel_1.Card.create(req.body);
        res.status(200).json(card);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
});
exports.createCard = createCard;
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No card found and save crash' });
    }
    const card = yield cardsModel_1.Card.findOneAndDelete({ _id: id });
    if (!card) {
        return res.status(400).json({ error: 'No card found' });
    }
    res.status(200).json(card);
});
exports.deleteCard = deleteCard;
const updateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No Card found and save crash' });
    }
    const card = yield cardsModel_1.Card.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
    if (!card) {
        return res.status(400).json({ error: 'No card found' });
    }
    res.status(200).json(card);
});
exports.updateCard = updateCard;
