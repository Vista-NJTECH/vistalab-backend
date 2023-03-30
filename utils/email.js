const nodemailer = require('nodemailer');
const config = require('../config')

module.exports.transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.emailAdd,
        pass: config.email.pass
    }
});