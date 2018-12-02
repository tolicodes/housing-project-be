const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    company: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING,
    fb_id: DataTypes.STRING,
    li_id: DataTypes.STRING,
    google_id: DataTypes.STRING,
    social_login: DataTypes.STRING,
    name: DataTypes.STRING,
    nmls_number: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});

  user.prototype.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };

  user.prototype.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

    return this.hash === hash;
  };

  user.prototype.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
      email: this.email,
      id: this.id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
  }

  user.prototype.toAuthJSON = function () {
    return {
      id: this.id,
      email: this.email,
      token: this.generateJWT(),
      name: this.name,
    };
  };

  user.associate = function (models) {
    user.hasMany(models.borrower);
  };
  return user;
};