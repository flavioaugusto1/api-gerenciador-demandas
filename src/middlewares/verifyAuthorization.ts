import { AppError } from '@/utils/AppError'
import { NextFunction, Request, Response } from 'express'

export function verifyAuthorization(role: string[]) {
    return (request: Request, response: Response, next: NextFunction) => {
        const { role: userRole } = request.user

        if (!request.user) {
            throw new AppError('Unauthorized', 401)
        }

        if (!role.includes(userRole)) {
            throw new AppError('Unauthorized', 401)
        }

        next()
    }
}
