import { AdminController } from '@/controller/AdminsController'
import { Router } from 'express'

export const adminRoutes = Router()
const adminControllers = new AdminController()

adminRoutes.post('/', adminControllers.createAdmin)
