import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class TasksController {
    async assignTask(request: Request, response: Response) {
        const requestBodySchema = z.object({
            title: z.string().trim().min(1),
            description: z.string().trim().min(1),
            assignedTo: z.string().uuid(),
            teamId: z.string().uuid(),
        })

        const { title, description, assignedTo, teamId } =
            requestBodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: {
                id: assignedTo,
            },
        })

        if (!user || user.role !== 'member') {
            throw new AppError(
                'Não foi possível atribuir a tarefa a esse membro.',
                409,
            )
        }

        const team = await prisma.team.findFirst({
            where: {
                id: teamId,
            },
        })

        if (!team) {
            throw new AppError(
                'Não foi possível atribuir a tarefa a essa equipe.',
                409,
            )
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignToUser: assignedTo,
                teamId,
            },
        })

        response.status(201).json({ task })
    }
}
