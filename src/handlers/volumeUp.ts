import { Handler } from './index'
import { logger, message } from '../utils'
import { checkVolumeRange } from './volumeSetUtils'
import {
    VOLOME_STEP_DEFAULT
} from '../constants'
import { NluSlot, slotType } from 'hermes-javascript'

export const volumeUpHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('volumeUpHandler')
    flow.end()

    let change: any = VOLOME_STEP_DEFAULT
    let slot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'volume_lower', {
        onlyMostConfident: true,
        threshold: options.confidenceScore.slotDrop
    })
    if (slot) {
        change = slot.value.value
    }
    let newVolume = checkVolumeRange(player.volume + change)

    await player.saveVolume(newVolume)
}