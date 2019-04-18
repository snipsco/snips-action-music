import { translation, logger, message } from '../utils'
import { FlowContinuation, IntentMessage, FlowActionReturn, Hermes } from 'hermes-javascript'

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
import { SnipsPlayer } from '../SnipsPlayer';

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
const handlerWrapper = (handler: Handler): Handler => (
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
            return await translation.errorMessage(error)
        }
    }
)

// Add handlers here, and wrap them.
export default {
    playMusic: handlerWrapper(playMusicHandler),
    playRandom: handlerWrapper(playRandomHandler),
    previousSong: handlerWrapper(previousSongHandler),
    nextSong: handlerWrapper(nextSongHandler),
    speakerInterrupt: handlerWrapper(speakerInterruptHandler),
    resumeMusic: handlerWrapper(resumeMusicHandler),
    volumeUp: handlerWrapper(volumeUpHandler),
    volumeDown: handlerWrapper(volumeDownHandler),
    volumeSet: handlerWrapper(volumeSetHandler),
    getInfo: handlerWrapper(getInfoHandler),
    injectionControl: handlerWrapper(injectionControlHandler),
    setMode: handlerWrapper(setModeHandler),
    selfIntroduction: handlerWrapper(selfIntroductionHandler)
}

export * from './sessionEnded'
export * from './sessionStarted'