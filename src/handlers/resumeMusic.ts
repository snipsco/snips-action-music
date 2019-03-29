import { Handler } from './index'
import { logger, translation } from '../utils'

export const resumeMusicHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('resumeMusicHandler')
    flow.end()
    
    player.play().then(
        logger.info('Resuming')
    )

    return translation.randomTranslation('info.resumePlay', {})
}