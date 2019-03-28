import { i18nFactory } from '../factories'
import { Handler } from './index'
import { logger } from '../utils/logger'

export const volumeUpHandler: Handler = async function (msg, flow, hermes) {
    logger.debug('volumeUpHandler')
    // Ready to be set 

    flow.end()

    // Return the TTS speech.
    // const i18n = i18nFactory.get()
    // return i18n()
}