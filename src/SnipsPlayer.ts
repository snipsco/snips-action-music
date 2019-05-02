import { MPC } from 'mpc-js'
import { logger } from './utils/logger'
import { Dialog } from 'hermes-javascript'

interface SnipsPlayerInitOptions {
    host?: string
    port?: number
    defaultVolume?: number
    volumeAutoReset?: boolean
    volumeTimeout?: number
    playerMode?: string
    volumeSilence?: number
    onReady?: any
    onDisconnect?: any
    onConnectionFaild?: any
    onPlaying?: any
    onPausing?: any
    onStopping?: any
}

enum PlayerMode {
    random,
    repeat,
    single,
    sequence
}

/**
 * Music player wrapper, interfacing intent handler with low level apis.
 */
export class SnipsPlayer {
    // Main object to be interfaced
    dialog: Dialog
    player: MPC

    // MPD client connection info
    host: string
    port: number
    
    // Player settings
    volume: number
    volumeSilence: number
    
    // Volume auto-rest
    volumeAutoReset: boolean
    volumeTimeout: number
    volumeTimeoutEntity: any = null

    // Default mode
    playerMode: PlayerMode

    // Player status
    isReady: boolean = false

    // On ready callback
    onReady: any = null

    // On disconnect callback
    onDisconnect: any = null

    // On connection faild callback
    onConnectionFaild: any = null

    onPlaying: any = null
    onPausing: any = null
    onStopping: any = null

    constructor(dialog: Dialog, options: SnipsPlayerInitOptions) {
        this.dialog = dialog
        this.player = new MPC()

        this.host = options.host || 'localhost'
        this.port = options.port || 6600
        this.volume = options.defaultVolume || 80
        this.volumeSilence = options.volumeSilence || 20
        this.volumeAutoReset = options.volumeAutoReset || false
        this.volumeTimeout = options.volumeTimeout || 30
        this.playerMode = options.playerMode ? PlayerMode[options.playerMode] : PlayerMode.sequence
        this.onReady = options.onReady || null
        this.onDisconnect = options.onDisconnect || null
        this.onConnectionFaild = options.onConnectionFaild || null
        this.onPlaying = options.onPlaying || null
        this.onPausing = options.onPausing || null
        this.onStopping = options.onStopping || null
        this.__startMonitoring()
    }

    /**
     * Retrying for setting up connection
     * 
     * @param reconnectTimes 
     */
    async connect(reconnectTimes: number, gapSeconds: number) {
        let reconnect = 0
        do {
            await this.player.connectTCP(this.host, this.port)
            if (this.isReady) {
                return
            }
            await new Promise(resolve => setTimeout(resolve, gapSeconds * 1000))

            if (reconnect < reconnectTimes) {
                reconnect += 1
            } else {
                this.onConnectionFaild()
                throw new Error('mpcConnectionError')
            }
        } while (!this.isReady)
    }

    /**
     * Add event listener to the MPD. When it's ready, initialise the play status
     */
    __startMonitoring() {
        this.player.addListener('ready', () => {
            this.__init()
            this.onReady()
        })
    
        this.player.addListener('socket-error', () => {
            this.isReady = false
            this.onConnectionFaild()
            throw new Error('mpdConnectionFaild')
        })
        
        this.player.addListener('socket-end', () => {
            this.isReady = false
            this.onDisconnect()
            throw new Error('mpdConnectionEnd')
        })

        this.player.addListener('changed-player', () => {
            
            this.__getStatus().then((status) => {
                // Volume resetting
                if (this.volumeAutoReset && (status.state == 'pause' || status.state == 'stop')) {
                    this.volumeTimeoutEntity = setTimeout(() => {
                        this.saveVolume(80)
                        logger.debug('volume has been turned back')
                    }, this.volumeTimeout * 1000)
                } else if (this.volumeAutoReset && !(status.state == 'pause' || status.state == 'stop')) {
                    clearTimeout(this.volumeTimeoutEntity)
                }

                if (status.state == 'play') {
                    this.onPlaying()
                }

                if (status.state == 'pause') {
                    this.onPausing()
                }

                if (status.state == 'stop') {
                    this.onStopping()
                }
            })
        })
    }

