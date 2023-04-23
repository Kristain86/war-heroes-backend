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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpPost = exports.loginPost = exports.signUpGet = void 0;
const texts_1 = require("../const/texts");
const index_1 = require("../index");
const handleErrors = (err) => {
    const errors = { username: '', email: '', password: '' };
    if (err.code === 11000) {
        errors.email = texts_1.texts.forms.errors.email.ALREADY_REGISTERED;
        return errors;
    }
    if (err.message.includes('User validation failed:')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};
const signUpGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ hello: 'hello' });
});
exports.signUpGet = signUpGet;
const signUpPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const user = yield index_1.User.create({
            username,
            email,
            password,
        });
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            const errors = handleErrors(error);
            res.status(400).json({ errors });
        }
    }
});
exports.signUpPost = signUpPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    res.status(200).json({ email, password });
});
exports.loginPost = loginPost;
