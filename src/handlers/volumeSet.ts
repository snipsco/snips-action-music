import { Handler } from './index'
import { logger } from '../utils/logger'
import { extractVolumeNumber } from './volumeSetUtils'

export const volumeSetHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('volumeSetHandler')

    let volume = extractVolumeNumber(msg)

    player.saveVolume(volume)
    flow.end()
}