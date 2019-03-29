import { Handler } from './index'
import { logger, translation } from '../utils'

export const getInfoHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('getInfoHandler')
    flow.end()

    const info = await player.getPlayingInfo()

    if (!info) {
        throw new Error('nothingPlaying')
    }

    logger.debug(info)

    return translation.randomTranslation('info.playTrackArtist', {
        track: info.title,
        artist: info.artist
    })
}