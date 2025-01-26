import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'

export class AdminController {
    async createAdmin(request: Request, response: Response) {
        const requestBodySchema = z.object({
            name: z.string().trim().min(1),
            email: z.string().email(),
            password: z.string(),
        })

        const { name, email, password } = requestBodySchema.parse(request.body)

        const userExists = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (userExists) {
            throw new AppError(
                'O e-mail informado já existe. Por gentileza, tente outro.',
                401,
            )
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'admin',
            },
        })

        const { password: _, ...userWithoutPassword } = user

        response.status(201).json({
            message: 'Administrador criado com sucesso!',
            user: userWithoutPassword,
        })
    }
}
