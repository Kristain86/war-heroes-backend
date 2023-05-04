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
exports.updateSerie = exports.deleteSerie = exports.getSerie = exports.getAllSeries = exports.createSerie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const serieModel_1 = require("../models/serieModel");
const logger_1 = __importDefault(require("../logger"));
// get all series
const getAllSeries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Petición en SERIES');
    const allSeries = yield serieModel_1.Serie.find({}).sort({ createdAt: -1 });
    res.status(200).json(allSeries);
});
exports.getAllSeries = getAllSeries;
// get a single Serie
const getSerie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No Serie found and save crash' });
    }
    else {
        const serie = yield serieModel_1.Serie.findById(id);
        if (!serie) {
            logger_1.default.error('Mensaje de error', 'No serie found');
            return res.status(404).json({ error: 'No serie found' });
        }
        res.status(200).json(serie);
    }
});
exports.getSerie = getSerie;
// create new serie
const createSerie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, cards } = req.body;
    try {
        const serie = yield serieModel_1.Serie.create({ title, cards });
        res.status(200).json(serie);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
});
exports.createSerie = createSerie;
// delete a serie
const deleteSerie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No Serie found and save crash' });
    }
    const serie = yield serieModel_1.Serie.findOneAndDelete({ _id: id });
    if (!serie) {
        return res.status(400).json({ error: 'No serie found' });
    }
    res.status(200).json(serie);
});
exports.deleteSerie = deleteSerie;
// update Serie
const updateSerie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'No Serie found and save crash' });
    }
    const serie = yield serieModel_1.Serie.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
    if (!serie) {
        return res.status(400).json({ error: 'No Serie found' });
    }
    res.status(200).json(serie);
});
exports.updateSerie = updateSerie;
