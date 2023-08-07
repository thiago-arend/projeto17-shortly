import { getUsersRanking } from "../repositories/users.repository.js";

export async function getRanking(req, res) {

    try {

        const result = await getUsersRanking();

        res.status(200).send(result.rows);
    } catch (err) {

        res.status(500).send(err.message);
    }
}