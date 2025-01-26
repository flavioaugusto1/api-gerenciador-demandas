import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class TeamsController {
    async createTeam(request: Request, response: Response) {
        const requestBodySchema = z.object({
            name: z.string().trim().min(1),
            description: z.string().trim().min(1),
        })

        const { name, description } = requestBodySchema.parse(request.body)

        const team = await prisma.team.create({
            data: {
                name,
                description,
            },
        })

        response.status(201).json({
            message: 'O time foi cadastrado com sucesso!',
            team,
        })
    }

    async listAllTeams(request: Request, response: Response) {
        const teams = await prisma.team.findMany({
            include: {
                TeamMembers: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
            },
        })
        const totalTeams = teams.length

        response.json({
            total: totalTeams,
            teams,
        })
    }

    async updateTeamById(request: Request, response: Response) {
        const requestBodySchema = z.object({
            name: z.string().trim().min(1).optional(),
            description: z.string().trim().min(1).optional(),
        })

        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { name, description } = requestBodySchema.parse(request.body)
        const { id } = requestParamSchema.parse(request.params)

        const verifyTeamExists = await prisma.team.findFirst({
            where: {
                id,
            },
        })

        if (!verifyTeamExists) {
            throw new AppError('A equipe informada não foi localizada.', 404)
        }

        const team = await prisma.team.update({
            data: {
                name,
                description,
            },
            where: {
                id,
            },
        })

        response.json({
            message: 'Time atualizado com sucesso',
            team,
        })
    }

    async deleteTeam(request: Request, response: Response) {
        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)

        const team = await prisma.team.findFirst({
            where: {
                id,
            },
        })

        if (!team) {
            throw new AppError(
                'Não foi possível localizar a equipe informada.',
                404,
            )
        }

        await prisma.team.delete({
            where: {
                id,
            },
        })

        response.status(204).json()
    }
}
