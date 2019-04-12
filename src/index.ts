import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import { mode, translation, logger } from './utils'
import { 
    onIntentDetected,
    onSessionToggle
} from './binding'
import { SnipsPlayer } from './SnipsPlayer'

// Initialize hermes
export default function ({
    hermesOptions = {
        // debug mock
        address: 'snips-assistant-demo.local:1883'
    },
    bootstrapOptions = {},
    snipsPlayerOptions = {
        host: '192.168.171.148'
    }
} = {}) : Promise<() => void>{
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                // Bootstrap config, locale, i18n…
                await bootstrap(bootstrapOptions)

                hermes.feedback().publish('notification_off', {
                    siteId: 'default'
                })

                let musicPlayer = new SnipsPlayer(hermes.dialog(), snipsPlayerOptions)

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