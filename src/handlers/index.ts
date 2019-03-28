import { translation, logger, message } from '../utils'
import { FlowContinuation, IntentMessage, FlowActionReturn } from 'hermes-javascript'

import { playMusicHandler } from './playMusic'
import { previousSongHandler } from './previousSong'
import { nextSongHandler } from './nextSong'
import { speakerInterruptHandler } from './speakerInterrupt'
import { resumeMusicHandler } from './resumeMusic'
import { volumeUpHandler } from './volumeUp'
import { volumeDownHandler } from './volumeDown'
import { volumeSetHandler } from './volumeSet'
import { getInfoHandler } from './getInfo'

import {
    INTENT_CONFIDENCE_STANDERD,
    INTENT_CONFIDENCE_BAD,
    ASR_TOKENS_CONFIDENCE_THRESHOLD
} from '../constants'

export type Handler = (
    message: IntentMessage,
    flow: FlowContinuation,
    ...args: any[]
) => FlowActionReturn

// Wrap handlers to gracefully capture errors
const handlerWrapper = (handler: Handler): Handler => (
    async (msg, flow, ...args) => {
        //logger.debug('message: %O', msg)
        try {
            // Check confidenceScore before call the handler
            if (msg.intent.confidenceScore < INTENT_CONFIDENCE_BAD) {
                throw new Error('nluIntentErrorBad')
            }

            if (msg.intent.confidenceScore < INTENT_CONFIDENCE_STANDERD) {
                throw new Error('nluIntentErrorStanderd')
            }
        
            if (message.getAsrConfidence(msg) < ASR_TOKENS_CONFIDENCE_THRESHOLD) {
                throw new Error('asrError')
            }

            const tts = await handler(msg, flow, ...args)

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
    previousSong: handlerWrapper(previousSongHandler),
    nextSong: handlerWrapper(nextSongHandler),
    speakerInterrupt: handlerWrapper(speakerInterruptHandler),
    resumeMusic: handlerWrapper(resumeMusicHandler),
    volumeUp: handlerWrapper(volumeUpHandler),
    volumeDown: handlerWrapper(volumeDownHandler),
    volumeSet: handlerWrapper(volumeSetHandler),
    getInfo: handlerWrapper(getInfoHandler)
}

export * from './sessionEnded'
export * from './sessionStarted'