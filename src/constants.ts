export const DEFAULT_LOCALE = 'english'
export const SUPPORTED_LOCALES = [ 'english', 'french' ]
export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGE_MAPPINGS = {
    english: 'en',
    french: 'fr'
}
export const DEFAULT_MQTT_CONNECTION = {
    host: 'localhost',
    port: 1883
}
export const DEFAULT_MPD_CONNECTION = {
    host: 'localhost',
    port: 6600
}
export const SNIPS_PREFIX = 'dfercastrosnipsadmin:'
export const INTENT_CONFIDENCE_STANDERD = 0.7
export const INTENT_CONFIDENCE_BAD = 0.3
export const SLOT_CONFIDENCE_THRESHOLD = 0.5
export const ASR_TOKENS_CONFIDENCE_THRESHOLD = 0.2
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