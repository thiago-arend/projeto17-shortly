import { db } from "../database/database.connection.js";
import { nanoid } from 'nanoid';

export async function createUrl(req, res) {
    const { url } = req.body;
    const { session } = res.locals;

    try {

        const shortUrl = nanoid(6);
        const result = await db.query(`
            INSERT INTO urls (url, "shortUrl", "creatorId") VALUES ($1, $2, $3) RETURNING id;`,
            [url, shortUrl, session.userId]);

        res.status(201).send({ id: result.rows[0].id, shortUrl });
    } catch (err) {
        if (Number(err.code) === 23505) return res.status(409).send({ message: "Url já cadastrada!" });

        res.status(500).send(err.message);
    }
}

export async function getUrl(req, res) {
    const { id } = req.params;

    try {

        const result = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
        if (result.rowCount === 0) return res.status(404).send({ message: "Url não encontrada!" });

        const url = result.rows[0];
        delete url.creatorId;
        delete url.createdAt;

        res.status(200).send(url);
    } catch (err) {

        res.status(500).send(err.message);
    }
}

export async function visitUrl(req, res) {
    const { shortUrl } = req.params;

    try {

        const result = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortUrl]);
        if (result.rowCount === 0) return res.status(404).send({ message: "Url encurtada não encontrada!" });

        // faria mais sentido salvar também o id de quem realizou a visita...
        await db.query(`INSERT INTO visits ("urlId") VALUES ($1);`,
            [result.rows[0].id]);

        res.redirect(`${process.env.BASE_URL}/${shortUrl}`);
    } catch (err) {

        res.status(500).send(err.message);
    }
}