import { Handler } from './index'
import { logger, message } from '../utils'
import { checkVolumeRange } from './volumeSetUtils'
import {
    VOLOME_STEP_DEFAULT,
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'
import { NluSlot, slotType } from 'hermes-javascript'

export const volumeDownHandler: Handler = async function (msg, flow, hermes, player) {
    logger.debug('volumeDownHandler')
    flow.end()

    let change: any = VOLOME_STEP_DEFAULT
    let slot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'volume_lower', {
        onlyMostConfident: true,
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })
    if (slot) {
        change = slot.value.value
    }
    let newVolume = checkVolumeRange(player.volume - change)

    await player.saveVolume(newVolume)
}