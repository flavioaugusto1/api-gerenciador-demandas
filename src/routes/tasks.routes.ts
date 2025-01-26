import { TasksController } from '@/controller/TasksController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyAuthorization } from '@/middlewares/verifyAuthorization'
import { Router } from 'express'

export const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.use(ensureAuthenticated)
tasksRoutes.post(
    '/',
    verifyAuthorization(['admin']),
    tasksController.assignTask,
)
