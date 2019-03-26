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
    next() {
        this.player.playback.next()
    }

    play() {
        this.player.playback.play()
    }

    stop() {
        this.player.playback.stop()
    }

    // Interfacing to 'playMusic' intent
    playBySongName(song: string) {
        let res = this.player.database.searchAdd([['Title', song]])
        logger.debug(res)
    }

    playByAlbumName(album: string) {

    }

    byArtistName(artist: string) {
        this.player.currentPlaylist.clear()
        this.player.database.searchAdd([['Artist', artist]])
        this.play()
    }

    playByPlaylistName(playlist: string) {

    }

    createPlayList(song: string, album: string, artist: string) {
          
    }

    __startMonitoring() {
        this.player.addListener('ready', () => {
            this.isReady = true
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