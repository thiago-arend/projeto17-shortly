import { getSessionByToken } from "../repositories/sessions.repository.js";

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        const result = await getSessionByToken(token);
        if (result.rowCount === 0) return res.sendStatus(401);

        res.locals.session = result.rows[0]; // salva a sessao dentro da resposta para consulta pela prox. função

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}