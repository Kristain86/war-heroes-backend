"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cardController_1 = require("../controllers/cardController");
const router = express_1.default.Router();
router.get('/', cardController_1.getAllCards);
router.get('/:id', cardController_1.getCardsBySerie);
router.get('/card/:id', cardController_1.getCard);
router.post('/create-card', cardController_1.createCard);
router.delete('/card/:id', cardController_1.deleteCard);
router.patch('/card/:id', cardController_1.updateCard);
exports.default = router;
