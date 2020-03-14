// Iniciar o express
// Trabalhar com classes

// imoport ***
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import path from 'path';
import Youch from 'youch';
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
        this.exceptionHandler();
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

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();

                return res.status(500).json(errors);
            }

            return res.status(500).json({ error: ' Internal server Error' });
        });
    }
}

// Esta exportando uma nova instancia da class App, e exportando apenas o server.
export default new App().server; // utilizando Sucrase
// module.exports = new App().server; //forma padrao
