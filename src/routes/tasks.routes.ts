import { TasksController } from '@/controller/TasksController'
import { Router } from 'express'

export const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.post('/', tasksController.assignTask)
