import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import { translation, logger } from './utils'
import { SNIPS_PREFIX } from './constants'
import { 
    onIntentDetected,
    onSessionToggle
} from './binding'
import { SnipsPlayer } from './SnipsPlayer';

// Initialize hermes
export default function ({
    hermesOptions = {
        // debug mock
        address: '192.168.171.148:1883'
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

                let musicPlayer = new SnipsPlayer(hermes.dialog(), snipsPlayerOptions)

                logger.debug(`${SNIPS_PREFIX}playMusic`)

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