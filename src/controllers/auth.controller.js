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
        if (Number(err.code) === 23505) return res.status(409).send({message: "E-mail já cadastrado!"});

        res.status(500).send(err.message);
    }
}