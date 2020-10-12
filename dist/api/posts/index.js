"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var postsCtrl = __importStar(require("../../controller/postsController"));
var checkLoggedIn_1 = __importDefault(require("../../lib/checkLoggedIn"));
var posts = new koa_router_1.default();
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn_1.default, postsCtrl.write);
var post = new koa_router_1.default();
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn_1.default, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn_1.default, postsCtrl.checkOwnPost, postsCtrl.update);
posts.use('/:id', postsCtrl.getPostById, post.routes());
exports.default = posts;
