import { db } from "../database/database.connection.js";

export async function getUserData(req, res) {
    const { userId } = res.locals.session;

    try {

        const userInfo = await db.query(
            `SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount"
                FROM users JOIN urls ON users.id=urls."creatorId"
                WHERE users.id=$1
                GROUP BY users.id;`, [userId]
        );

        const urlInfo = await db.query(
            `SELECT id, "shortUrl", url, "visitCount"
                FROM urls WHERE "creatorId"=$1;`, [userId]
        );

        res.status(200).send({ ...userInfo.rows[0], shortenedUrls: urlInfo.rows });
    } catch (err) {

        res.status(500).send(err.message);
    }
}