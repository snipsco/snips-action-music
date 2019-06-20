import { Handler } from './index'
import { logger } from 'snips-toolkit'

export const previousSongHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('previousSongHandler')
    flow.end()
    
    const state = await player.isPlaying()
    if (!state) {
        throw new Error('nothingPlaying')
    }

    player.previous().then( () => {
        logger.info('Playing the previous song')
    })
}