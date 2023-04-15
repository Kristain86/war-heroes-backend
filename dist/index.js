"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const decks_1 = __importDefault(require("./routes/decks"));
const series_1 = __importDefault(require("./routes/series"));
const cards_1 = __importDefault(require("./routes/cards"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET, POST, PATCH, DELETE, PUT',
    allowedHeaders: 'Content-Type, Authorization',
}));
// middleware
app.use(express_1.default.json());
// set view engine for now
app.set('view engine', 'ejs');
app.use((0, cookie_session_1.default)({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['thisismycookiekey'],
}));
//inititalize passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    next();
});
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/api/decks', decks_1.default);
app.use('/api/series', series_1.default);
app.use('/api/cards', cards_1.default);
// connect to db
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(process.env.MONGO_URI, {})
    .then(() => {
    console.log('MongoDB Connected');
})
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});
