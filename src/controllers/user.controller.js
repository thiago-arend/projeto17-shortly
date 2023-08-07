import { getUrlsByCreatorId } from "../repositories/urls.repository.js";
import { getUsersUrlInformation } from "../repositories/users.repository.js";

export async function getUserData(req, res) {
    const { userId } = res.locals.session;

    try {

        const userInfo = await getUsersUrlInformation(userId);
        const urlInfo = await getUrlsByCreatorId(userId);

        res.status(200).send({ ...userInfo.rows[0], shortenedUrls: urlInfo.rows });
    } catch (err) {

        res.status(500).send(err.message);
    }
}