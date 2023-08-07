import { db } from "../database/database.connection.js";

export function insertUrl(url, shortUrl, userId) {
    return db.query(`INSERT INTO urls (url, "shortUrl", "creatorId") VALUES ($1, $2, $3) RETURNING id;`,
        [url, shortUrl, userId]);
}

export function getUrl(id) {
    return db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
}

export function getUrlByShortUrl(shortUrl) {
    return db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortUrl]);
}

export function updateUrlVisitCount(id) {
    return db.query(`UPDATE urls SET "visitCount"="visitCount"+1 WHERE id=$1;`,
        [id]);
}

export function deleteUrlByIdAndCreatorId(id, creatorId) {
    return db.query(`DELETE FROM urls WHERE id=$1 AND "creatorId"=$2;`,
    [id, creatorId])
}

export function getUrlsByCreatorId(id) {
    return db.query(
        `SELECT id, "shortUrl", url, "visitCount"
            FROM urls WHERE "creatorId"=$1;`, [id]
    );
}