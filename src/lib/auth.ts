import jwt from "jsonwebtoken"
const secretKey = "SuperSecret"

export type User = {
    username: string,
    password: string
}

const users: User[] = []

export function createJwt(username: string): string {
    const token = jwt.sign({username}, secretKey)
    return token
}

export function decodeJwt(token: string): string | null {
    try {
        const decodedUser = jwt.verify(token, secretKey)
        if(typeof decodedUser === "object" && "username" in decodedUser!) return decodedUser.username
        else return null
    } catch(err) {
        return null;
    }
}

export function createUser(user: string, pass: string): boolean {
    if(users.some(({ username }) => username == user)) return false
    else {
        users.push({username: user, password: pass})
        return true
    }
}

export function validateCredentials(user:string, pass: string) {
    return users.some(({username, password}) => username == user && password == pass)
}