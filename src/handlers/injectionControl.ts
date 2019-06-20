import { Handler } from './index'
import { logger, i18n, message } from 'snips-toolkit'
import { Enums } from 'hermes-javascript/types'

function startInjection(hermes) {
    hermes.injection().publish('injection_request', {
        id: 'walkman_injection',
        lexicon: {},
        operations: [
            [
                Enums.injectionKind.addFromVanilla,
                {
                    'snips/musicAlbum': [
                        'sweet baguette',
                        'crazy frank',
                        'lovely snipsters',
                        'fig trees'
                    ],
                    'snips/musicArtist': [
                        'baker\'s man',
                        'crazy snipsters',
                        'new orleans',
                        'super carman'
                    ]
                }
            ]
        ]
    })
}

function deleteInjection(hermes) {
    hermes.injection().publish('injection_request', {
        id: 'walkman_injection',
        lexicon: { },
        operations: [
            [
                Enums.injectionKind.addFromVanilla,
                {
                    'snips/musicAlbum': [
                        'fake'
                    ],
                    'snips/musicArtist': [
                        'fake'
                    ]
                }
            ]
        ]
    })
}

export const injectionControlHandler: Handler = async function (msg, flow, hermes, player, options) {
    logger.debug('injectionControlHandler')
    flow.end()

    let res = message.getSlotsByName(msg, 'if_revert', {
        onlyMostConfident: true,
        threshold: options.confidenceScore.slotDrop
    })

    if (res) {
        deleteInjection(hermes)
        return i18n.randomTranslation('info.deleteInjection', {})
    } else {
        startInjection(hermes)
        return i18n.randomTranslation('info.startInjection', {})
    }
}