// verifica se o usuario esta logado utilizando o token de autenticação do jwt

// passando no header o token

import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization; // buscanco o token que vem no header

    if (!authHeader) {
        return res.status(401).json({ error: ' Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        req.userId = decoded.id; // pegando o id e colocando na requisição p/ usar no update do UserController

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid)' });
    }
};
