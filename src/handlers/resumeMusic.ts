import { Handler } from './index'
import { logger } from '../utils'

export const resumeMusicHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('resumeMusicHandler')
    flow.end()
    
    const isStoping = await player.isStoping()
    if (isStoping) {
        throw new Error('nothingPlaying')
    }

    player.play().then( () => {
        logger.info('Resuming')
    })
}