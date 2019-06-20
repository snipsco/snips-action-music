import { message, logger, camelize } from 'snips-toolkit'
import { IntentMessage, slotType, NluSlot } from 'hermes-javascript/types'
import {
    SCENARIO_TABLE
} from '../constants'

export interface musicInfoRes {
    songName?: string
    playlistName?: string
    albumName?: string
    artistName?: string
}

export const musicInfoExtractor = function(msg: IntentMessage, slotDropRatio: number): musicInfoRes | null {
    //logger.debug('message intent: %o', msg)

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
            threshold: slotDropRatio
        })
        if (tempSlot) {
            res[camelize.camelize(slot_name_raw)] = tempSlot.value.value
        }
    })

    logger.debug('Extracted: %o', res)
    return (Object.keys(res).length === 0) ? null : res
}

export const getScenario = function(factor: musicInfoRes): string {
    let input_bin: number = 0b0000

    if (factor.songName) {
        input_bin |= 0b1000 
    }
    if (factor.albumName) {
        input_bin |= 0b0100 
    }
    if (factor.artistName) {
        input_bin |= 0b0010 
    }
    if (factor.playlistName) {
        input_bin |= 0b0001 
    }

    let res = SCENARIO_TABLE[input_bin]

    if (!res) {
        throw new Error('undefinedScenario')
    } 
    return res
}