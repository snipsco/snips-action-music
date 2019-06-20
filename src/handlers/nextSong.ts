import { Handler } from './index'
import { logger } from 'snips-toolkit'

export const nextSongHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('nextSongHandler')
    flow.end()
    
    const state = await player.isPlaying()
    if (!state) {
        throw new Error('nothingPlaying')
    }

    player.next().then( () => {
        logger.info('Playing the next song')
    })
}