"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serieController_1 = require("../controllers/serieController");
const router = express_1.default.Router();
router.get('/', serieController_1.getAllSeries);
router.get('/:id', serieController_1.getSerie);
router.post('/create-deck', serieController_1.createSerie);
router.delete('/:id', serieController_1.deleteSerie);
router.patch('/:id', serieController_1.updateSerie);
exports.default = router;
