import { Dialog, Hermes } from 'hermes-javascript'
import { SNIPS_PREFIX } from './constants'
import handlers from './handlers'
import { 
    sessionStarted,
    sessionEnded
} from './handlers'

import { SnipsPlayer } from './SnipsPlayer'

export const onIntentDetected = function (hermes: Hermes, player: SnipsPlayer) {
    const dialog: Dialog = hermes.dialog()
    dialog.flows([
        // Music playing request intent
        {
            intent: `${SNIPS_PREFIX}PlayMusic`, 
            action: (msg, flow) => handlers.playMusic(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}PlayRandom`, 
            action: (msg, flow) => handlers.playRandom(msg, flow, hermes, player)
        },
        // Music controlling intent
        {
            intent: `${SNIPS_PREFIX}PreviousSong`,
            action: (msg, flow) => handlers.previousSong(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}NextSong`,
            action: (msg, flow) => handlers.nextSong(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}SpeakerInterrupt`,
            action: (msg, flow) => handlers.speakerInterrupt(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}ResumeMusic`,
            action: (msg, flow) => handlers.resumeMusic(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}VolumeUp`,
            action: (msg, flow) => handlers.volumeUp(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}VolumeDown`,
            action: (msg, flow) => handlers.volumeDown(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}VolumeSet`,
            action: (msg, flow) => handlers.volumeSet(msg, flow, hermes, player)
        },
        {
            intent: `${SNIPS_PREFIX}GetInfos`,
            action: (msg, flow) => handlers.getInfo(msg, flow, hermes, player)
        },
        // Additional intent for demo
        {
            intent: `${SNIPS_PREFIX}InjectionControl`,
            action: (msg, flow) => handlers.injectionControl(msg, flow, hermes, player)
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