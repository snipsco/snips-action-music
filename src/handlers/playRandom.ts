import { Handler } from './index'
import { logger, mode, translation } from '../utils'

export const playRandomHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('playRandom')
    mode.setPlaying(hermes.dialog())
    flow.end()

    const playlistRaw: string = await player.getLoadedPlaylistRandom()
    const playlist: string = playlistRaw.replace('.m3u', '')

    logger.debug('found playlist: ', playlist)

    await player.loadPlaylistIfPossible(playlist)

    await player.play()
}