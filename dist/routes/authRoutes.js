"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/signup', authController_1.signUpGet);
router.post('/signup', authController_1.signUpPost);
router.get('/login', passport_1.default.authenticate('google', { scope: ['profile'] }));
router.get('/google/redirect', passport_1.default.authenticate('google'), (req, res) => {
    /*     res.send(JSON.parse(req.user)); */
    console.log(res);
});
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
router.post('/login', authController_1.loginPost);
exports.default = router;
