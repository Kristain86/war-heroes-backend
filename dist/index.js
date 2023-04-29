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
/* eslint-disable import/no-extraneous-dependencies */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const series_1 = __importDefault(require("./routes/series"));
const cards_1 = __importDefault(require("./routes/cards"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const keys_1 = require("./const/keys");
const userModel_1 = require("./models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("newrelic");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, CALLBACK_URL } = keys_1.authKeys;
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
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findOne({ googleId: profile.id });
    if (user) {
        return done(null, user);
    }
    else {
        const newUser = new userModel_1.User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : '',
            avatar: profile.photos ? profile.photos[0].value : '',
        });
        yield newUser.save();
        return done(null, newUser);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(id);
    done(null, user);
}));
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    var _a;
    const token = jsonwebtoken_1.default.sign({ userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id }, 'secret-key');
    res.header('Access-Control-Allow-Origin', '*');
    res.redirect(`http://localhost:3001?${token}`);
});
app.get('/api/current_user', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Se requiere un token de autenticación válido.' });
    }
    jsonwebtoken_1.default.verify(token, 'secret-key', (err, decoded) => {
        if (err || typeof decoded === 'string') {
            return res.status(401).json({ error: 'Token de autenticación no válido.' });
        }
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
        userModel_1.User.findById(userId, (errFind, user) => {
            if (errFind) {
                return res.status(500).json({ error: 'Error al buscar el usuario.' });
            }
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
            res.json({ user });
        });
    });
});
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3001');
});
// add deck to user
app.get('/api/add-deck', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decksToAdd = req.body.decks;
    if (!token) {
        return res.status(401).json({ error: 'Se requiere un token de autenticación válido.' });
    }
    jsonwebtoken_1.default.verify(token, 'secret-key', (err, decoded) => {
        if (err || typeof decoded === 'string') {
            return res.status(401).json({ error: 'Token de autenticación no válido.' });
        }
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
        userModel_1.User.findOneAndUpdate({ _id: userId }, { $push: { decks: { $each: decksToAdd } } }, { new: true }, (ErrorFind, user) => {
            if (ErrorFind) {
                console.error(ErrorFind);
                res.status(500).send('Error interno del servidor');
            }
            else if (!user) {
                res.status(404).send('Usuario no encontrado');
            }
            else {
                res.json(user);
            }
        });
    });
});
// remove deck from user
app.delete('/api/delete-deck', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const { deckId } = req.body;
    if (!token) {
        return res.status(401).json({ error: 'Se requiere un token de autenticación válido.' });
    }
    jsonwebtoken_1.default.verify(token, 'secret-key', (err, decoded) => {
        if (err || typeof decoded === 'string') {
            return res.status(401).json({ error: 'Token de autenticación no válido.' });
        }
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
        userModel_1.User.findOneAndUpdate({ _id: userId }, { $pull: { decks: { _id: deckId } } }, { new: true }, (errFind, user) => {
            if (errFind) {
                console.error(errFind);
                res.status(500).send('Error');
            }
            else if (!user) {
                res.status(404).send('User no encontrado');
            }
            else {
                res.json(user);
            }
        });
    });
});
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
