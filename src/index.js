const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const dotenv = require('dotenv');
// const expressSwagger = require('express-swagger-generator')(app);

dotenv.config({path: __dirname+'/.env'});

let swaggerOptions = {
  swaggerDefinition: {
    info: {
      description: "Documentação dos endpoints de Busca pra mim",
      title: "Busca pra mim API",
      version: '1.0.0',
    },
    host: 'localhost:3333',
    basePath: '/',
    produces: [
      "application/json",
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "Bearer <token>",
      }
    }
  },
  basedir: __dirname,
  files: ['./controllers/**/*.js']
};

app.use(cors());
app.use(express.json());
app.use(routes);

// expressSwagger(swaggerOptions);

app.listen(process.env.API_PORT | 3333);
