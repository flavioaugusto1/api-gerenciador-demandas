import { TeamsController } from '@/controller/TeamsController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyAuthorization } from '@/middlewares/verifyAuthorization'
import { Router } from 'express'

export const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.use(ensureAuthenticated)

teamsRoutes.post(
    '/',
    verifyAuthorization(['admin']),
    teamsController.createTeam,
)

teamsRoutes.get(
    '/',
    verifyAuthorization(['admin']),
    teamsController.listAllTeams,
)

teamsRoutes.put(
    '/:id',
    verifyAuthorization(['admin']),
    teamsController.updateTeamById,
)

teamsRoutes.delete(
    '/:id',
    verifyAuthorization(['admin']),
    teamsController.deleteTeam,
)
