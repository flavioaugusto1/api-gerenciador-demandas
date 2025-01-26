import { authConfig } from '@/configs/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'

export class SessionsController {
    async createAccessToken(request: Request, response: Response) {
        const requestBodySchema = z.object({
            email: z.string().email(),
            password: z.string(),
        })

        const { email, password } = requestBodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (!user) {
            throw new AppError(
                'Não foi possível localizar o usuário informado.',
                404,
            )
        }

        const matchPassword = await compare(password, user.password)

        if (email !== user.email || !matchPassword) {
            throw new AppError('E-mail e/ou senha inválido.', 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({ role: user.role ?? 'customer' }, secret, {
            subject: user.id,
            expiresIn,
        })

        const { password: _, ...userWithoutPassword } = user

        response.json({
            user: userWithoutPassword,
            token,
        })
    }
}
