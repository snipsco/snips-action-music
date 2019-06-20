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

const thresholds: ConfidenceThresholds = {
    intent: INTENT_PROBABILITY_THRESHOLD,
    asr: ASR_UTTERANCE_CONFIDENCE_THRESHOLD
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

// Add handlers here, and wrap them.
export default {
    playMusic: handler.wrap(playMusicHandler, thresholds),
    playRandom: handler.wrap(playRandomHandler, thresholds),
    previousSong: handler.wrap(previousSongHandler, thresholds),
    nextSong: handler.wrap(nextSongHandler, thresholds),
    speakerInterrupt: handler.wrap(speakerInterruptHandler, thresholds),
    resumeMusic: handler.wrap(resumeMusicHandler, thresholds),
    volumeUp: handler.wrap(volumeUpHandler, thresholds),
    volumeDown: handler.wrap(volumeDownHandler, thresholds),
    volumeSet: handler.wrap(volumeSetHandler, thresholds),
    getInfo: handler.wrap(getInfoHandler, thresholds),
    injectionControl: handler.wrap(injectionControlHandler, thresholds),
    setMode: handler.wrap(setModeHandler, thresholds),
    selfIntroduction: handler.wrap(selfIntroductionHandler, thresholds)
}

export * from './sessionEnded'
export * from './sessionStarted'