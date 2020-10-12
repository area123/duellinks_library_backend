"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkLoggedIn = function (ctx, next) {
    if (!ctx.state.user) {
        ctx.status = 401;
        return;
    }
    return next();
};
exports.default = checkLoggedIn;
