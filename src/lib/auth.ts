import type { Cookies } from '@sveltejs/kit'
import './dotenv-config'
import { randomBytes } from "crypto"
import jwt from "jsonwebtoken"
const secretKey = process.env.JWT_SECRET ?? randomBytes(32).toString("hex")

export type UserToken = {
    id: number,
    username: string
}

export function getUserTokenFromCookie(cookie: Cookies): UserToken | null {
    const userToken = cookie.get("userToken")
    if(!userToken) return null
    const user = decodeJwt(userToken)
    if(!user) return null
    return user
}

export function createJwt(userInfo: UserToken): string {
    const token = jwt.sign(userInfo, secretKey)
    return token
}

export function decodeJwt(token: string): UserToken | null {
    try {
        const decodedUser = jwt.verify(token, secretKey)
        if(typeof decodedUser === "object" && "username" in decodedUser! && "id" in decodedUser!) return decodedUser as UserToken
        else return null
    } catch(err) {
        return null;
    }
}