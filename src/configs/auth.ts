import { env } from '@/env'

export const authConfig = {
    jwt: {
        secret: env.JWT_TOKEN,
        expiresIn: '1d',
    },
}
