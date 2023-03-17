"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Deck = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const decks_1 = __importDefault(require("./routes/decks"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const deckModel_1 = __importDefault(require("./models/deckModel"));
const userModel_1 = __importDefault(require("./models/userModel"));
/* import passportSetup from './services/passport-setup'; */
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
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
/* passportSetup(); */
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/api/decks', decks_1.default);
app.use('/api/auth', authRoutes_1.default);
// connect to db
mongoose_1.default.set('strictQuery', false);
const decksDb = mongoose_1.default.createConnection(process.env.MONGO_URI);
const usersDb = mongoose_1.default.createConnection(process.env.MONGO_URI_USERS);
// declare model and connect/create collection (name of collection, schema of collection)
const Deck = decksDb.model('Deck', deckModel_1.default);
exports.Deck = Deck;
const User = usersDb.model('User', userModel_1.default);
exports.User = User;
passport_1.default.serializeUser((user, done) => {
    done(undefined, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: '280528556929-1u71emnf1l0j9ql2d3ubthr46po0n600.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/api/auth/google/redirect',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['profile'],
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
            console.log('userIs', currentUser);
            done();
        }
        else {
            new User({
                username: profile.displayName,
                googleId: profile.id,
            })
                .save()
                .then((newUser) => {
                done(null, newUser);
            });
        }
    });
    console.log(request, profile);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});
