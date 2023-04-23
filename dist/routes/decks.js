"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deckController_1 = require("../controllers/deckController");
const router = express_1.default.Router();
router.get('/', deckController_1.getAllDecks);
router.get('/:id', deckController_1.getDeck);
router.post('/create-deck', deckController_1.createDeck);
router.delete('/:id', deckController_1.deleteDeck);
router.patch('/:id', deckController_1.updateDeck);
exports.default = router;
