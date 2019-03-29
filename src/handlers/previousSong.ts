import { Handler } from './index'
import { logger } from '../utils/logger'

export const previousSongHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('previousSongHandler')
    flow.end()
    
    player.previous().then(
        logger.info('Playing the previous song')
    )
}