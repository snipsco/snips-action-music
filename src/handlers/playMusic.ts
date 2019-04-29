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

    if (!music) {
        if (msg.intent.confidenceScore >= 0.7) {
            // No slot detected, but hight confidence score, then play random
            return playRandomHandler(msg, flow, hermes, player, options)
        } else {
            // No slot detected, but low confidence score, then error
            throw new Error('noSlotValueFound')
        } 
    }

    if (!music.songName && !music.albumName && music.playlistName == 'something') {
        // Only playlist name with something detected, play random
        return playRandomHandler(msg, flow, hermes, player, options)
    }

    const scenario: string = getScenario(music)

    // Play by condition composed of song?, artist?, album? (list)
    if (
        scenario === 'A' ||
        scenario === 'B' ||
        scenario === 'C'
    ) {
        await player.createPlayListIfPossible(
            music.songName, 
            music.albumName, 
            music.artistName
        )
    }

    // Load an exist playlist
    if (scenario === 'D') {
        logger.debug('Scenario D')
        await player.loadPlaylistIfPossible(music.playlistName)
    }

    await player.play()

    switch (scenario) {
        case 'A':
            return music.artistName ? translation.randomTranslation('info.playTrackArtist' ,{
                track: music.songName,
                artist: music.artistName
            }): translation.randomTranslation('info.playTrack', {
                track: music.songName
            })
        case 'B':
            return music.albumName ? translation.randomTranslation('info.playAlbumArtist', {
                album: music.albumName,
                artist: music.artistName
            }) : translation.randomTranslation('info.playAlbum', {
                album: music.albumName
            })
        case 'C':
            return translation.randomTranslation('info.playArtist', {
                artist: music.artistName
            })
        case 'D': 
            return translation.randomTranslation('info.playPlaylist', {
                playlist: music.playlistName
            })
    }
}