import { db } from "../database/database.connection.js";

export async function getUserData(req, res) {
    const { userId } = res.locals.session;

    try {

        const result = await db.query(
            `SELECT users.id, users.name, CAST (SUM(urls."visitCount") AS INTEGER) AS "visitCount", 
            (SELECT JSON_AGG(urls.*) AS "shortenedUrls" FROM urls WHERE "creatorId"=$1)
                    FROM users JOIN urls ON users.id=urls."creatorId"
                    WHERE users.id=$1
                    GROUP BY users.id;`, [userId]
        );

        const obj = result.rows[0];
        obj.shortenedUrls = obj.shortenedUrls.map(url => {
            delete url.creatorId;
            delete url.createdAt;

            return url;
        });

        res.status(200).send(obj);
    } catch (err) {

        res.status(500).send(err.message);
    }
}