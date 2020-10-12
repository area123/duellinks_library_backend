"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_seeding_1 = require("typeorm-seeding");
var User_1 = require("../entity/User");
typeorm_seeding_1.define(User_1.User, function (faker) {
    var email = faker.internet.email();
    var password = 'password';
    var nickname = faker.random.word();
    var user = new User_1.User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    return user;
});
