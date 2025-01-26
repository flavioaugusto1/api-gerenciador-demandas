import { MembersController } from '@/controller/MembersController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { verifyAuthorization } from '@/middlewares/verifyAuthorization'
import { Router } from 'express'

export const membersRoutes = Router()
const membersController = new MembersController()

membersRoutes.post('/', membersController.createMember)

membersRoutes.use(ensureAuthenticated)
membersRoutes.post(
    '/add',
    verifyAuthorization(['admin']),
    membersController.addMemberOnTeam,
)
membersRoutes.delete(
    '/remove/:id',
    verifyAuthorization(['admin']),
    membersController.removeMemberOnTeam,
)
