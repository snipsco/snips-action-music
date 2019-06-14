import { Dialog } from 'hermes-javascript'
import { 
    SNIPS_PREFIX,
    MODE_ALWAYS_ENABLED,
    MODE_INIT_DISABLED,
    MODE_PLAYING_ENABLED,
    MODE_PLAYING_DISABLED,
    MODE_PAUSING_ENABLED,
    MODE_PAUSING_DISABLED,
    MODE_ALWAYS_DISABLED,
    INTENTS
} from '../constants'

interface intentConfiguration {
    intentId: string
    enable: boolean
}

function getIntentList(enabledIntent: string[], disabledIntent: string[]): intentConfiguration[] {
    const res = new Array()
    // add always enabled intent to the list
    MODE_ALWAYS_ENABLED.forEach(intent => {
        res.push({
            intentId: `${SNIPS_PREFIX}${intent}`,
            enable: true
        })
    })
    // add always disabled intent to the list
    if (MODE_ALWAYS_DISABLED.length > 0) {
        MODE_ALWAYS_DISABLED.forEach(intent => {
            res.push({
                intentId: `${SNIPS_PREFIX}${intent}`,
                enable: false
            })
        })
    }

    // add specific enabled intent to the list
    enabledIntent.forEach(intent => {
        res.push({
            intentId: `${SNIPS_PREFIX}${intent}`,
            enable: true
        })
    })
    // add disabled intent to the list
    disabledIntent.forEach(intent => {
        res.push({
            intentId: `${SNIPS_PREFIX}${intent}`,
            enable: false
        })
    })

    return res
}

export const mode = {
    setAllEnabled(dialog: Dialog) {
        const intentList = new Array()
        INTENTS.forEach(intent => {
            intentList.push({
                intentId: `${SNIPS_PREFIX}${intent}`,
                enable: true
            })
        })
        dialog.publish('configure', {
            siteId: 'default',
            intents: intentList
        })
    },
    setInit(dialog: Dialog) {
        const intentList = getIntentList([], MODE_INIT_DISABLED)
        dialog.publish('configure', {
            siteId: 'default',
            intents: intentList
        })
    },
    setPlaying(dialog: Dialog) {
        const intentList = getIntentList(MODE_PLAYING_ENABLED, MODE_PLAYING_DISABLED)
        dialog.publish('configure', {
            siteId: 'default',
            intents: intentList
        })
    },
    setPausing(dialog: Dialog) {
        const intentList = getIntentList(MODE_PAUSING_ENABLED, MODE_PAUSING_DISABLED)
        dialog.publish('configure', {
            siteId: 'default',
            intents: intentList
        })
    }
}