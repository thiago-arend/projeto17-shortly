import { nanoid } from 'nanoid';
import { deleteUrlByIdAndCreatorId, getUrl, getUrlByShortUrl, insertUrl, updateUrlVisitCount } from "../repositories/urls.repository.js";
import dotenv from "dotenv";

dotenv.config();

export async function createUrl(req, res) {
    const { url } = req.body;
    const { userId } = res.locals.session;

    try {

        const shortUrl = nanoid(6);
        const result = await insertUrl(url, shortUrl, userId);

        res.status(201).send({ id: result.rows[0].id, shortUrl });
    } catch (err) {
        if (Number(err.code) === 23505) return res.status(409).send({ message: "Url já cadastrada!" });

        res.status(500).send(err.message);
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params;

    try {

        const result = await getUrl(id);
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

        const result = await getUrlByShortUrl(shortUrl);
        if (result.rowCount === 0) return res.status(404).send({ message: "Url encurtada não encontrada!" });

        await updateUrlVisitCount(result.rows[0].id);

        res.redirect(`${process.env.BASE_URL}/${shortUrl}`);
    } catch (err) {

        res.status(500).send(err.message);
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;
    const { userId } = res.locals.session;

    try {

        const result = await getUrl(id);
        if (result.rowCount === 0) return res.status(404).send({ message: "Url não encontrada!" });

        const resultDelete = await deleteUrlByIdAndCreatorId(id, userId);
            if (resultDelete.rowCount === 0) 
                return res.status(401).send({ message: "A url encurtada não pertence ao usuário!" });

        res.sendStatus(204);
    } catch (err) {

        res.status(500).send(err.message);
    }
}