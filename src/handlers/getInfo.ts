import { Handler } from './index'
import { logger, i18n, message } from 'snips-toolkit'
import { NluSlot, slotType } from 'hermes-javascript/types'

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
            return i18n.randomTranslation('info.reportTrack', {
                track: info.title
            })
        case 'song':
            return i18n.randomTranslation('info.reportTrack', {
                track: info.title
            })
        case 'artist':
            return i18n.randomTranslation('info.reportArtist', {
                artist: info.artist
            })
        case 'album':
            return i18n.randomTranslation('info.reportAlbum', {
                album: info.album
            })
        default:
            return i18n.randomTranslation('info.playTrackArtist', {
                track: info.title,
                artist: info.artist
            })
    }
}