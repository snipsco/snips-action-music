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
import { INTENT_PROBABILITY_THRESHOLD, ASR_UTTERANCE_CONFIDENCE_THRESHOLD } from '../constants'
import { logger, i18n, message } from 'snips-toolkit'

const thresholds: ConfidenceThresholds = {
    intent: 0,
    asr: 0
}

export type Handler = (
    message: IntentMessage,
    flow: FlowContinuation,
    hermes: Hermes,
    player: SnipsPlayer,
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
const handlerWrapperCustom = (handler: Handler): Handler => (
    async (msg, flow, hermes, player, options) => {
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

            const tts = await handler(msg, flow, hermes, player, options)

            return tts
        } catch (error) {
            flow.end()
            logger.error(error)
            return await i18n.randomTranslation('error.' + error.message, {})
        }
    }
)

// Add handlers here, and wrap them.
export default {
    playMusic: handler.wrap(handlerWrapperCustom(playMusicHandler), thresholds),
    playRandom: handler.wrap(handlerWrapperCustom(playRandomHandler), thresholds),
    previousSong: handler.wrap(handlerWrapperCustom(previousSongHandler), thresholds),
    nextSong: handler.wrap(handlerWrapperCustom(nextSongHandler), thresholds),
    speakerInterrupt: handler.wrap(handlerWrapperCustom(speakerInterruptHandler), thresholds),
    resumeMusic: handler.wrap(handlerWrapperCustom(resumeMusicHandler), thresholds),
    volumeUp: handler.wrap(handlerWrapperCustom(volumeUpHandler), thresholds),
    volumeDown: handler.wrap(handlerWrapperCustom(volumeDownHandler), thresholds),
    volumeSet: handler.wrap(handlerWrapperCustom(volumeSetHandler), thresholds),
    getInfo: handler.wrap(handlerWrapperCustom(getInfoHandler), thresholds),
    injectionControl: handler.wrap(handlerWrapperCustom(injectionControlHandler), thresholds),
    setMode: handler.wrap(handlerWrapperCustom(setModeHandler), thresholds),
    selfIntroduction: handler.wrap(handlerWrapperCustom(selfIntroductionHandler), thresholds)
}

export * from './sessionEnded'
export * from './sessionStarted'