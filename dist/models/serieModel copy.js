"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Cards = new Schema({
    id: String,
});
const SerieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    cards: [Cards],
}, {
    timestamps: true,
});
exports.Serie = mongoose_1.default.model('Serie', SerieSchema);
