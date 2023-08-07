import { db } from "../database/database.connection.js";

export function insertUser(name, email, passwordHash) {
    return db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
        [name, email, passwordHash]);
}

export function getUserByEmail(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
}

export function getUsersRanking() {
    return db.query(
        `SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", COALESCE(SUM(urls."visitCount"), 0) AS "visitCount"
            FROM users LEFT JOIN urls ON urls."creatorId"=users.id
            GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;`
    );
}

export function getUsersUrlInformation(id) {
    return db.query(
        `SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount"
            FROM users JOIN urls ON users.id=urls."creatorId"
            WHERE users.id=$1
            GROUP BY users.id;`, [id]
    );
}