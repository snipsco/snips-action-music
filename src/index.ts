import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import { mode, translation, logger } from './utils'
import { configFactory } from './factories'
import { 
    onIntentDetected,
    onSessionToggle
} from './binding'
import { SnipsPlayer } from './SnipsPlayer'

// Initialize hermes
export default function ({
    hermesOptions = {
        // debug mock
        address: 'localhost:1883'
    },
    bootstrapOptions = {}
} = {}) : Promise<() => void>{
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                // Bootstrap config, locale, i18n…
                await bootstrap(bootstrapOptions)
                const config = configFactory.get()

                hermes.feedback().publish('notification_off', {
                    siteId: 'default'
                })

                const musicPlayer = new SnipsPlayer(hermes.dialog(), {
                    host: config.mpdHost || undefined,
                    port: Number(config.mpdPort) || undefined,
                    volumeAutoReset: Boolean(config.volumeAutoReset) || undefined,
                    volumeTimeout: Number(config.volumeTimeout) || undefined
                })

                logger.debug(config)

                mode.setInti(hermes.dialog())

                // subscribe to intent handlers
                onIntentDetected(hermes, musicPlayer)
                // subscribe to sessionStarted and sessionEnded
                onSessionToggle(hermes, musicPlayer)
    
                resolve(done)
            } catch (error) {
                // Output initialization errors to stderr and exit
                const message = await translation.errorMessage(error)
                logger.error(message)
                logger.error(error)
                // Exit
                done()
                // Reject
                reject(error)
            }
        }, hermesOptions)
    })
}