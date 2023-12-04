const nodemailer = require('nodemailer')

// TransPorter using mail configs 
const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_APP_PASSWORD
    },
});


module.exports =  transporter;