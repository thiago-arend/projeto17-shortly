import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { db } from "../database/database.connection.js";

export async function signup(req, res) {
    const { name, email, password } = req.body; // senhas já validadas pelo schema

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, passwordHash]);

        res.sendStatus(201);
    } catch (err) {
        if (Number(err.code) === 23505) return res.status(409).send({ message: "E-mail já cadastrado!" });

        res.status(500).send(err.message);
    }
}

export async function signin(req, res) {
    const { email, password } = req.body; // senhas já validadas pelo schema

    try {

        const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (result.rowCount === 0 || !bcrypt.compareSync(password, result.rows[0].password))
            return res.status(401).send({ message: "E-mail inválido ou senha incorreta!" });

        const token = uuid();
        await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,
            [token, result.rows[0].id]);

        res.status(200).send({ token });
    } catch (err) {

        res.status(500).send(err.message);
    }
}