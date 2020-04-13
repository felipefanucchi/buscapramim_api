const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config({path: __dirname+'/.env'});

const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/templates/mail/'),
    layoutsDir: path.resolve('./src/templates/mail/'),
    defaultLayout: 'reset-password.html'
  },
  viewPath: path.resolve('./src/templates/mail/'),
  extName: '.html'
};

let transportOptions = {};

if(process.env.APP_ENV === 'development'){
  transportOptions = {
    host: process.env.MAILER_SERVICE_HOST,
    port: process.env.MAILER_SERVICE_PORT,
    secure: false,
  };
} else {
  transportOptions = {
    host: process.env.MAILER_SERVICE_HOST,
    port: process.env.MAILER_SERVICE_PORT,
    auth: {
      user: process.env.MAILER_EMAIL_ID,
      pass: process.env.MAILER_PASSWORD,
    },
  };
}

const smtpTransport = nodemailer.createTransport(transportOptions);
smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = smtpTransport;
