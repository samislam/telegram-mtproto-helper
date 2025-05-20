import { Context } from 'telegraf'
import { env } from '../service/validate-env'

export const isOwner = (ctx: Context) => ctx.from?.id === env.OWNER_USER_ID
