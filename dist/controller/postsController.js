"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.remove = exports.read = exports.list = exports.write = exports.checkOwnPost = exports.getPostById = void 0;
var typeorm_1 = require("typeorm");
var Post_1 = require("../entity/Post");
var User_1 = require("../entity/User");
// id에 맞는 post가 있으면 ctx.state에 post를 넣음
exports.getPostById = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, postRepository, post, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = ctx.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, typeorm_1.getRepository(Post_1.Post)];
            case 2:
                postRepository = _a.sent();
                return [4 /*yield*/, postRepository.findOne({
                        id: id,
                    })];
            case 3:
                post = _a.sent();
                if (!post) {
                    ctx.status = 404;
                    return [2 /*return*/];
                }
                ctx.state.post = post;
                return [2 /*return*/, next()];
            case 4:
                e_1 = _a.sent();
                ctx.throw(500, e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.checkOwnPost = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, post;
    return __generator(this, function (_b) {
        _a = ctx.state, user = _a.user, post = _a.post;
        if (post.user.id === user.id) {
            ctx.status = 403;
            return [2 /*return*/];
        }
        return [2 /*return*/, next()];
    });
}); };
exports.write = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var postRepository, userRepository, _a, title, content, sort, tags, id, user, post, _b, e_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                return [4 /*yield*/, typeorm_1.getRepository(Post_1.Post)];
            case 1:
                postRepository = _c.sent();
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)];
            case 2:
                userRepository = _c.sent();
                _a = ctx.request.body, title = _a.title, content = _a.content, sort = _a.sort, tags = _a.tags;
                id = ctx.state.user.id;
                return [4 /*yield*/, userRepository.findOne({
                        id: id,
                    })];
            case 3:
                user = _c.sent();
                post = new Post_1.Post();
                post.title = title;
                post.content = content;
                post.sort = sort;
                post.tags = tags;
                post.user = user;
                _b = ctx;
                return [4 /*yield*/, postRepository.save(post)];
            case 4:
                _b.body = _c.sent();
                return [3 /*break*/, 6];
            case 5:
                e_2 = _c.sent();
                ctx.throw(500, e_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.list = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var page, _a, tag, email, where, postRepository, freeBoard, noticeBoard, gameBoard, consoleBoard, posts, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                page = parseInt(ctx.query.page || '1', 10);
                if (page < 1) {
                    ctx.status = 400;
                    return [2 /*return*/];
                }
                _a = ctx.query, tag = _a.tag, email = _a.email;
                where = __assign(__assign({}, (email ? { 'user.email': email } : {})), (tag ? { tags: tag } : {}));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, typeorm_1.getRepository(Post_1.Post)];
            case 2:
                postRepository = _b.sent();
                return [4 /*yield*/, postRepository.find({
                        where: [
                            __assign(__assign(__assign({}, (email ? { 'user.email': email } : {})), (tag ? { tags: tag } : {})), { sort: '자유게시판' }),
                        ],
                        order: {
                            id: 'DESC',
                        },
                        take: 20,
                        skip: ((page - 1) * 10),
                        relations: ['user'],
                    })];
            case 3:
                freeBoard = _b.sent();
                return [4 /*yield*/, postRepository.find({
                        where: [
                            __assign(__assign(__assign({}, (email ? { 'user.email': email } : {})), (tag ? { tags: tag } : {})), { sort: '공지사항' }),
                        ],
                        order: {
                            id: 'DESC',
                        },
                        take: 20,
                        skip: ((page - 1) * 10),
                        relations: ['user'],
                    })];
            case 4:
                noticeBoard = _b.sent();
                return [4 /*yield*/, postRepository.find({
                        where: [
                            __assign(__assign(__assign({}, (email ? { 'user.email': email } : {})), (tag ? { tags: tag } : {})), { sort: '게임' }),
                        ],
                        order: {
                            id: 'DESC',
                        },
                        take: 20,
                        skip: ((page - 1) * 10),
                        relations: ['user'],
                    })];
            case 5:
                gameBoard = _b.sent();
                return [4 /*yield*/, postRepository.find({
                        where: [
                            __assign(__assign(__assign({}, (email ? { 'user.email': email } : {})), (tag ? { tags: tag } : {})), { sort: '콘솔' }),
                        ],
                        order: {
                            id: 'DESC',
                        },
                        take: 20,
                        skip: ((page - 1) * 10),
                        relations: ['user'],
                    })];
            case 6:
                consoleBoard = _b.sent();
                posts = freeBoard.concat(noticeBoard, gameBoard, consoleBoard);
                ctx.set('current-page', page.toString());
                ctx.body = posts;
                return [3 /*break*/, 8];
            case 7:
                e_3 = _b.sent();
                ctx.throw(500, e_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.read = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.body = ctx.state.post;
        return [2 /*return*/];
    });
}); };
exports.remove = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var postRepository, post, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, typeorm_1.getRepository(Post_1.Post)];
            case 1:
                postRepository = _a.sent();
                post = ctx.state.post;
                return [4 /*yield*/, postRepository.remove(post)];
            case 2:
                _a.sent();
                ctx.status = 204;
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                ctx.throw(500, e_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.update = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, sort, tags, postRepository, post, _b, e_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = ctx.request.body, title = _a.title, content = _a.content, sort = _a.sort, tags = _a.tags;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, typeorm_1.getRepository(Post_1.Post)];
            case 2:
                postRepository = _c.sent();
                post = ctx.state.post;
                post.title = title;
                post.content = content;
                post.sort = sort;
                post.tags = tags;
                _b = ctx;
                return [4 /*yield*/, postRepository.save(post)];
            case 3:
                _b.body = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                e_5 = _c.sent();
                ctx.throw(500, e_5);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
