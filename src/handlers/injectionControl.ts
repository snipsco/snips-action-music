import { Handler } from './index'
import { logger } from '../utils/logger'

export const injectionControlHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('injectionControlHandler')
    flow.end()
    
    
}