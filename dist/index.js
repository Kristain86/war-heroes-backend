"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Deck = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const decks_1 = __importDefault(require("./routes/decks"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const deckModel_1 = __importDefault(require("./models/deckModel"));
const userModel_1 = __importDefault(require("./models/userModel"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// middleware
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.use('/api/decks', decks_1.default);
app.use('/api/auth', authRoutes_1.default);
// connect to db
mongoose_1.default.set('strictQuery', false);
const decksDb = mongoose_1.default.createConnection(process.env.MONGO_URI);
const usersDb = mongoose_1.default.createConnection(process.env.MONGO_URI_USERS);
// declare model and creates collection (name of collection, schema of collection)
const Deck = decksDb.model('Deck', deckModel_1.default);
exports.Deck = Deck;
const User = usersDb.model('User', userModel_1.default);
exports.User = User;
app.listen(port, () => {
    console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});
