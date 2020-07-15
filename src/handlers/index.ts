import { handler, ConfidenceThresholds } from 'snips-toolkit'
import { playMusicHandler } from './playMusic'
import { previousSongHandler } from './previousSong'
import { nextSongHandler } from './nextSong'
import { speakerInterruptHandler } from './speakerInterrupt'
import { resumeMusicHandler } from './resumeMusic'
import { volumeUpHandler } from './volumeUp'
import { volumeDownHandler } from './volumeDown'
import { volumeSetHandler } from './volumeSet'
import { getInfoHandler } from './getInfo'
import { injectionControlHandler } from './injectionControl'
import { playRandomHandler } from './playRandom'
import { setModeHandler } from './setMode'
import { selfIntroductionHandler } from './selfIntroduction'
import { SnipsPlayer } from '../SnipsPlayer'
import { FlowContinuation, IntentMessage, FlowActionReturn, Hermes } from 'hermes-javascript'
import { logger, i18n, message } from 'snips-toolkit'

export type Handler = (
    message: IntentMessage,
    flow: FlowContinuation,
    hermes: Hermes,
    player: SnipsPlayer,
    options: HandlerOptions
) => FlowActionReturn
type Handlers = (
    message: IntentMessage,
    flow: FlowContinuation,
    hermes: Hermes,
    players: SnipsPlayer[],
    options: HandlerOptions
) => FlowActionReturn

export interface HandlerOptions {
    confidenceScore: ConfidenceScore
} 

interface ConfidenceScore {
    intentStandard: number
    intentDrop: number
    slotStandard?: number
    slotDrop: number
    asrStandard?: number
    asrDrop: number
}

// Wrap handlers to gracefully capture errors
const handlerWrapperCustom = (handler: Handler): Handlers => (
    async (msg, flow, hermes, players, options) => {
        //logger.debug('message: %O', msg)
        try {
            // Check confidenceScore before call the handler
            if (msg.intent.confidenceScore < options.confidenceScore.intentDrop) {
                throw new Error('nluIntentErrorBad')
            }

            if (msg.intent.confidenceScore < options.confidenceScore.intentStandard) {
                throw new Error('nluIntentErrorStanderd')
            }
        
            if (message.getAsrConfidence(msg) < options.confidenceScore.asrDrop) {
                throw new Error('asrError')
	    }
            const player = players.find(player => player.siteId == msg.customData) || players.find(player => player.siteId == msg.siteId) || players[0]
            const tts = await handler(msg, flow, hermes, player, options)

            return tts
        } catch (error) {
            flow.end()
            logger.error(error.message)
            return await i18n.randomTranslation('error.' + error.message, {})
        }
    }
)

// Add handlers here, and wrap them.
export default {
    playMusic: handler.wrap(handlerWrapperCustom(playMusicHandler)),
    playRandom: handler.wrap(handlerWrapperCustom(playRandomHandler)),
    previousSong: handler.wrap(handlerWrapperCustom(previousSongHandler)),
    nextSong: handler.wrap(handlerWrapperCustom(nextSongHandler)),
    speakerInterrupt: handler.wrap(handlerWrapperCustom(speakerInterruptHandler)),
    resumeMusic: handler.wrap(handlerWrapperCustom(resumeMusicHandler)),
    volumeUp: handler.wrap(handlerWrapperCustom(volumeUpHandler)),
    volumeDown: handler.wrap(handlerWrapperCustom(volumeDownHandler)),
    volumeSet: handler.wrap(handlerWrapperCustom(volumeSetHandler)),
    getInfo: handler.wrap(handlerWrapperCustom(getInfoHandler)),
    injectionControl: handler.wrap(handlerWrapperCustom(injectionControlHandler)),
    setMode: handler.wrap(handlerWrapperCustom(setModeHandler)),
    selfIntroduction: handler.wrap(handlerWrapperCustom(selfIntroductionHandler))
}

export * from './sessionEnded'
export * from './sessionStarted'
