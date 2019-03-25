import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import handlers from './handlers'
import { translation, logger } from './utils'
import { SNIPS_PREFIX } from './constants'

// Initialize hermes
export default function ({
    hermesOptions = {
        // debug mock
        address: '192.168.171.148:1883'
    },
    bootstrapOptions = {}
} = {}) : Promise<() => void>{
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                // Bootstrap config, locale, i18n…
                await bootstrap(bootstrapOptions)

                const dialog = hermes.dialog()

                logger.debug(`${SNIPS_PREFIX}playMusic`)

                dialog.flows([
                    // Music playing request intent
                    {
                        intent: `${SNIPS_PREFIX}playMusic`, 
                        action: (msg, flow) => handlers.playMusic(msg, flow, hermes)
                    },
                    // Music controlling intent
                    {
                        intent: `${SNIPS_PREFIX}previousSong`,
                        action: (msg, flow) => handlers.previousSong(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}nextSong`,
                        action: (msg, flow) => handlers.nextSong(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}speakerInterrupt`,
                        action: (msg, flow) => handlers.speakerInterrupt(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}resumeMusic`,
                        action: (msg, flow) => handlers.resumeMusic(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}volumUp`,
                        action: (msg, flow) => handlers.volumUp(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}volumDown`,
                        action: (msg, flow) => handlers.volumDown(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}volumSet`,
                        action: (msg, flow) => handlers.volumSet(msg, flow, hermes)
                    },
                    {
                        intent: `${SNIPS_PREFIX}getInfo`,
                        action: (msg, flow) => handlers.getInfo(msg, flow, hermes)
                    }
                ])
                
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