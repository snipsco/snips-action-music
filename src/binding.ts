import { Dialog, Hermes } from 'hermes-javascript'
import handlers, { HandlerOptions } from './handlers'
import { sessionStarted, sessionEnded } from './handlers'
import { config } from 'snips-toolkit'
import { SnipsPlayer } from './SnipsPlayer'

export const onIntentDetected = function(
    hermes: Hermes,
    players: SnipsPlayer[],
    options: HandlerOptions
) {
    const dialog: Dialog = hermes.dialog()
    dialog.flows([
        {
            intent: `${ config.get().assistantPrefix }:PlayMusic`,
            action: (msg, flow) => handlers.playMusic(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:PreviousSong`,
            action: (msg, flow) => handlers.previousSong(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:NextSong`,
            action: (msg, flow) => handlers.nextSong(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:StopSilence`,
            action: (msg, flow) => handlers.speakerInterrupt(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:ResumeMusic`,
            action: (msg, flow) => handlers.resumeMusic(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:VolumeUp`,
            action: (msg, flow) => handlers.volumeUp(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:VolumeDown`,
            action: (msg, flow) => handlers.volumeDown(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:VolumeSet`,
            action: (msg, flow) => handlers.volumeSet(msg, flow, hermes, players, options)
        },
        {
            intent: `${ config.get().assistantPrefix }:GetInfos`,
            action: (msg, flow) => handlers.getInfo(msg, flow, hermes, players, options)
        }
    ])
}

export const onSessionToggle = function(hermes: Hermes, players: SnipsPlayer[]) {
    const dialog: Dialog = hermes.dialog()

    // Subscribe to system event
    dialog.on('session_started', message => {
        sessionStarted(message, hermes, players)
    })

    // Subscribe to system event
    dialog.on('session_ended', message => {
        sessionEnded(message, hermes, players)
    })
}