    /**
     * Initialise player as soon as it's ready
     */
    __init() {
        this.isReady = true
        this.setVolumeToNormal()
        this.stop()
        this.setMode()
        logger.info('MPD client is ready to use')
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

    // Play mode setting
    /**
     * Set player mode
     * 
     * @param mode {string}
     */
    setMode(mode: string | null = null) {
        this.playerMode = PlayerMode[mode || PlayerMode[this.playerMode]]
        logger.debug('setting player to: ', this.playerMode)

        switch(this.playerMode) {
            case PlayerMode.random:
                return this.__setToRandom()
            case PlayerMode.repeat:
                return this.__setToRepeat()
            case PlayerMode.single:
                return this.__setToSingle()
            case PlayerMode.sequence:
                return this.__setToSequence()
            default:
                return this.__setToSequence()
        }
    }

    /**
     * Play in random order
     */
    __setToRandom() {
        return this.player.playbackOptions.setRandom(true)
        .then(() => {
            return this.player.playbackOptions.setRepeat(false)
        })
        .then(() => {
            return this.player.playbackOptions.setSingle(false)
        })
    }

    /**
     * Play in sequential order
     */
    __setToSequence() {
        return this.player.playbackOptions.setRandom(false)
        .then(() => {
            return this.player.playbackOptions.setRepeat(false)
        })
        .then(() => {
            return this.player.playbackOptions.setSingle(false)
        })
    }

    /**
     * Repeat the entire list (endless mode)
     */
    __setToRepeat() {
        return this.player.playbackOptions.setRandom(true)
        .then(() => {
            return this.player.playbackOptions.setRepeat(true)
        })
        .then(() => {
            return this.player.playbackOptions.setSingle(false)
        })
    }

    /**
     * Repeat the single song
     */
    __setToSingle() {
        return this.player.playbackOptions.setRandom(false)
        .then(() => {
            return this.player.playbackOptions.setRepeat(true)
        })
        .then(() => {
            return this.player.playbackOptions.setSingle(true)
        })
    }

    /**
     * Get the current playing info
     */
    getPlayingInfo() {
        return this.__getStatus()
        .then((res) => {
            logger.debug(res)
            if (res.state == 'stop' || res.state == 'pause') {
                throw new Error('nothingPlaying')
            }
            return this.__getCurrentSong()
        })
    }

    /**
     * Check if the player is playing 
     */
    isPlaying() {
        return this.__getStatus()
        .then((res) => {
            return res.state == 'play' ? true : false
        })
    }

    /**
     * Check if the player is stoping 
     */
    isStoping() {
        return this.__getStatus()
        .then((res) => {
            return res.state == 'stop' ? true : false
        })
    }

    /**
     * Wrapper method
     */
    __getStatus() {
        return this.player.status.status()
    }
    /**
     * Wrapper method
     */
    __getCurrentSong() {
        return this.player.status.currentSong()
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
    /**
     * Wrapper method, check if there are songs found by the condtions
     * @param song 
     * @param album 
     * @param artist 
     */
    __checkExistance(song: string | undefined, album: string | undefined, artist: string | undefined) {
        return this.player.database.search([
            ['Title', song ? song : ''], 
            ['Album', album ? album : ''], 
            ['Artist', artist ? artist : '']
        ])
    }

    /**
     * Wrapper method, found the songs by condtiosn, add to the playlist
     * @param song 
     * @param album 
     * @param artist 
     */
    __createPlayList(song: string | undefined, album: string | undefined, artist: string | undefined) {
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
    createPlayListIfPossible(song: string | undefined, album: string | undefined, artist: string | undefined) {
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

    /**
     * Check if the provided playlist is exist
     * @param playlist 
     */
    __checkExistancePlaylist(playlist: string) {
        return this.player.storedPlaylists.listPlaylist(`${playlist.toLowerCase()}.m3u`)
    }

    /**
     * Load the provided playlist to current playlist
     * @param playlist 
     */
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
    loadPlaylistIfPossible(playlist: string | undefined) {
        if (!playlist) {
            throw new Error('no playlist provided')
        }
        return this.__checkExistancePlaylist(String(playlist))
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

    /**
     * Get all the registered songs/ playlists/ directories
     */
    __getAllMPDEntities() {
        return this.player.database.listAll()
    }

    /**
     * Get a random playlist
     */
    getLoadedPlaylistRandom() {
        return this.__getAllMPDEntities()
        .then(res => {
            let playlists: string[] = []
            res.forEach((entity => {
                if (entity.match('\.m3u')) {
                    playlists.push(entity)
                }
            }))

            return playlists[Math.floor((Math.random() * playlists.length))]
        })
    }
}