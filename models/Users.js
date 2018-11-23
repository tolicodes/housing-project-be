const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
    const Users = sequelize.define('Users', {
        email: Sequelize.STRING,
        hash: Sequelize.STRING,
        salt: Sequelize.STRING,
    }, {
        tableName: 'users'
    });

    Users.prototype.setPassword = function (password) {
        console.log(password);
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    };

    Users.prototype.validatePassword = function (password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        console.log(hash, 'aaaa', this.hash)
        return this.hash === hash;
    };

    Users.prototype.generateJWT = function () {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            email: this.email,
            id: this.id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, 'secret');
    }

    Users.prototype.toAuthJSON = function () {
        return {
            id: this.id,
            email: this.email,
            token: this.generateJWT(),
        };
    };

    return Users;
}