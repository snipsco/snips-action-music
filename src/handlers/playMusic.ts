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

    // Play by song's name
    if (scenario === 'A') {
        player.playBySongName(music.songName)
    }

    if (scenario === 'B') {
        
    }

    if (scenario === 'C') {
        player.byArtistName(music.artistName)
    }

    if (scenario === 'D') {
        
    }

    // End the dialog session.
    flow.end()

    // Return the TTS speech.
    // const i18n = i18nFactory.get()
    // return i18n()
}
