const Sequelize = require('sequelize');
const Users = require('./Users');

const {
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_HOST, 
} = process.env;

const sequelize = new Sequelize(
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    {
        host: DATABASE_HOST,
        dialect: 'mysql'
    }
);

sequelize.authenticate();

module.exports = {
    Users: Users(sequelize)
};