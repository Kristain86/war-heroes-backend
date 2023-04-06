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
const userModel_1 = __importDefault(require("./models/userModel"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const keys_1 = require("./const/keys");
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
/* passportSetup(); */
app.use((req, res, next) => {
    next();
});
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/api/decks', decks_1.default);
app.use('/api/auth', authRoutes_1.default);
// connect to db
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(process.env.MONGO_URI, {})
    .then(() => {
    console.log('MongoDB Connected');
})
    .catch((err) => console.log(err));
/* const decksDb = mongoose.createConnection(process.env.MONGO_URI as string); */
const usersDb = mongoose_1.default.createConnection(process.env.MONGO_URI_USERS);
// declare model and connect/create collection (name of collection, schema of collection)
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
    clientID: keys_1.authKeys.AUTH_CLIENT_ID,
    clientSecret: keys_1.authKeys.AUTH_CLIENT_SECRET,
    callbackURL: keys_1.authKeys.CALLBACK_URL,
    userProfileURL: keys_1.authKeys.USER_PROFILE_URL,
    scope: ['profile'],
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
        console.log(profile);
        if (currentUser) {
            done(null, currentUser);
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
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server and db running yep at http://localhost:${port}`);
});
