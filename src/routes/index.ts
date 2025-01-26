import { Router } from 'express'
import { adminRoutes } from './admin.routes'
import { sessionsRoute } from './sessions.routes'
import { teamsRoutes } from './team.routes'
import { membersRoutes } from './members.routes'
import { tasksRoutes } from './tasks.routes'

export const routes = Router()

routes.use('/admin', adminRoutes)
routes.use('/members', membersRoutes)
routes.use('/sessions', sessionsRoute)
routes.use('/teams', teamsRoutes)
routes.use('/tasks', tasksRoutes)
