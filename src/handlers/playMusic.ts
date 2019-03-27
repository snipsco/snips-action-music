import { i18nFactory } from '../factories'
import { Handler } from './index'
import { logger } from '../utils/logger'
import { 
    musicInfoExtractor,
    musicInfoRes,
    getScenario
} from './playMusicUtils'

export const playMusicHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('playMusicHandler')
    let music: musicInfoRes = musicInfoExtractor(msg)

    if (!music) {
        flow.end()
        return
    }

    let scenario: string = getScenario(music)

    // Play by condition composed of song?, artist?, album? (list)
    if (
        scenario === 'A' ||
        scenario === 'B' ||
        scenario === 'C'
    ) {
        logger.debug('Scenario A - C')
        await player.createPlayListIfPossible(
            music.songName, 
            music.albumName, 
            music.artistName
        )
    }

    // Load an exist playlist
    if (scenario === 'D') {
        logger.debug('Scenario D')
        await player.loadPlaylistIfPossible(music.playlistName)
    }

    await player.play()
    flow.end()

    // Return the TTS speech.
    // const i18n = i18nFactory.get()
    // return i18n()
}
