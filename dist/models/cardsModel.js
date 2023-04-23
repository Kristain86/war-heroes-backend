"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Ability = new Schema({
    name: String,
    cost: String || Number,
    text: String,
});
const CardsModel = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    element: {
        type: String,
    },
    ability: [Ability],
    attack: {
        type: Number,
    },
    life: {
        type: Number,
    },
    image: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Card = mongoose_1.default.model('Cards', CardsModel);
