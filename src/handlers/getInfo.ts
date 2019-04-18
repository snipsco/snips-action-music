import { Handler } from './index'
import { logger, translation, message } from '../utils'
import { NluSlot, slotType } from 'hermes-javascript'

export const getInfoHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('getInfoHandler')
    flow.end()

    const slot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'music_item', {
        onlyMostConfident: true,
        threshold: options.confidenceScore.slotDrop
    })
    const slotValue = slot ? slot.value.value : null
    
    const info = await player.getPlayingInfo()

    if (!info) {
        throw new Error('nothingPlaying')
    }

    switch (slotValue) {
        case 'track':
            return translation.randomTranslation('info.reportTrack', {
                track: info.title
            })
        case 'song':
            return translation.randomTranslation('info.reportTrack', {
                track: info.title
            })
        case 'artist':
            return translation.randomTranslation('info.reportArtist', {
                artist: info.artist
            })
        case 'album':
            return translation.randomTranslation('info.reportAlbum', {
                album: info.album
            })
        default:
            return translation.randomTranslation('info.playTrackArtist', {
                track: info.title,
                artist: info.artist
            })
    }
}