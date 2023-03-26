const nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
    service: "163",
    auth: {
        user: 'njtech_vista@163.com',
        pass: 'ZQFAVPWPEVOLTBPM'
    }
});