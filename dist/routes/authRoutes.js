"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get('/login', passport_1.default.authenticate('google', { scope: ['profile'] }));
router.get('/google/redirect', passport_1.default.authenticate('google'), (req, res) => {
    // JWT
    res.send(req.user);
});
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
exports.default = router;
