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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.check = exports.login = exports.register = exports.generateToken = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../entity/User");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var serialize = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        data = user;
        // @ts-ignore
        delete data.password;
        return [2 /*return*/, data];
    });
}); };
exports.generateToken = function (id, email) {
    return jsonwebtoken_1.default.sign({
        id: id,
        email: email,
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
exports.register = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, nickname, exists, user, data, token, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = ctx.request.body, email = _a.email, password = _a.password, nickname = _a.nickname;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User_1.User.findOne({ email: email })];
            case 2:
                exists = _b.sent();
                if (exists) {
                    ctx.status = 409;
                    return [2 /*return*/];
                }
                user = new User_1.User();
                user.email = email;
                user.password = password;
                user.nickname = nickname;
                return [4 /*yield*/, User_1.User.save(user)];
            case 3:
                data = _b.sent();
                ctx.body = serialize(user);
                console.log(ctx.body);
                token = exports.generateToken(data.id, data.email);
                ctx.cookies.set('access_token', token, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: true,
                });
                return [3 /*break*/, 5];
            case 4:
                e_1 = _b.sent();
                ctx.throw(500, e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepository, _a, email, password, user, valid, token, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(User_1.User)];
            case 1:
                userRepository = _b.sent();
                _a = ctx.request.body, email = _a.email, password = _a.password;
                console.log(email, password);
                if (!email || !password) {
                    ctx.status = 401;
                    return [2 /*return*/];
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, userRepository.findOne({ email: email })];
            case 3:
                user = _b.sent();
                console.log(password);
                if (!user) {
                    ctx.status = 401;
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 4:
                valid = _b.sent();
                console.log(valid);
                if (!valid) {
                    ctx.status = 401;
                    return [2 /*return*/];
                }
                ctx.body = serialize(user);
                token = exports.generateToken(user.id, user.email);
                ctx.cookies.set('access_token', token, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: true,
                });
                return [3 /*break*/, 6];
            case 5:
                e_2 = _b.sent();
                ctx.throw(500, e_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.check = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = ctx.state.user;
        if (!user) {
            ctx.status = 401;
            return [2 /*return*/];
        }
        ctx.body = user;
        return [2 /*return*/];
    });
}); };
exports.logout = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.cookies.set('access_token');
        ctx.status = 204;
        return [2 /*return*/];
    });
}); };
