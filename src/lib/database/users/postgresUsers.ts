import '$lib/dotenv-config'
import type { IUser, User } from "$lib/typings";
import { genSalt, hash } from "bcrypt";
import { makeOneRowQuery } from "../pg";

const postgresUsers: IUser = {
    createUser,
    authenticateUser
}

export default postgresUsers

type postgresUser = {
    id: number,
    username: string,
    password: string,
    salt: string
}

const SALT_ROUNDS = 10

async function createUser(username: string, password: string): Promise<User> {
    const salt = await genSalt(SALT_ROUNDS)
    const hashPass = await hash(password, salt)
    const user = await makeOneRowQuery<User>('INSERT INTO "User"(username, password, salt) VALUES ($1, $2, $3) RETURNING *;', [username, hashPass, salt])
    if(!user) throw new Error("Could not create user")
    return user as User
}

async function authenticateUser(username: string, password: string): Promise<User> {
    const user = await makeOneRowQuery<postgresUser>('SELECT * FROM "User" WHERE username = $1', [username])
    if(!user) throw new Error("This username does not exist")
    const hashPass = await hash(password, user.salt)
    if(user.password == hashPass) return { username: user.username, id: user.id}
    else throw new Error("Password is incorrect")
}