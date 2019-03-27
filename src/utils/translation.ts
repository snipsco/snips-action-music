import { i18nFactory } from '../factories/i18nFactory'
import { logger } from '../utils/logger'

function randomTranslation (key: string | string[], opts: {[key: string]: any}): string {
    const i18n = i18nFactory.get()
    const possibleValues = i18n(key, { returnObjects: true, ...opts })
    if(typeof possibleValues === 'string')
        return possibleValues
    const randomIndex = Math.floor(Math.random() * possibleValues.length)
    return possibleValues[randomIndex]
}

export const translation = {
    // Takes an array from the i18n and returns a random item.
    randomTranslation,
    // Outputs an error message based on the error object, or a default message if not found.
    errorMessage: async (error: Error): Promise<string> => {
        let i18n = i18nFactory.get()

        if(!i18n) {
            await i18nFactory.init()
            i18n = i18nFactory.get()
        }

        if(i18n) {
            return randomTranslation(`error.${error.message}`, {})
        } else {
            return 'Oops, something went wrong.'
        }
    }
}