import { Handler } from './index'
import { logger } from '../utils/logger'

export const speakerInterruptHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('speakerInterruptHandler')
    flow.end()
    
    player.pause().then( () => {
        logger.info('Stoping')
    })
}