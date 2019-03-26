import { i18nFactory } from '../factories'
import { Handler } from './index'
import { logger } from '../utils/logger'

export const speakerInterruptHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('speakerInterruptHandler')
    // Ready to be set 
    player.stop()
    flow.end()

    // Return the TTS speech.
    // const i18n = i18nFactory.get()
    // return i18n()
}