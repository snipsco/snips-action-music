import { Handler } from './index'
import { logger, translation } from '../utils'
import { 
    musicInfoExtractor,
    musicInfoRes,
    getScenario
} from './playMusicUtils'

export const playMusicHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('playMusicHandler')
    flow.end()
    let music: musicInfoRes | null = musicInfoExtractor(msg, options.confidenceScore.slotDrop)

    if (!music) {
        throw new Error('noSlotValueFound')
    }

    let scenario: string = getScenario(music)

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