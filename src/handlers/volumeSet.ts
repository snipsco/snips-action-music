import { Handler } from './index'
import { logger } from 'snips-toolkit'
import { extractVolumeNumber } from './volumeSetUtils'

export const volumeSetHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('volumeSetHandler')
    flow.end()
    
    let volume = extractVolumeNumber(msg, options.confidenceScore.slotDrop)
    await player.saveVolume(volume)
}