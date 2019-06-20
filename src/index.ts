import { mode } from './utils'
import { 
    onIntentDetected,
    onSessionToggle
} from './binding'
import { SnipsPlayer } from './SnipsPlayer'
import { HandlerOptions } from './handlers'
import { Hermes, Done } from 'hermes-javascript'
import { config, i18n, logger } from 'snips-toolkit'
import { Enums } from 'hermes-javascript/types'
import {
    INTENT_PROBABILITY_THRESHOLD,
    INTENT_FILTER_PROBABILITY_THRESHOLD,
    SLOT_CONFIDENCE_THRESHOLD,
    ASR_UTTERANCE_CONFIDENCE_THRESHOLD
} from './constants'

// Enables deep printing of objects.
process.env.DEBUG_DEPTH = undefined

export default async function ({
    hermes,
    done
}: {
    hermes: Hermes,
    done: Done 
}) {
    try {
        const { name } = require('../package.json')
        logger.init(name)
        // Replace 'error' with '*' to log everything
        logger.enable('error')

        config.init()
        await i18n.init(config.get().locale)

        const dialog = hermes.dialog()

        const say: any = (text: string, siteId?: string) => {
            dialog.publish('start_session', {
                init: {
                    type: Enums.initType.notification,
                    text
                },
                siteId
            })
        }

        const onPlaying = () => {
            // Context control if it's enabled
            if(config.get().contextControl) {
                mode.setPlaying(dialog)
            }

            // Sound feedback control if it's enabled
            if(config.get().soundFeedbackControl) {
                hermes.feedback().publish('notification_off', {
                    siteId: 'default'
                })
            }
        }

        const onPausing = () => {
            // Context control if it's enabled
            if(config.get().contextControl) {
                mode.setPausing(dialog)
            }

            // Sound feedback control if it's enabled
            if(config.get().soundFeedbackControl) {
                hermes.feedback().publish('notification_on', {
                    siteId: 'default'
                })
            }
        }

        const onStopping = () => {
            // Context control if it's enabled
            if(config.get().contextControl) {
                mode.setInit(dialog)
            }

            // Sound feedback control if it's enabled
            if(config.get().soundFeedbackControl) {
                hermes.feedback().publish('notification_on', {
                    siteId: 'default'
                })
            }
        }

        const musicPlayer = new SnipsPlayer({
            host: String(config.get().mpdHost) || 'localhost',
            port: Number(config.get().mpdPort) || 6600,
            volumeAutoReset: Boolean(config.get().volumeAutoReset) || undefined,
            volumeTimeout: Number(config.get().volumeTimeout) || undefined,
            playerMode: String(config.get().playerModeDefault) || undefined,
            onReady: () => say(i18n.randomTranslation('info.ready', {})),
            onDisconnect: () => say(i18n.randomTranslation('error.mpdConnectionEnd', {})),
            onConnectionFaild: () => say(i18n.randomTranslation('error.mpdConnectionFaild', {})),
            onPlaying,
            onPausing,
            onStopping
        })

        // connect to mpd server, retry for 3 times in case it's booting
        await musicPlayer.connect(3, 30)

        if (!config.get().contextControl) {
            mode.setAllEnabled(dialog)
        }
        
        // subscribe to intent handlers
        const handlerOptions: HandlerOptions = {
            confidenceScore: {
                intentStandard: Number(config.get().confidenceIntentStanderd) || INTENT_PROBABILITY_THRESHOLD,
                intentDrop: Number(config.get().confidenceIntentDrop) || INTENT_FILTER_PROBABILITY_THRESHOLD,
                slotDrop: Number(config.get().confidenceSlotDrop) || SLOT_CONFIDENCE_THRESHOLD,
                asrDrop: Number(config.get().confidenceAsrDrop) || ASR_UTTERANCE_CONFIDENCE_THRESHOLD
            }
        }

        onIntentDetected(hermes, musicPlayer, handlerOptions)
        // subscribe to sessionStarted and sessionEnded
        onSessionToggle(hermes, musicPlayer)
    } catch (error) {
        // Output initialization errors to stderr and exit
        const message = await i18n.errorMessage(error)
        logger.error(message)
        logger.error(error)
        // Exit
        done()
    }
}