import { IntentMessage, slotType, NluSlot } from 'hermes-javascript'
import { message, logger } from '../utils'
import {
    SLOT_CONFIDENCE_THRESHOLD,
    VOLUME_MINIMUM,
    VOLUME_MAXIMUM
} from '../constants'

export const checkVolumeRange = function (rawVolume: number): number {
    return rawVolume > VOLUME_MAXIMUM ? VOLUME_MAXIMUM : rawVolume < VOLUME_MINIMUM ? VOLUME_MINIMUM : rawVolume
}

export const extractVolumeNumber = function(msg: IntentMessage): number {

    let slotNamesRaw = [
        'volumeSetAbsolute',
        'volumeSetPercentage',
        'volumeSetMinMax'
    ]

    let res: any = {}

    slotNamesRaw.forEach( (slotNameRaw) => {
        let tempSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, slotNameRaw, {
            onlyMostConfident: true,
            threshold: SLOT_CONFIDENCE_THRESHOLD
        })
        if (tempSlot) {
            res[slotNameRaw] = tempSlot.value.value
        }
    })

    if (res.volumeSetMinMax == 'minimum') {
        return VOLUME_MINIMUM;
    }

    if (res.volumeSetMinMax == 'maximum') {
        return VOLUME_MAXIMUM;
    }

    if (res.volumeSetAbsolute) {
        return checkVolumeRange(res.volumeSetAbsolute)
    }

    if (res.volumeSetPercentage) {
        return checkVolumeRange(res.volumeSetPercentage)
    }

    // If no value found, report an intent error
    throw new Error('nluIntentErrorStanderd')
}