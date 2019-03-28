import { MPC } from 'mpc-js'
import { logger } from './utils/logger'
import { Dialog } from 'hermes-javascript';

interface SnipsPlayerInitOptions {
    host?: string
    port?: number
    defaultVolume?: number
    enableRandom?: boolean
}

export class SnipsPlayer {
    // Main object to be interfaced
    dialog: Dialog
    player: MPC

    // MPD client setting
    host: string = 'localhost'
    port: number = 6600
    
    // Player settings
    volume: number = 80
    volumeSilence: number = 40
    enableRandom: boolean = true

    // Player status
    isReady: boolean = false

    constructor(dialog: Dialog, options: SnipsPlayerInitOptions) {
        this.dialog = dialog
        this.player = new MPC()
        if (options.host) {
            this.host = options.host
        }
       
        if (options.port) {
            this.port = options.port
        }

        if (options.defaultVolume) {
            this.volume = options.defaultVolume
        }

        if ( options.enableRandom ) {
            this.enableRandom = options.enableRandom
        }

        this.__startMonitoring()
        this.player.connectTCP(this.host, this.port)
    }

    // Player controlling commands
    previous() {
        return this.player.playback.previous()
    }

    next() {
        return this.player.playback.next()
    }

    play() {
        return this.player.playback.play()
    }

    pause() {
        return this.player.playback.pause()
    }

    stop() {
        return this.player.playback.stop()
    }

    clear() {
        return this.player.currentPlaylist.clear()
    }

    /**
     * Wrapper method
     * 
     * @param volume 
     */
    __setVolume(volume: number) {
        return this.player.playbackOptions.setVolume(volume)
    }

    /**
     * Set volume to a given level
     * 
     * @param volume 
     */
    saveVolume(volume: number) {
        this.volume = volume
        return this.__setVolume(this.volume)
    }

    /**
     * Set the volume to silence level
     */
    setVolumeToSilence() {
        return this.__setVolume(this.volumeSilence)
    }

    /**
     * Set the volume back to normal level
     */
    setVolumeToNormal() {
        return this.__setVolume(this.volume)
    }

    // Interfacing to 'playMusic' intent
    __checkExistance(song: string, album: string, artist: string) {
        return this.player.database.search([
            ['Title', song ? song : ''], 
            ['Album', album ? album : ''], 
            ['Artist', artist ? artist : '']
        ])
    }

    __createPlayList(song: string, album: string, artist: string) {
        return this.player.database.searchAdd([
            ['Title', song ? song : ''], 
            ['Album', album ? album : ''], 
            ['Artist', artist ? artist : '']
        ])
    }

    /**
     * Check if the inputs is sufficient to create a playlist.
     * If yes, clear the current list and create the new list.
     * If no, throw an error 'notFound' which will be handled by handler wrapper.
     * 
     * @param song 
     * @param album 
     * @param artist 
     */
    createPlayListIfPossible(song: string, album: string, artist: string) {
        return this.__checkExistance(song, album, artist)
        .then((res) => {
            if (!res.length) {
                throw new Error('notFound')
            } else {
                return this.clear()
            }
        })
        .then(() => {
            return this.__createPlayList(song, album, artist)
        })
    }

    __checkExistancePlaylist(playlist: string) {
        return this.player.storedPlaylists.listPlaylist(`${playlist.toLowerCase()}.m3u`)
    }

    __loadSongFromSavedPlaylist(playlist: string) {
        return this.player.storedPlaylists.load(`${playlist.toLowerCase()}.m3u`)
    }

    /**
     * Check if the required playlist is exist.
     * If yes, clear the current list and load the target list.
     * If no, throw an error 'notFound' which will be handled by handler wrapper.
     * 
     * @param playlist 
     */
    loadPlaylistIfPossible(playlist: string) {
        return this.__checkExistancePlaylist(playlist)
        .then((res) => {
            if (!res.length) {
                logger.debug(res)
                logger.debug('did not pass checking')
                throw new Error('notFound')
            } else {
                return this.clear()
            }
        })
        .catch(() => {
            throw new Error('notFound')
        })
        .then(() => {
            return this.__loadSongFromSavedPlaylist(playlist)
        })
    }

    __startMonitoring() {
        this.player.addListener('ready', () => {
            this.isReady = true
            this.setVolumeToNormal()
            logger.info('MPD client is ready to use')
        })
    
        this.player.addListener('socket-error', () => {
            this.isReady = false
            throw new Error('connection faild')
        })
        
        this.player.addListener('socket-end', () => {
            this.isReady = false
            throw new Error('connection lost')
        })
    }
}