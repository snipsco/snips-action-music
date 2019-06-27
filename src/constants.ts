export const DEFAULT_MQTT_CONNECTION = {
    host: 'localhost',
    port: 1883
}
export const DEFAULT_MPD_CONNECTION = {
    host: 'localhost',
    port: 6600
}
export const INTENT_PROBABILITY_THRESHOLD: number =  0.5
export const INTENT_FILTER_PROBABILITY_THRESHOLD: number =  0.3
export const SLOT_CONFIDENCE_THRESHOLD: number =  0.5
export const ASR_UTTERANCE_CONFIDENCE_THRESHOLD: number =  0.2
// Binary table used to decide scenario by 2 input factor
// Weight: song - 8, album - 4, artist - 2, playlist - 1
export const SCENARIO_TABLE = {
    0b0001: 'D',
    0b0010: 'C',
    0b0011: 'C',
    0b0100: 'B',
    0b0101: 'B',
    0b0110: 'B',
    0b0111: 'B',
    0b1000: 'A',
    0b1001: 'A',
    0b1010: 'A',
    0b1011: 'A',
    0b1100: 'A',
    0b1101: 'A',
    0b1110: 'A',
    0b1111: 'A'
}
export const VOLUME_SILENCE = 20
export const VOLUME_MINIMUM = 20
export const VOLUME_MAXIMUM = 100
export const VOLOME_STEP_DEFAULT = 15
export const INTENTS: string[] = [
    'PlayMusic',
    'VolumeDown',
    'VolumeUp',
    'VolumeSet',
    'GetInfos',
    'PreviousSong',
    'NextSong',
    'ResumeMusic',
    'StopSilence'
]
// Intents which are always enabled
export const MODE_ALWAYS_ENABLED: string[] = [
    'PlayMusic',
    'VolumeDown',
    'VolumeUp',
    'VolumeSet'
]
export const MODE_ALWAYS_DISABLED: string[] = []
export const MODE_INIT_DISABLED: string[] = [
    'GetInfos',
    'PreviousSong',
    'NextSong',
    'ResumeMusic',
    'StopSilence'
]
export const MODE_PLAYING_ENABLED: string[] = [
    'GetInfos',
    'PreviousSong',
    'NextSong',
    'StopSilence'
]
export const MODE_PLAYING_DISABLED: string[] = ['ResumeMusic']
export const MODE_PAUSING_ENABLED: string[] = ['ResumeMusic']
export const MODE_PAUSING_DISABLED: string[] = [
    'GetInfos',
    'PreviousSong',
    'NextSong',
    'StopSilence'
]
