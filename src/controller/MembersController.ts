import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'

export class MembersController {
    async createMember(request: Request, response: Response) {
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
            },
        })

        const { password: _, ...userWithoutPassword } = user

        response.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: userWithoutPassword,
        })
    }

    async addMemberOnTeam(request: Request, response: Response) {
        const requestBodySchema = z.object({
            userId: z.string().uuid(),
            teamId: z.string().uuid(),
        })

        const { userId, teamId } = requestBodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        })

        if (user?.role !== 'member') {
            throw new AppError(
                'Só é possível cadastrar membros em equipes.',
                409,
            )
        }

        const verifyIfUserAlreadyInTeam = await prisma.teamMembers.findFirst({
            where: {
                userId,
                AND: {
                    teamId,
                },
            },
        })

        if (verifyIfUserAlreadyInTeam) {
            throw new AppError('O membro já está cadastrado na equipe.', 409)
        }

        const addMember = await prisma.teamMembers.create({
            data: {
                userId,
                teamId,
            },
        })

        response.json(addMember)
    }

    async removeMemberOnTeam(request: Request, response: Response) {
        const requestBodySchema = z.object({
            userId: z.string().uuid(),
            teamId: z.string().uuid(),
        })

        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)
        const { userId, teamId } = requestBodySchema.parse(request.body)

        const verifyIfMemberInTeam = await prisma.teamMembers.findFirst({
            where: {
                id,
                AND: {
                    teamId,
                    userId,
                },
            },
        })

        if (!verifyIfMemberInTeam) {
            throw new AppError('O usuário não está vinculado a esse time.', 409)
        }

        await prisma.teamMembers.delete({
            where: {
                id,
                AND: {
                    teamId,
                    userId,
                },
            },
        })

        response.status(204).json()
    }
}
