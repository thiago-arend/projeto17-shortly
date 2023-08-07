import { db } from "../database/database.connection.js";

export function insertSession(token, userId) {
    return db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,
        [token, userId]);
}

export function getSessionByToken(token) {
    return db.query(`SELECT * FROM sessions WHERE token=$1`, [token]);
}