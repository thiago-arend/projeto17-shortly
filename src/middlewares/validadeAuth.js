import { db } from "../database/database.connection.js";

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        const result = await db.query(`SELECT * FROM sessions WHERE token=$1`, [token]);
        if (result.rowCount === 0) return res.sendStatus(401);

        res.locals.session = result.rows[0]; // salva a sessao dentro da resposta para consulta pela prox. função

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}