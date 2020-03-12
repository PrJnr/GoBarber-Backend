// Iniciar o express
// Trabalhar com classes

// imoport ***

import express from 'express';
import 'express-async-errors';
import path from 'path';
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
    constructor() {
        // metodo constructor é chamado toda vez que a classe for instanciada
        this.server = express();

        Sentry.init(sentryConfig);

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json());
        this.server.use(
            './files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes); // elas iram funcionar como middlewares - routes esta vindo do import ***
        this.server.use(Sentry.Handlers.errorHandler());
    }
}

// Esta exportando uma nova instancia da class App, e exportando apenas o server.
export default new App().server; // utilizando Sucrase
// module.exports = new App().server; //forma padrao
