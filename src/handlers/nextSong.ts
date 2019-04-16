import { Handler } from './index'
import { logger } from '../utils/logger'

export const nextSongHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('nextSongHandler')
    flow.end()
    
    player.next().then( () => {
        logger.info('Playing the next song')
    })
}