const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const smtpTransport = nodemailer.createTransport({
  host: process.env.MAILER_SERVICE_HOST,
  port: process.env.MAILER_SERVICE_PORT,
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/templates/mail/'),
    layoutsDir: path.resolve('./src/templates/mail/'),
    defaultLayout: 'forgot-password.html'
  },
  viewPath: path.resolve('./src/templates/mail/'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = smtpTransport;
