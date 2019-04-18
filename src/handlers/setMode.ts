import { Handler } from './index'
import { logger, message } from '../utils'
import { NluSlot, slotType } from 'hermes-javascript'

export const setModeHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('setModeHandler')
    flow.end()
    
    let slot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'play_mode', {
        onlyMostConfident: true,
        threshold: options.confidenceScore.slotDrop
    })
    
    const mode: string | null = slot ? slot.value.value : null

    if (!mode) {
        throw new Error('noSlotValueFound')
    }

    await player.setMode(mode)
}