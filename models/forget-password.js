const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const ForgotPassword = sequelize.define('forgotPassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = ForgotPassword;