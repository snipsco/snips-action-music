import { Handler } from './index'
import { logger, translation } from '../utils'
import { 
    musicInfoExtractor,
    musicInfoRes,
    getScenario
} from './playMusicUtils'
import { playRandomHandler } from './playRandom'

export const playMusicHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('playMusicHandler')
    flow.end()
    const music: musicInfoRes | null = musicInfoExtractor(msg, options.confidenceScore.slotDrop)
    
    if (music && music.artistName && music.artistName.toLowerCase().includes('cancel')) {
        flow.end()
        return
    }

    if (!music) {
        if (msg.intent.confidenceScore >= 0.7) {
            // No slot detected, but hight confidence score, then play random
            return playRandomHandler(msg, flow, hermes, player, options)
        } else {
            // No slot detected, but low confidence score, then error
            throw new Error('noSlotValueFound')
        } 
    }

    if (
        !music.songName && 
        !music.albumName && 
        !music.artistName && 
        music.playlistName == 'something'
    ) {
        // Only playlist name with something detected, play random
        return playRandomHandler(msg, flow, hermes, player, options)
    }

    const scenario: string = getScenario(music)
    let notFoundFlag: boolean = false

    // Play by condition composed of song?, artist?, album? (list)
    if (
        scenario === 'A' ||
        scenario === 'B' ||
        scenario === 'C'
    ) {
        try {
            await player.createPlayListIfPossible(
                music.songName, 
                music.albumName, 
                music.artistName
            )
        } catch (error) {
            if (error.message == 'notFound') {
                notFoundFlag = true
            } else {
                throw error
            }
        }
    }

    // Load an exist playlist
    if (scenario === 'D') {
        logger.debug('Scenario D')
        try {
            await player.loadPlaylistIfPossible(music.playlistName)            
        } catch (error) {
            if (error.message == 'notFound') {
                notFoundFlag = true
            } else {
                throw error
            }
        }
    }

    if (!notFoundFlag) {
        await player.play()
    }

    switch (scenario) {
        case 'A':
            return music.artistName ? 
            
            translation.random(notFoundFlag ? 
                'error.notFound.playTrackArtist':
                'info.playTrackArtist', {
                track: music.songName,
                artist: music.artistName
            }): 
            
            translation.random(notFoundFlag ? 
                'error.notFound.playTrack':
                'info.playTrack', {
                track: music.songName
            })
        case 'B':
            return music.albumName ? 
            
            translation.random(notFoundFlag ? 
                'error.notFound.playAlbumArtist':
                'info.playAlbumArtist', {
                album: music.albumName,
                artist: music.artistName
            }) : 
            
            translation.random(notFoundFlag ? 
                'error.notFound.playAlbum':
                'info.playAlbum', {
                album: music.albumName
            })
        case 'C':
            return translation.random(notFoundFlag ?
                'error.notFound.playArtist':
                'info.playArtist', {
                artist: music.artistName
            })
        case 'D': 
            return translation.random(notFoundFlag ?
                'error.notFound.playPlaylist':
                'info.playPlaylist', {
                playlist: music.playlistName
            })
    }
}
