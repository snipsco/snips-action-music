import { i18nFactory } from '../factories'
import { Handler } from './index'
import { logger } from '../utils/logger'
import { musicInfoExtractor, musicInfoRes } from './musicInfoExtractor'

export const playMusicHandler: Handler = async function (msg, flow, hermes) {
    logger.debug('playMusicHandler')
    
    let music: musicInfoRes = musicInfoExtractor(msg)

    // End the dialog session.
    flow.end()

    // Return the TTS speech.
    // const i18n = i18nFactory.get()
    // return i18n()
}
