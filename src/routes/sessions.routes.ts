import { SessionsController } from '@/controller/SessionsController'
import { Router } from 'express'

export const sessionsRoute = Router()
const sessionsController = new SessionsController()

sessionsRoute.post('/', sessionsController.createAccessToken)
