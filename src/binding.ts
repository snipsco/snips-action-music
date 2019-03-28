import { Dialog, Hermes } from 'hermes-javascript'
import { SNIPS_PREFIX } from './constants'
import handlers from './handlers'
import { 
    sessionStarted,
    sessionEnded
} from './handlers'

import { SnipsPlayer } from './snipsPlayer';

export const onIntentDetected = function (hermes: Hermes, player: SnipsPlayer) {
    const dialog: Dialog = hermes.dialog()
    dialog.flows([
        // Music playing request intent
        {
            intent: `${SNIPS_PREFIX}playMusic`, 
            action: (msg, flow) => handlers.playMusic(msg, flow, hermes, player)
        },
        // Music controlling intent
        {
            intent: `${SNIPS_PREFIX}previousSong`,
            action: (msg, flow) => handlers.previousSong(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}nextSong`,
            action: (msg, flow) => handlers.nextSong(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}speakerInterrupt`,
            action: (msg, flow) => handlers.speakerInterrupt(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}resumeMusic`,
            action: (msg, flow) => handlers.resumeMusic(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}volumUp`,
            action: (msg, flow) => handlers.volumUp(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}volumDown`,
            action: (msg, flow) => handlers.volumDown(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}volumSet`,
            action: (msg, flow) => handlers.volumSet(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}getInfo`,
            action: (msg, flow) => handlers.getInfo(msg, flow, hermes, player)
        }
    ])
}

export const onSessionToggle = function (hermes: Hermes, player: SnipsPlayer) {
    const dialog: Dialog = hermes.dialog()

    // Subscribe to system event
    dialog.on('session_started', message => {
        sessionStarted(message, hermes, player)
    })

    // Subscribe to system event
    dialog.on('session_ended', message => {
        sessionEnded(message, hermes, player)
    })
}