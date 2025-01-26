import { authConfig } from '@/configs/auth'
import { AppError } from '@/utils/AppError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface JWTPayload {
    role: string
    sub: string
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError('Token JWT não informado.', 401)
        }

        const { secret } = authConfig.jwt
        const [, token] = authHeader.split(' ')

        const { role, sub: user_id } = verify(token, secret) as JWTPayload

        request.user = {
            id: user_id,
            role,
        }

        next()
    } catch (error) {
        throw new AppError('Ocorreu um erro no token JWT', 401)
    }
}
