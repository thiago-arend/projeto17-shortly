import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { getUserByEmail, insertUser } from "../repositories/users.repository.js";
import { insertSession } from "../repositories/sessions.repository.js";

export async function signup(req, res) {
    const { name, email, password } = req.body; // senhas já validadas pelo schema

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await insertUser(name, email, passwordHash);

        res.sendStatus(201);
    } catch (err) {
        if (Number(err.code) === 23505) return res.status(409).send({ message: "E-mail já cadastrado!" });

        res.status(500).send(err.message);
    }
}

export async function signin(req, res) {
    const { email, password } = req.body; // senhas já validadas pelo schema

    try {

        const result = await getUserByEmail(email);
        if (result.rowCount === 0 || !bcrypt.compareSync(password, result.rows[0].password))
            return res.status(401).send({ message: "E-mail inválido ou senha incorreta!" });

        const token = uuid();
        await insertSession(token, result.rows[0].id);

        res.status(200).send({ token });
    } catch (err) {

        res.status(500).send(err.message);
    }
}