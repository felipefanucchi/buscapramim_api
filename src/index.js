const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config({path: __dirname+'/.env'});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.API_PORT | 3333);
