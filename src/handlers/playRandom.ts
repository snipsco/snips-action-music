import { Handler } from './index'
import { logger } from 'snips-toolkit'

export const playRandomHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('playRandom')
    flow.end()

    const playlistRaw: string = await player.getLoadedPlaylistRandom()
    const playlist: string = playlistRaw.replace('.m3u', '')

    logger.debug('found playlist: ', playlist)

    await player.loadPlaylistIfPossible(playlist)

    await player.play()
}