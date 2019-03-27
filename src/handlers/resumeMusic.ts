import { i18nFactory } from '../factories'
import { Handler } from './index'
import { logger } from '../utils/logger'

export const resumeMusicHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('resumeMusicHandler')
    flow.end()
    
    player.play().then(
        logger.info('Resuming')
    )
}