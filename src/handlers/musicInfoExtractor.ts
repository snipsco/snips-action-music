import { message, logger, camelize } from '../utils'
import { IntentMessage, slotType, NluSlot } from 'hermes-javascript'
import {
    INTENT_CONFIDENCE_THRESHOLD,
    SLOT_CONFIDENCE_THRESHOLD,
    ASR_TOKENS_CONFIDENCE_THRESHOLD
} from '../constants'

export interface musicInfoRes {
    songName?: string
    playlistName?: string
    albumName?: string
    artistName?: string
}

export const musicInfoExtractor = function(msg: IntentMessage): musicInfoRes {
    //logger.debug('message intent: %o', msg)

    if (msg.intent.confidenceScore < INTENT_CONFIDENCE_THRESHOLD) {
        throw new Error('intentNotRecognized -> lowThreshold')
    }

    if (message.getAsrConfidence(msg) < ASR_TOKENS_CONFIDENCE_THRESHOLD) {
        throw new Error('intentNotRecognized -> lowGeometricMean')
    }

    let slot_names_raw = [
        'song_name',
        'playlist_name',
        'album_name',
        'artist_name'
    ]

    let res: musicInfoRes = {}

    slot_names_raw.forEach( (slot_name_raw) => {
        let tempSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, slot_name_raw, {
            onlyMostConfident: true,
            threshold: SLOT_CONFIDENCE_THRESHOLD
        })
        if (tempSlot) {
            res[camelize.camelize(slot_name_raw)] = tempSlot.value.value
        }
    })

    logger.debug('Extracted: %o', res)
    return res
}