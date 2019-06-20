import { Handler } from './index'
import { logger, i18n } from 'snips-toolkit'

export const selfIntroductionHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('selfIntroduction')
    flow.end()

    return i18n.randomTranslation('info.selfIntroduction', {})
}