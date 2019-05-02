import { Handler } from './index'
import { logger, translation } from '../utils'

export const selfIntroductionHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('selfIntroduction')
    flow.end()

    return translation.random('info.selfIntroduction')
}