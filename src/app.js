// Iniciar o express
// Trabalhar com classes

// imoport ***
import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
    constructor() {
        // metodo constructor é chamado toda vez que a classe for instanciada
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(
            './files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes); // elas iram funcionar como middlewares - routes esta vindo do import ***
    }
}

// Esta exportando uma nova instancia da class App, e exportando apenas o server.
export default new App().server; // utilizando Sucrase
// module.exports = new App().server; //forma padrao
